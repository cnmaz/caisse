import { useState } from "react";
import PropTypes from 'prop-types';

export function useCart() {
    const [items, setItems] = useState([]);
    const addItem = (item) => setItems(initial => [...initial, item]);
    const getTotal = () => items?.map(item => parseFloat(item.price))?.reduce((acc, it) => acc + it, 0);
    return { items, addItem, getTotal }
}

export const Product = PropTypes.shape({
    label: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired
});

export const CartType = {
    items: PropTypes.arrayOf(Product),
    addItem: PropTypes.func,
    getTotal: PropTypes.func
}