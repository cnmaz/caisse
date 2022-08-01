import React from 'react';
import { useQuery } from 'react-query';
import { Button, CircularProgress, Alert } from '@mui/material';
import { useNavigate, useParams } from 'react-router';
import { Routes } from 'react-router-dom';
import { Route } from 'react-router-dom';
import { Form, Field } from 'react-final-form';
import './AdminProduct.scss';

function AdminCategoryList() {
    const navigate = useNavigate();
    const { data: category, loading: loadingCategory, error: errorCategory } = useQuery(["category"], () =>
        fetch('/api/category').then(res =>
            res.json()
        ))

    if (loadingCategory) {
        return <div className="product-grid-container"><CircularProgress /></div>
    }

    if (errorCategory) {
        return <div className="product-grid-container"><Alert severity="error">Impossible de charger les catégories</Alert></div>
    }

    return <div class="admin-container">
        <h1>Catégories</h1>
        <Button onClick={()=> navigate('new')}>Ajouter une catégorie</Button>
        <table>
            <thead>
                <tr>
                    <td>Nom</td>
                    <td>Ordre</td>
                    <td>Actions</td>
                </tr>
            </thead>
            <tbody>
                {category?.map(cat =>
                    <tr key={cat?.id}>
                        <td>{cat?.label}</td>
                        <td>{cat?.ordre}</td>
                        <td><Button onClick={() => navigate(cat?.id)}>Editer</Button></td>
                    </tr>
                )}
            </tbody>
        </table>
    </div>
}

function AdminCategoryForm() {
    const { data: categories, loading: loadingCategory, error: errorCategory } = useQuery(["category"], () =>
        fetch('/api/category').then(res =>
            res.json()
        ))
    const { id } = useParams();
    const navigate = useNavigate();

    if (loadingCategory) {
        return <div className="product-grid-container"><CircularProgress /></div>
    }

    if (errorCategory) {
        return <div className="product-grid-container"><Alert severity="error">Impossible de charger les catégories</Alert></div>
    }
    function onDelete() {
        fetch(`/api/category/${id}`, {
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
        fetch(`/api/category/${id}`, {
            method: 'PUT',
            body: JSON.stringify({
                label: val.label,
                ordre: val.ordre,
                id: id,
            }),
            headers:
                { "Content-Type": 'application/json' }
        }).then(() => navigate(".."))
    } else {
        fetch(`/api/category`, {
            method: 'POST',
            body: JSON.stringify({
                label: val.label,
                ordre: val.ordre,
                id: id,
            }),
            headers:
                { "Content-Type": 'application/json' }
        }).then(() => navigate("..")) 
    }
    }
    const category = categories?.filter(cat => cat.id === id)?.pop()
    return <Form
        onSubmit={onSubmit}
        initialValues={category}
        render={({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nom catégorie</label>
                    <Field name="label" component="input" placeholder="Catégorie" />
                </div>
                <div>
                    <label>Ordre</label>
                    <Field name="ordre" component="input" type="number" placeholder="1" />
                </div>
                <Button type="submit" variant="contained">Enregistrer</Button>&nbsp;
                <Button type="button"  variant="outlined" onClick={() => navigate('..')}>Annuler</Button>&nbsp;
                <Button type="button" onClick={() => onDelete()} color="error" variant="outlined">Supprimer</Button>
            </form>
        )}
    />
}

export default function AdminCategory() {
    return <Routes>
        <Route path="/" element={<AdminCategoryList />} />
        <Route path=":id" element={<AdminCategoryForm />} />
    </Routes>
}