import { AppBar, IconButton, Toolbar, Typography, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

import React from 'react';
import './Caisse.scss'
import ProductGrid from './components/ProductGrid';
import TicketPanel from './components/TicketPanel';
import Actions from './components/Actions';

export default function Caisse() {
    return <div className="caisse">
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
        <div className="main-panel">
            <ProductGrid />
        </div>
        <div className="secondary-panel">
            <TicketPanel />
            <Actions />
        </div>
    </div >
}