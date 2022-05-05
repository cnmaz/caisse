import './PaiementCB.scss'
import { useState } from 'react';
import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { Button } from '@mui/material';
import { func } from 'prop-types';
import { CartType } from '../hooks/useCart';

export default function PaiementCB({ cart, setActiveTab }) {
    const useTPE = true;
    const [result, setResult] = useState(undefined);
    const sent = cart?.paymentId;

    const { data: payments } = useQuery(["payments"], () =>
        fetch('/pos/payments').then(res =>
            res.json()
        ),
        {
            // Refetch the data every second
            refetchInterval: 3000,
        });

    useEffect(() => {

        if (!payments || !cart?.paymentId) return
        if (cart?.paymentId in payments) {
            const result = payments[cart?.paymentId]?.result?.transaction_result;
            if (result === "7") {
                setResult(false);
            } else if (result === "0") {
                setTimeout(() => { cart?.validationPaiement(); setActiveTab('actions'); }, 3000);
                setResult(true);
            }
        }
    }, [payments, cart, setActiveTab]);

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
        {sent && result === false && <>
            <h2>Paiement échoué</h2>
            <div className="actions">
                <Button className="action" variant="contained" onClick={() => {
                    setResult(undefined)
                    cart?.paiementCB()
                }
                }>Réessayer</Button>
                <Button className="action" variant="outlined" onClick={cart?.retourEdition}>Annuler</Button>
            </div>
        </>}
        {/* <p>ID : {JSON.stringify(cart?.paymentId)}</p> */}
        {/* <p>Result {JSON.stringify(result)}</p> */}
    </div>
}
PaiementCB.propTypes = { cart: CartType, setActiveTab: func }
PaiementCB.defaultProps = { cart: undefined, setActiveTab: () => { } }