import { Alert, Button, CircularProgress } from '@mui/material';
import React from 'react';

import { useQuery } from 'react-query';
import './ProductGrid.scss'

export default function ProductGrid() {
    const { data: products, loading, error } = useQuery(["products"], () =>
        fetch('/api/product').then(res =>
            res.json()
        ))

    if (loading) {
        return <div className="product-grid-container"><CircularProgress /></div>
    }

    if (error) {
        return <div className="product-grid-container"><Alert severity="error">Impossible de charger les produits</Alert></div>
    }

    return <div className="product-grid-container">
        <ul>
            {products?.map(product =>
                <Button variant="outlined">{product?.label}</Button>
            )}
        </ul>
    </div>
}