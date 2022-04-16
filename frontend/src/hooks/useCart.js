import { useState, useCallback } from "react";
import PropTypes from 'prop-types';

export function useCart() {
    const [items, setItems] = useState([]);
    const [state, setState] = useState(CartStates.Saisie);
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
    return { items, addItem, getTotal, state, toggleAnnulation }
}

export const CartStates = {
    Saisie: 0,
    Annulation: 1,
    PaiementEspeces: 2,
    PaiementCB: 2,
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
    state: PropTypes.oneOf([CartStates.Saisie, CartStates.Annulation, CartStates.PaiementEspeces, CartStates.PaiementCB])
}