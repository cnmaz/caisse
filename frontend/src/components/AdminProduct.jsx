import React, { useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { Button, CircularProgress, Alert, Switch, FormControlLabel } from '@mui/material';
import { useNavigate, useParams } from 'react-router';
import { Routes } from 'react-router-dom';
import { Route } from 'react-router-dom';
import { Form, Field } from 'react-final-form';
import { formatCurrency } from '../utils';
import './AdminProduct.scss';

function AdminProductList() {
    const [showAll, setShowAll] = useState(false);
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { data: product, loading: loadingProduct, error: errorProduct } = useQuery(["product"], () =>
        fetch('/api/product').then(res =>
            res.json()
        ))

    const { data: categories, loading: loadingCategories, error: errorCategories } = useQuery(["category"], () =>
        fetch('/api/category').then(res =>
            res.json()
        ))

    if (loadingProduct | loadingCategories) {
        return <div className="product-grid-container"><CircularProgress /></div>
    }

    if (errorProduct | errorCategories) {
        return <div className="product-grid-container"><Alert severity="error">Impossible de charger les produits</Alert></div>
    }

    const togglePreparation = (product) => {
        const id = product.id;
        if (!id) { return; }
        fetch(`/api/product/${id}`, {
            method: 'PUT',
            body: JSON.stringify({
                ...product,
                preparation: product.preparation === "1" ? "0" : "1"
            }),
            headers:
                { "Content-Type": 'application/json' }
        }).then(() => {
            queryClient.invalidateQueries('product');
        });
    }
    const toggleActive = (product) => {
        const id = product.id;
        if (!id) { return; }
        fetch(`/api/product/${id}`, {
            method: 'PUT',
            body: JSON.stringify({
                ...product,
                active: product.active === "1" ? "0" : "1"
            }),
            headers:
                { "Content-Type": 'application/json' }
        }).then(() => {
            queryClient.invalidateQueries('product');
        });
    }

    return <div class="admin-container">
        <h1>Produits</h1>
        <FormControlLabel control={<Switch checked={showAll} onChange={(e) => setShowAll(e.target.checked)}></Switch>} label="Afficher tous les produits" />
        <Button onClick={() => navigate('new')}>Ajouter un produit</Button>
        <table>
            <thead>
                <tr>
                    <td>Nom</td>
                    <td>Catégorie</td>
                    <td>Prix</td>
                    <td>Ordre</td>
                    <td>Préparation</td>
                    <td>Actif</td>
                    <td>Actions</td>
                </tr>
            </thead>
            <tbody>
                {product?.filter((product) => showAll || product?.active === "1")
                    ?.map(produit =>
                    <tr key={produit?.id}>
                        <td>{produit?.label}</td>
                        <td>{categories?.filter(cat => cat.id === produit?.category_id)?.pop()?.label}</td>
                        <td>{formatCurrency(produit?.price)}</td>
                        <td>{produit?.ordre}</td>
                        <td><Button onClick={() => togglePreparation(produit)}>{produit?.preparation === "1" ? "✅" : "🟦"}</Button></td>
                        <td><Button onClick={() => toggleActive(produit)}>{produit?.active === "1" ? "✅" : "❌"}</Button></td>
                        <td><Button onClick={() => navigate(produit?.id)}>Editer</Button></td>
                    </tr>
                )}
            </tbody>
        </table>
    </div>
}

function AdminProductForm() {
    const { data: products, loading: loadingProduct, error: errorProduct } = useQuery(["product"], () =>
        fetch('/api/product').then(res =>
            res.json()
        ))

    const { data: categories, loading: loadingCategories, error: errorCategories } = useQuery(["category"], () =>
        fetch('/api/category').then(res =>
            res.json()
        ))

    const { id } = useParams();
    const navigate = useNavigate();

    if (loadingProduct | loadingCategories) {
        return <div className="product-grid-container"><CircularProgress /></div>
    }

    if (errorProduct | errorCategories) {
        return <div className="product-grid-container"><Alert severity="error">Impossible de charger les produits</Alert></div>
    }
    function onDelete() {
        fetch(`/api/product/${id}`, {
            method: 'DELETE',
            headers:
                { "Content-Type": 'application/json' }
        }).then((res) => {
            if (res.ok) {
                navigate("..");
            } else { res.text().then(alert) }
        })
    }
    function onSubmit(val) {
        if (id) {
            fetch(`/api/product/${id}`, {
                method: 'PUT',
                body: JSON.stringify({
                    label: val.label,
                    ordre: val.ordre,
                    category_id: val.category_id,
                    price: val.price,
                    preparation: val.preparation ? "1" : "0",
                    active: val.active ? "1" : "0",
                    id: id,
                }),
                headers:
                    { "Content-Type": 'application/json' }
            }).then(() => navigate(".."))
        } else {
            fetch(`/api/product`, {
                method: 'POST',
                body: JSON.stringify({
                    label: val.label,
                    ordre: val.ordre,
                    price: val.price,
                    category_id: val.category_id,
                    preparation: val.preparation ? "1" : "0",
                    active: val.active ? "1" : "0",
                    id: id,
                }),
                headers:
                    { "Content-Type": 'application/json' }
            }).then(() => navigate(".."))
        }
    }

    const product = products?.filter(cat => cat.id === id)?.map(product => ({ ...product, active: product?.active === "1", preparation: product?.preparation === "1" }))?.pop()
    return <Form
        onSubmit={onSubmit}
        initialValues={product}
        render={({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nom produit</label>
                    <Field name="label" component="input" placeholder="Produit" />
                </div>
                <div>
                    <label>Ordre</label>
                    <Field name="ordre" component="input" type="number" placeholder="1" />
                </div>
                <div>
                    <label>Tarif</label>
                    <Field name="price" component="input" type="number" placeholder="1" />
                </div>
                <div>
                    <label>Catégorie</label>
                    <Field name="category_id" component="select">
                        {categories?.map(cat =>
                            <option value={cat?.id} key={cat?.id}>{cat?.label}</option>
                        )}
                    </Field>
                </div>
                <div>
                    <label>S'affiche dans l'écran de préparation de commande (préparation en différé)</label>
                    <Field name="preparation" component="input" type="checkbox" />
                </div>
                <div>
                    <label>Affiché à l'écran (actif)</label>
                    <Field name="active" component="input" type="checkbox" />
                </div>
                <Button type="submit" variant="contained">Enregistrer</Button>&nbsp;
                <Button type="button" variant="outlined" onClick={() => navigate('..')}>Annuler</Button>&nbsp;
                <Button type="button" onClick={() => onDelete()} color="error" variant="outlined">Supprimer</Button>
            </form>
        )}
    />
}

export default function AdminProduct() {
    return <Routes>
        <Route path="/" element={<AdminProductList />} />
        <Route path="new" element={<AdminProductForm />} />
        <Route path=":id" element={<AdminProductForm />} />
    </Routes>
}