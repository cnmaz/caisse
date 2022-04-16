import { AppBar, IconButton, Toolbar, Typography, Button, BottomNavigation, BottomNavigationAction } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

import React, { useState } from 'react';
import './Caisse.scss'
import ProductGrid from './components/ProductGrid';
import TicketPanel from './components/TicketPanel';
import Actions from './components/Actions';
import BentoIcon from '@mui/icons-material/Bento';
import ViewListIcon from '@mui/icons-material/ViewList';
import CreditScoreIcon from '@mui/icons-material/CreditScore';
import { useCart } from './hooks/useCart';
import useMediaQuery from '@mui/material/useMediaQuery';


export default function Caisse() {
    const cart = useCart();
    const [active, setActive] = useState("produits");
    const { addItem } = cart;
    const largeMode = useMediaQuery('(min-width:600px)');

    return <div className="caisse-container">
        <AppBar position="static">
            <Toolbar>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                >
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Caisse
                </Typography>
                <Button color="inherit">Login</Button>
            </Toolbar>
        </AppBar>
        <div className="caisse-content">
            {(largeMode || active === "produits") && (
                <main>
                    <ProductGrid onClickProduct={addItem} />
                </main>
            )}
            <aside>
                {(largeMode || active === "ticket") && <TicketPanel cart={cart} />}
                {(largeMode || active === "actions") && <Actions cart={cart} />}
            </aside>
        </div>
        {!largeMode && active !== "ticket" && <TicketPanel cart={cart} totalOnly className="total-only-container" />}
        {largeMode || <BottomNavigation
            showLabels
            value={active}
            onChange={(event, newValue) => {
                setActive(newValue);
            }}
        >
            <BottomNavigationAction value="produits" label="Produits" icon={<BentoIcon />} />
            <BottomNavigationAction value="ticket" label="Ticket" icon={<ViewListIcon />} />
            <BottomNavigationAction value="actions" label="Actions" icon={<CreditScoreIcon />} />
        </BottomNavigation>}
    </div>
}