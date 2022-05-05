import { Drawer, AppBar, Toolbar, IconButton, Typography, Button, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import CNMazIcon from './CNMazIcon';
import { useState } from 'react';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import OutdoorGrillIcon from '@mui/icons-material/OutdoorGrill';
import QueryStatsIcon from '@mui/icons-material/QueryStats';

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);

    return <>
        <Drawer
            anchor={"left"}
            open={menuOpen}
            onClose={() => setMenuOpen(false)}
        >
            <ListItem button>
                <ListItemIcon>
                    <PointOfSaleIcon />
                </ListItemIcon>
                <ListItemText primary={"Ventes"} />
            </ListItem>
            <ListItem button>
                <ListItemIcon>
                    <QueryStatsIcon />
                </ListItemIcon>
                <ListItemText primary={"Statistiques des ventes"} />
            </ListItem>
            <ListItem button>
                <ListItemIcon>
                    <OutdoorGrillIcon />
                </ListItemIcon>
                <ListItemText primary={"Préparation commandes"} />
            </ListItem>
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
                <Button disabled color="inherit">Login</Button>
            </Toolbar>
        </AppBar>
    </>
}