import { Drawer, AppBar, Toolbar, IconButton, Typography, Button, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import CNMazIcon from './CNMazIcon';
import { useState } from 'react';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import OutdoorGrillIcon from '@mui/icons-material/OutdoorGrill';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import SettingsIcon from '@mui/icons-material/Settings';
import './Header.scss';
import { useNavigate } from 'react-router';

export default function Header() {
    let navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [openings, setOpenings] = useState(0);


    return <div className="header-container">
        <Drawer
            anchor={"left"}
            open={menuOpen}
            onClose={() => { setMenuOpen(false); setOpenings(v => v + 1); }}
        >
            <ListItem button onClick={() => { navigate('/'); setOpenings(0) }}>
                <ListItemIcon>
                    <PointOfSaleIcon />
                </ListItemIcon>
                <ListItemText primary={"Ventes"} />
            </ListItem>
            <ListItem button onClick={() => navigate('/stats')}>
                <ListItemIcon>
                    <QueryStatsIcon />
                </ListItemIcon>
                <ListItemText primary={"Statistiques des ventes"} />
            </ListItem>
            <ListItem button onClick={() => navigate('/preparation')}>
                <ListItemIcon>
                    <OutdoorGrillIcon />
                </ListItemIcon>
                <ListItemText primary={"Préparation commandes"} />
            </ListItem>
            <ListItem button onClick={() => document.documentElement.requestFullscreen()}>
                <ListItemIcon>
                    <FullscreenIcon />
                </ListItemIcon>
                <ListItemText primary={"Mode plein écran"} />
            </ListItem>
            {openings > 2 && (<ListItem button onClick={() => navigate('/admin')}>
                <ListItemIcon>
                    <SettingsIcon />
                </ListItemIcon>
                <ListItemText primary={"Administration"} />
            </ListItem>)}
        </Drawer>
        <AppBar position="static">
            <Toolbar>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                    onClick={() => setMenuOpen(true)}
                >
                    <CNMazIcon />
                </IconButton>

                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Caisse
                </Typography>
                <Button color="inherit" onClick={() => window.location = '/api/auth'}>Login</Button>
            </Toolbar>
        </AppBar>
    </div>
}