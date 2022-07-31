import React from 'react';
import { Routes, Route, useMatch, useNavigate } from 'react-router-dom';
import AdminHome from '../components/AdminHome';
import AdminProduct from '../components/AdminProduct';
import AdminCategory from '../components/AdminCategory';
import { Tabs, Tab } from '@mui/material';
    
export default function Admin() {
    const matchCategories = useMatch("/admin/category/*");
    const matchProduct = useMatch("/admin/product/*");
    const navigate = useNavigate();
    const value = matchCategories ? 0 : (matchProduct ? 1 : undefined)
    const navigateTab = (_, val) => {
        if (val === 0) { navigate('/admin/category') }
        if (val === 1) { navigate('/admin/product') }
    }
    return <div>
        <Tabs value={value} onChange={navigateTab} aria-label="nav tabs example">
            <Tab label="Catégories" />
            <Tab label="Produits" />
        </Tabs>
        <Routes>
            <Route path="/" element={<AdminHome />} />
            <Route path="product/*" element={<AdminProduct />} />
            <Route path="category/*" element={<AdminCategory />} />
        </Routes>
    </div>
}