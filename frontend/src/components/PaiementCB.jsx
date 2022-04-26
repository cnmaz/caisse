import './PaiementCB.scss'
import { useState } from 'react';
import { useEffect } from 'react';
import { useQuery } from 'react-query';

export default function PaiementCB({ cart }) {
    const useTPE = true;
    const [sent, setSent] = useState(false);
    const [result, setResult] = useState(undefined);

    const { data: payments } = useQuery(["payments"], () =>
        fetch('/pos/payments').then(res =>
            res.json()
        ),
        {
            // Refetch the data every second
            refetchInterval: 3000,
        });

    useEffect(() => {
        console.log(useTPE, sent, result, JSON.stringify(cart));
        if (useTPE && !cart?.paymentId && !sent) {
            const total = cart?.getTotal();
            if (total > 0) {
                fetch("/pos/debit/" + total)
                    .then(res => res.json())
                    .then(res => {
                        cart?.setPaymentId(res?.id);
                    });
                setSent(true);
            }
        }
    }, [sent, useTPE, cart])

    useEffect(() => {

        if (!payments || !cart?.paymentId) return
        if (cart?.paymentId in payments) {
            const result = payments[cart?.paymentId]?.result?.transaction_result;
            if (result === "7") {
                setResult(false);
            } else if (result === "0") {
                setTimeout(() => { cart?.validationPaiement() }, 3000);
                setResult(true);
            }
        }
    }, [payments, cart]);

    if (!useTPE) {

        return <div className="paiement-container">
            <h1>
                Paiement par carte bancaire
            </h1>
            <h2>Saisir le montant sur le TPE, puis gérer le paiement manuellement.</h2>
        </div>
    }

    return <div className="paiement-container">
        <h1>
            Paiement par carte bancaire
        </h1>
        {!sent && <h2>Envoi du montant au TPE en cours ...</h2>}
        {sent && !result && <h2>Montant envoyé au TPE</h2>}
        {sent && result === true && <h2>Paiement terminé</h2>}
        {sent && result === false && <h2>Paiement échoué</h2>}
        <p>ID : {JSON.stringify(cart?.paymentId)}</p>
        <p>Result {JSON.stringify(result)}</p>
    </div>
}