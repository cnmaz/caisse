import { useState, useCallback, useEffect } from "react";
import PropTypes from 'prop-types';

export function useCart() {
    const [items, setItems] = useState([]);
    const [state, setState] = useState(CartStates.Paye);
    const [especesRecues, setEspecesRecues] = useState(0);
    const [paymentId, setPaymentId] = useState(undefined);
    const [cartId, setCartId] = useState(undefined);

    useEffect(() => {
        if (!cartId) return;
        fetch(`/api/sale/${cartId}`, {
            method: 'PUT',
            body: JSON.stringify({
                state: state,
                id: cartId,
                products: items.map(it => it.id)
            }),
            headers:
                { "Content-Type": 'application/json' }
        })
    }, [items, cartId, state]);

    const addItem = useCallback((item) => setItems(initial => {
        if (state === CartStates.Annulation) {
            const found = initial.find(it => it.id === item.id);
            const index = initial.lastIndexOf(found);
            if (index === -1) { return initial; }
            return initial.filter((_, idx) => idx !== index);
        } else {
            return [...initial, item]
        }
    }), [state, setItems]);

    const getTotal = () => items?.map(item => parseFloat(item.price))?.reduce((acc, it) => acc + it, 0);
    const toggleAnnulation = () => {
        if (state === CartStates.Annulation) {
            setState(CartStates.Saisie);
        } else {
            setState(CartStates.Annulation);
        }
    }

    const paiementCB = () => {
        const total = getTotal();
        if (total > 0) {
            setState(CartStates.PaiementCB);
            fetch("/pos/debit/" + total)
                .then(res => res.json())
                .then(res => {
                    setPaymentId(res?.id);
                });
            return;
        }
        if (total < 0) {
            setState(CartStates.PaiementCB);
            fetch("/pos/credit/" + total)
                .then(res => res.json())
                .then(res => {
                    setPaymentId(res?.id);
                });
            return;
        }
        if (items?.length > 0) {
            setState(CartStates.Paye);
        }
    };
    const paiementEspeces = () => {
        if (getTotal() !== 0) {
            setState(CartStates.PaiementEspeces);
        } else {
            setState(CartStates.Paye);
        }
    }
    const retourEdition = () => { setState(CartStates.Saisie); setPaymentId(undefined); };
    const miseEnAttente = () => setState(CartStates.EnAttente);
    const annulationPaiement = () => setState(CartStates.Annule);
    const validationPaiement = () => setState(CartStates.Paye);
    const historiqueVentes = () => {
        setCartId(undefined);
        setState(CartStates.HistoriqueVentes)
    }
    const ouvrirVente = (sale) => {
        if (!sale.id || !sale.items) return;
        if (sale.state === CartStates.Saisie || sale.state === CartStates.EnAttente || sale.state === CartStates.Annule) {
            sale.state = CartStates.Saisie
        }
        setCartId(sale.id);
        setItems(sale.items);
        setState(sale.state);
    }


    const nouveauClient = () => {
        fetch('/api/sale', {
            method: 'POST',
            body: JSON.stringify({ state: CartStates.Saisie }),
            headers:
                { "Content-Type": 'application/json' }
        })
            .then(response => response.json())
            .then(res => {
                setCartId(res.id);
                setEspecesRecues(0);
                setItems([]);
                setState(CartStates.Saisie);
                setPaymentId(undefined);
            })
    }

    return {
        items, addItem, getTotal, state, toggleAnnulation, paiementCB, paiementEspeces, annulationPaiement,
        especesRecues, setEspecesRecues, nouveauClient, retourEdition, validationPaiement, miseEnAttente,
        paymentId, setPaymentId, historiqueVentes, ouvrirVente
    }
}

export const CartStates = {
    Saisie: 0,
    Annulation: 1,
    PaiementEspeces: 2,
    PaiementCB: 3,
    Paye: 4,
    Annule: 5,
    EnAttente: 6,
    HistoriqueVentes: 7,
}

export const CartStatesLabels = Object.keys(CartStates).reduce((acc, it) => ({ ...acc, [CartStates[it]]: it }), {})

export const CartCBStates = {
    NA: 0,
    Pending: 1,
    Sent: 2,
    OK: 3,
    KO: 4,
}

export const Product = PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired
});

export const CartType = PropTypes.shape({
    items: PropTypes.arrayOf(Product),
    addItem: PropTypes.func,
    getTotal: PropTypes.func,
    toggleAnnulation: PropTypes.func,
    paiementCB: PropTypes.func,
    paiementEspeces: PropTypes.func,
    annulationPaiement: PropTypes.func,
    nouveauClient: PropTypes.func,
    retourEdition: PropTypes.func,
    miseEnAttente: PropTypes.func,
    validationPaiement: PropTypes.func,
    historiqueVentes: PropTypes.func,
    ouvrirVente: PropTypes.func,
    setEspecesRecues: PropTypes.func,
    especesRecues: PropTypes.number,
    paymentId: PropTypes.string,
    setPaymentId: PropTypes.func,
    state: PropTypes.oneOf(Object.values(CartStates))
})