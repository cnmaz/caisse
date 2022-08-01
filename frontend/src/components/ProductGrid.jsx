import { Alert, Badge, Button, CircularProgress } from '@mui/material';
import React from 'react';

import { func } from 'prop-types';

import { useQuery } from 'react-query';
import './ProductGrid.scss'
import { CartStates, CartType } from '../hooks/useCart';
import OverlayActions from './OverlayActions'

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
        return cart?.items?.map(it => it?.item?.id).filter(it => it === id).length;
    }

    return <div className="product-grid-container">
        {!(cart.state !== CartStates.HistoriqueVentes && cart.state !== CartStates.Annule && cart.state !== CartStates.Paye && cart.state !== CartStates.EnAttente) && <div className="product-grid-overlay">
            <div>
                <OverlayActions cart={cart} />
            </div>
        </div>}
        <div className="product-grid">
            {categories
                ?.sort((a, b) => a?.ordre - b?.ordre)
                ?.map(category => {
                    const categoryProducts = products
                        ?.filter(product => product.category_id === category.id)
                        ?.filter(product => product.active === "1")
                        ?.map(product => ({ ...product, price: parseFloat(product.price) }));
                    if (categoryProducts?.length > 0) {
                        return (<div key={category?.id}>
                            <div className="category-label">{category.label}</div>
                            <ul>
                                {categoryProducts
                                    ?.sort((a, b) => a?.ordre - b?.ordre)
                                    ?.map(product =>
                                        <li key={product?.id}>
                                            <Badge badgeContent={numberOfProducts(product.id)} color="primary" overlap="circular" key={product.id}>
                                                <Button variant="outlined" className="product" onClick={() => onClickProduct(product)} disabled={cart.state !== CartStates.Saisie && cart.state !== CartStates.Annulation}>
                                                    {product?.label}
                                                </Button>
                                            </Badge>
                                        </li>
                                    )}
                            </ul>
                        </div>)
                    } else {
                        return <></>
                    }
                }
                )}
        </div>
    </div>
}

ProductGrid.propTypes = { onClickProduct: func.isRequired, cart: CartType }