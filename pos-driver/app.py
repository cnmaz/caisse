#! /usr/bin/python
# -*- encoding: utf-8 -*-
##############################################################################
#
#    Hardware Telium Test script
#    Copyright (C) 2014 Akretion (http://www.akretion.com)
#    @author Alexis de Lattre <alexis.delattre@akretion.com>yy
#    
#    Modified in 2022
#    Copyright (C) 2022 Philippe TONY (https://github.com/philippetony)
#
#    This program is free software: you can redistribute it and/or modify
#    it under the terms of the GNU Affero General Public License as
#    published by the Free Software Foundation, either version 3 of the
#    License, or (at your option) any later version.
#
#    This program is distributed in the hope that it will be useful,
#    but WITHOUT ANY WARRANTY; without even the implied warranty of
#    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#    GNU Affero General Public License for more details.
#
#    You should have received a copy of the GNU Affero General Public License
#    along with this program.  If not, see <http://www.gnu.org/licenses/>.
#
##############################################################################

import queue
import uuid
from flask import Flask
from unittest.mock import Mock, MagicMock
import threading

from serial import Serial
import curses.ascii
import time
import pycountry
import traceback

app = Flask(__name__)

action_queue = queue.Queue()
processed_payments = {}


@app.route("/debit/<amount>")
def debit(amount):
    # transaction_start(float(amount), wait=False)
    id = uuid.uuid4()
    action_queue.put((float(amount), id))
    processed_payments[str(id)] = {"amount": float(amount), "state": "pending"}
    return {"id": str(id)}


@app.route("/credit/<amount>")
def credit(amount):
    # transaction_start(float(amount), credit=True, wait=False)
    id = uuid.uuid4()
    action_queue.put((-float(amount), id))
    processed_payments[str(id)] = {"amount": float(amount), "state": "pending"}
    return {"id": str(id)}


@app.route("/queue")
def queued_payments():
    return str(action_queue.qsize())


@app.route("/payments")
def payments():
    return processed_payments


@app.route("/payments/<id>")
def payment(id):
    if id not in processed_payments:
        return "", 404
    return processed_payments[id]


DEVICE = '/dev/ttyACM0'
DEVICE_RATE = 9600
PAYMENT_MODE = 'card'  # 'card' or 'check'
CURRENCY_ISO = 'EUR'


def open_real_serial():
    return Serial(DEVICE, DEVICE_RATE, timeout=3)


def open_mock_serial():
    serial_mock = MagicMock()
    serial_mock.read = Mock()
    # Good one
    serial_mock.read.side_effect = ['\06'.encode(), '\06'.encode(
    ), '\05'.encode(), '\x0201000000001B978          \x032'.encode(), '\x04'.encode()]
    # Bad one
    # serial_mock.read.side_effect = ['\06'.encode(), '\06'.encode(
    # ), '\05'.encode(), '\x02017000000010978          \x032'.encode(), '\x04'.encode()]
    return serial_mock


def open_serial():
    return open_mock_serial()


def serial_write(serial, text):
    assert isinstance(text, str), 'text must be a string'
    serial.write(text.encode())


def initialize_msg(serial):
    max_attempt = 3
    attempt_nr = 0
    while attempt_nr < max_attempt:
        attempt_nr += 1
        send_one_byte_signal(serial, 'ENQ')
        if get_one_byte_answer(serial, 'ACK'):
            return True
        else:
            print("Terminal : SAME PLAYER TRY AGAIN")
            send_one_byte_signal(serial, 'EOT')
            # Wait 1 sec between each attempt
            time.sleep(1)
    return False


def send_one_byte_signal(serial, signal):
    ascii_names = curses.ascii.controlnames
    assert signal in ascii_names, 'Wrong signal'
    char = ascii_names.index(signal)
    serial_write(serial, chr(char))
    print('Signal %s sent to terminal' % signal)


def get_one_byte_answer(serial, expected_signal, wait=False):
    while True:
        ascii_names = curses.ascii.controlnames
        one_byte_read = serial.read(1).decode()
        expected_char = ascii_names.index(expected_signal)
        if one_byte_read == chr(expected_char):
            print("%s received from terminal" % expected_signal)
            return True
        else:
            if len(one_byte_read) == 0:
                # print("waiting ...")
                pass
            else:
                print("%s received from terminal (expected %s)" %
                      (one_byte_read, expected_char))
                return False


def prepare_data_to_send(amount, credit=False, wait=True):
    if PAYMENT_MODE == 'check':
        payment_mode = 'C'
    elif PAYMENT_MODE == 'card':
        payment_mode = '1'
    else:
        print("The payment mode '%s' is not supported" % PAYMENT_MODE)
        return False
    cur_iso_letter = CURRENCY_ISO.upper()
    try:
        cur = pycountry.currencies.get(alpha_3=cur_iso_letter)
        cur_numeric = str(cur.numeric)
    except:
        print("Currency %s is not recognized" % cur_iso_letter)
        return False
    data = {
        'pos_number': str(1).zfill(2),
        'answer_flag': '0',
        'transaction_type': '1' if credit else '0',
        'payment_mode': payment_mode,
        'currency_numeric': cur_numeric.zfill(3),
        'private': ' ' * 10,
        'delay': 'A010' if wait else 'A011',
        'auto': 'B010',
        'amount_msg': ('%.0f' % (amount * 100)).zfill(8),
    }
    return data


def generate_lrc(real_msg_with_etx):
    lrc = 0
    for char in real_msg_with_etx:
        lrc ^= ord(char)
    return lrc


def send_message(serial, data):
    '''We use protocol E+'''
    ascii_names = curses.ascii.controlnames
    real_msg = (
        data['pos_number'] +
        data['amount_msg'] +
        data['answer_flag'] +
        data['payment_mode'] +
        data['transaction_type'] +
        data['currency_numeric'] +
        data['private'] +
        data['delay'] +
        data['auto'])
    print('Real message to send = %s' % real_msg)
    assert len(real_msg) == 34, 'Wrong length for protocol E+'
    real_msg_with_etx = real_msg + chr(ascii_names.index('ETX'))
    lrc = generate_lrc(real_msg_with_etx)
    message = chr(ascii_names.index('STX')) + real_msg_with_etx + chr(lrc)
    serial_write(serial, message)
    print('Message sent to terminal')


def compare_data_vs_answer(data, answer_data):
    for field in [
            'pos_number', 'amount_msg',
            'currency_numeric', 'private']:
        if data[field] != answer_data[field]:
            print(
                "Field %s has value '%s' in data and value '%s' in answer"
                % (field, data[field], answer_data[field]))


def parse_terminal_answer(real_msg, data):
    answer_data = {
        'pos_number': real_msg[0:2],
        'transaction_result': real_msg[2],
        'amount_msg': real_msg[3:11],
        'payment_mode': real_msg[11],
        'currency_numeric': real_msg[12:15],
        'private': real_msg[15:26],
    }
    print('answer_data = %s' % answer_data)
    compare_data_vs_answer(data, answer_data)
    return answer_data


def get_answer_from_terminal(serial, data):
    ascii_names = curses.ascii.controlnames
    full_msg_size = 1+2+1+8+1+3+10+1+1
    msg = serial.read(size=full_msg_size).decode()
    print('%d bytes read from terminal' % len(msg))
    assert len(msg) == full_msg_size, 'Answer has a wrong size'
    if msg[0] != chr(ascii_names.index('STX')):
        print('The first byte of the answer from terminal should be STX')
    if msg[-2] != chr(ascii_names.index('ETX')):
        print('The byte before final of the answer '
              'from terminal should be ETX')
    lrc = msg[-1]
    computed_lrc = chr(generate_lrc(msg[1:-1]))
    if computed_lrc != lrc:
        print(
            f'The LRC of the answer from terminal is wrong (exp: {computed_lrc} / got: {lrc})')
    real_msg = msg[1:-2]
    print('Real answer received = %s' % real_msg)
    return parse_terminal_answer(real_msg, data)


def transaction_start(amount, credit=False, wait=True):
    '''This function sends the data to the serial/usb port.
    '''
    serial = False
    try:
        print(
            'Opening serial port %s for payment terminal with '
            'baudrate %d' % (DEVICE, DEVICE_RATE))
        # IMPORTANT : don't modify timeout=3 seconds
        # This parameter is very important ; the Telium spec say
        # that we have to wait to up 3 seconds to get LRC
        serial = open_serial()
        print('serial.is_open = %s' % serial.isOpen())
        if initialize_msg(serial):
            data = prepare_data_to_send(amount, credit, wait)
            if not data:
                return
            send_message(serial, data)
            if get_one_byte_answer(serial, 'ACK'):
                send_one_byte_signal(serial, 'EOT')

                print("Now expecting answer from Terminal")
                if get_one_byte_answer(serial, 'ENQ'):
                    send_one_byte_signal(serial, 'ACK')
                    res = get_answer_from_terminal(serial, data)
                    send_one_byte_signal(serial, 'ACK')
                    if get_one_byte_answer(serial, 'EOT'):
                        print("Answer received from Terminal")
                        return res
        return None
    except Exception as e:
        print('Exception in serial connection: %s' % str(e))
        traceback.print_exception(e)
    finally:
        if serial:
            print('Closing serial port for payment terminal')
            serial.close()


def payment_handler(name):
    while True:
        try:
            (amount, id) = action_queue.get_nowait()
            print("<<< Action ", amount, id)
            processed_payments[str(id)]["state"] = "sent"
            res = transaction_start(amount, amount < 0, True)
            processed_payments[str(id)]["state"] = "finished"
            processed_payments[str(id)]["result"] = res
            action_queue.task_done()
        except queue.Empty:
            pass
        time.sleep(3)


paythread = threading.Thread(target=payment_handler, daemon=True, args=(1,))
paythread.start()

if __name__ == '__main__':
    debit(0.01)
