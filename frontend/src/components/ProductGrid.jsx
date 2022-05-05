import { Alert, Badge, Button, CircularProgress } from '@mui/material';
import React from 'react';

import { func } from 'prop-types';

import { useQuery } from 'react-query';
import './ProductGrid.scss'
import { CartStates, CartType } from '../hooks/useCart';

export default function ProductGrid({ onClickProduct, cart }) {
    const { data: categories, loading: loadingCategories, error: errorCategories } = useQuery(["category"], () =>
        fetch('/api/category').then(res =>
            res.json()
        ))

    const { data: products, loading: loadingProducts, error: errorProducts } = useQuery(["products"], () =>
        fetch('/api/product').then(res =>
            res.json()
        ))


    if (loadingProducts || loadingCategories) {
        return <div className="product-grid-container"><CircularProgress /></div>
    }

    if (errorProducts || errorCategories) {
        return <div className="product-grid-container"><Alert severity="error">Impossible de charger les produits</Alert></div>
    }

    const numberOfProducts = (id) => {
        return cart?.items?.map(it => it.id).filter(it => it === id).length;
    }

    return <div className="product-grid-container">
        {categories
            ?.map(category =>
                <>
                    <div className="category-label"      >  {category.label}</div>
                    <ul>
                        {products
                            ?.filter(product => product.category_id === category.id)
                            ?.map(product => ({ ...product, price: parseFloat(product.price) }))
                            ?.map(product =>
                                <li>
                                    <Badge badgeContent={numberOfProducts(product.id)} color="primary" overlap="circular" key={product.id}>
                                        <Button variant="outlined" className="product" onClick={() => onClickProduct(product)} disabled={cart.state !== CartStates.Saisie && cart.state !== CartStates.Annulation}>
                                            {product?.label}
                                        </Button>
                                    </Badge>
                                </li>
                            )}
                    </ul>
                </>
            )}
    </div>
}

ProductGrid.propTypes = { onClickProduct: func.isRequired, cart: CartType }