import React from 'react';
import './Caisse.scss'

import Header from './components/Header';
import Vente from './pages/Vente';
import { Routes, Route } from "react-router-dom";
import Stats from './pages/Stats';
import PrepaCommandes from './pages/PrepaCommandes';

export default function Caisse() {


    return <div className="caisse-container">
        <Header />
        <Routes>
            <Route path="/" element={<Vente />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/preparation" element={<PrepaCommandes />} />
        </Routes>
    </div >
}