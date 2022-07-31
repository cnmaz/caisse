import React from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router';

export default function AdminHome() {
    const navigate = useNavigate();
    return <div>
        <Button onClick={() => navigate('category')}>Editer Catégories</Button>
        <Button onClick={() => navigate('product')}>Editer Produits</Button>
    </div>
}
