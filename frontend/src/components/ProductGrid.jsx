import React from 'react';

import { useQuery } from 'react-query';
import Button from './Button'

export default function ProductGrid() {
    const { data: products, loading, error } = useQuery(["products"], () =>
        fetch('/api/product').then(res =>
            res.json()
        ))

    if (loading) {
        return <div>Loading ...</div>
    }

    if (error) {
        return <div>Ooops</div>
    }

    return <ul>
        {products?.map(product =>
            <Button>{product?.label}</Button>
        )}
    </ul>
}