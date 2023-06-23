import { useState, useCallback, useEffect } from "react";
import PropTypes from 'prop-types';
import { interactivePos } from "../config";

export function useCart() {
    const [items, setItems] = useState([]);
    const [state, setState] = useState(CartStates.Paye);
    const [name, setName] = useState("");
    const [especesRecues, setEspecesRecues] = useState(0);
    const [paymentId, setPaymentId] = useState(undefined);
    const [modePaiement, setModePaiement] = useState(undefined);
    const [cartId, setCartId] = useState(undefined);

    useEffect(() => {
        if (!cartId) return;
        fetch(`/api/sale/${cartId}`, {
            method: 'PUT',
            body: JSON.stringify({
                state: state,
                mode: modePaiement,
                id: cartId,
                name: name,
                products: items.map(it => ({ ...it, "product_id": it?.item?.id, "state": it?.state ?? ProductStates.AFaire, item: undefined }))
            }),
            headers:
                { "Content-Type": 'application/json' }
        })
    }, [items, cartId, state, name]);

    const addItem = useCallback((item) => setItems(initial => {
        if (state === CartStates.Annulation) {
            const found = initial.find(it => it?.item?.id === item.id);
            const index = initial.lastIndexOf(found);
            if (index === -1) { return initial; }
            return initial.filter((_, idx) => idx !== index);
        } else {
            return [...initial, { item, state: ProductStates.AFaire }]
        }
    }), [state, setItems]);

    const getTotal = () => items?.map(item => parseFloat(item?.item?.price))?.reduce((acc, it) => acc + it, 0);
    const toggleAnnulation = () => {
        if (state === CartStates.Annulation) {
            setState(CartStates.Saisie);
        } else {
            setState(CartStates.Annulation);
        }
    }

    const paiementCB = () => {
        setModePaiement('CB');
        const total = getTotal();
        if (total > 0) {
            setState(CartStates.PaiementCB);
            if (interactivePos)
                fetch("/pos/debit/" + total)
                    .then(res => res.json())
                    .then(res => {
                        setPaymentId(res?.id);
                    });
            return;
        }
        if (total < 0) {
            setState(CartStates.PaiementCB);
            if (interactivePos) 
                fetch("/pos/credit/" + (-total))
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
        setModePaiement('Esp');
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
        console.log(sale)
        setCartId(sale.id);
        setItems(sale.items);
        setState(sale.state);
        setName(sale.name);
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
                setName(undefined)
                setPaymentId(undefined);
            })
    }

    return {
        items, addItem, getTotal, state, toggleAnnulation, paiementCB, paiementEspeces, annulationPaiement,
        especesRecues, setEspecesRecues, nouveauClient, retourEdition, validationPaiement, miseEnAttente,
        paymentId, setPaymentId, historiqueVentes, ouvrirVente, setName, name
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
    Servi: 8,
}


export const ProductStates = {
    AFaire: 0,
    EnPreparation: 1,
    Servi: 2
}


export const CartStatesLabels = Object.keys(CartStates).reduce((acc, it) => ({ ...acc, [CartStates[it]]: it }), {})
export const ProductStatesLabels = Object.keys(ProductStates).reduce((acc, it) => ({ ...acc, [ProductStates[it]]: it }), {})

export const Product = PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    state: PropTypes.number
});

export const CartType = PropTypes.shape({
    items: PropTypes.arrayOf(PropTypes.shape({
        item: (Product),
        state: PropTypes.oneOf(Object.values(ProductStates))
    })),
    name: PropTypes.string,
    setName: PropTypes.func,
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