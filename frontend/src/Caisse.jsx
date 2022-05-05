import { BottomNavigation, BottomNavigationAction } from '@mui/material';

import React, { useState } from 'react';
import './Caisse.scss'
import ProductGrid from './components/ProductGrid';
import TicketPanel from './components/TicketPanel';
import Actions from './components/Actions';
import BentoIcon from '@mui/icons-material/Bento';
import ViewListIcon from '@mui/icons-material/ViewList';
import PaymentIcon from '@mui/icons-material/Payment';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import { CartStates, useCart } from './hooks/useCart';
import useMediaQuery from '@mui/material/useMediaQuery';
import PaiementEspeces from './components/PaiementEspeces';
import PaiementCB from './components/PaiementCB';
import History from './components/History';
import Header from './components/Header';


export default function Caisse() {
    const cart = useCart();
    const [activeTab, setActiveTab] = useState("produits");
    const { addItem } = cart;
    const largeMode = useMediaQuery('(min-width:600px)');

    const renderLargeMainPane = () => {
        switch (cart?.state) {
            case CartStates.PaiementEspeces:
                return <PaiementEspeces cart={cart} />
            case CartStates.PaiementCB:
                return <PaiementCB cart={cart} setActiveTab={setActiveTab} />
            case CartStates.HistoriqueVentes:
                return <History onClickProduct={addItem} cart={cart} setActiveTab={setActiveTab} />
            default:
                return <ProductGrid onClickProduct={addItem} cart={cart} />
        }
    }

    return <div className="caisse-container">
        <Header />
        <div className="caisse-content">
            {(!largeMode && activeTab === "produits") && (
                <main>
                    <ProductGrid onClickProduct={addItem} cart={cart} />
                </main>
            )}
            {(!largeMode && activeTab === "historique") && (
                <main>
                    <History onClickProduct={addItem} cart={cart} setActiveTab={setActiveTab} />
                </main>
            )}
            {(!largeMode && activeTab === "paiement") && (
                <main>
                    {cart.state === CartStates.PaiementEspeces && <PaiementEspeces cart={cart} />}
                    {cart.state === CartStates.PaiementCB && <PaiementCB cart={cart} setActiveTab={setActiveTab} />}
                </main>
            )}
            {(largeMode) && (
                <main>
                    {renderLargeMainPane()}
                </main>
            )}
            <aside>
                {(largeMode || activeTab === "ticket") && <TicketPanel cart={cart} />}
                {(largeMode || activeTab === "actions") && <Actions cart={cart} setActiveTab={setActiveTab} />}
            </aside>
        </div>
        {!largeMode && activeTab !== "ticket" && <TicketPanel cart={cart} totalOnly className="total-only-container" />}
        {
            largeMode || <BottomNavigation
                showLabels
                value={activeTab}
                onChange={(_, newValue) => {
                    setActiveTab(newValue);
                }}
            >
                {(cart?.state === CartStates.Saisie || cart?.state === CartStates.Annulation) && <BottomNavigationAction value="produits" label="Produits" icon={<BentoIcon />} />}
                {(cart?.state === CartStates.PaiementEspeces || cart?.state === CartStates.PaiementCB) && <BottomNavigationAction value="paiement" label="Paiement" icon={<PaymentIcon />} />}
                {(cart?.state === CartStates.HistoriqueVentes) && <BottomNavigationAction value="historique" label="Historique" icon={<FactCheckIcon />} />}
                <BottomNavigationAction value="ticket" label="Ticket" icon={<ViewListIcon />} />
                <BottomNavigationAction value="actions" label="Actions" icon={<PointOfSaleIcon />} />
            </BottomNavigation>
        }
    </div >
}