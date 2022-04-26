import { useState, useCallback, useEffect } from "react";
import PropTypes from 'prop-types';

export function useCart() {
    const [items, setItems] = useState([]);
    const [state, setState] = useState(CartStates.Paye);
    const [especesRecues, setEspecesRecues] = useState(0);
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
            const index = initial.lastIndexOf(item);
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

    const paiementCB = () => setState(CartStates.PaiementCB);
    const paiementEspeces = () => setState(CartStates.PaiementEspeces);
    const retourEdition = () => setState(CartStates.Saisie);
    const annulationPaiement = () => setState(CartStates.Annule);
    const validationPaiement = () => setState(CartStates.Paye);

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
            })
    }

    return { items, addItem, getTotal, state, toggleAnnulation, paiementCB, paiementEspeces, annulationPaiement, especesRecues, setEspecesRecues, nouveauClient, retourEdition, validationPaiement }
}

export const CartStates = {
    Saisie: 0,
    Annulation: 1,
    PaiementEspeces: 2,
    PaiementCB: 3,
    Paye: 4,
    Annule: 5
}

export const Product = PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired
});

export const CartType = {
    items: PropTypes.arrayOf(Product),
    addItem: PropTypes.func,
    getTotal: PropTypes.func,
    toggleAnnulation: PropTypes.func,
    paiementCB: PropTypes.func,
    paiementEspeces: PropTypes.func,
    annulationPaiement: PropTypes.func,
    nouveauClient: PropTypes.func,
    retourEdition: PropTypes.func,
    validationPaiement: PropTypes.func,
    setEspecesRecues: PropTypes.func,
    especesRecues: PropTypes.number,
    state: PropTypes.oneOf([CartStates.Saisie, CartStates.Annulation, CartStates.PaiementEspeces, CartStates.PaiementCB])
}