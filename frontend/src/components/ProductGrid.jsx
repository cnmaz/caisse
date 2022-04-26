import { Alert, Badge, Button, CircularProgress } from '@mui/material';
import React from 'react';

import { func } from 'prop-types';

import { useQuery } from 'react-query';
import './ProductGrid.scss'
import { CartStates, CartType } from '../hooks/useCart';

export default function ProductGrid({ onClickProduct, cart }) {
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

    const numberOfProducts = (id) => {
        return cart?.items?.map(it => it.id).filter(it => it === id).length;
    }

    return <div className="product-grid-container">
        <ul>
            {products?.map(product =>
                <Badge badgeContent={numberOfProducts(product.id)} color="secondary" overlap="circular" key={product.id}>
                    <Button variant="outlined" className="product" onClick={() => onClickProduct(product)} disabled={cart.state !== CartStates.Saisie && cart.state !== CartStates.Annulation}>
                        {product?.label}
                    </Button>
                </Badge>
            )}
        </ul>
    </div>
}

ProductGrid.propTypes = { onClickProduct: func.isRequired, cart: CartType }