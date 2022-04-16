
import { Button } from '@mui/material';
import './Actions.scss';
import { CartStates, CartType } from '../hooks/useCart';

export default function Actions({ cart }) {

    return <div elevation="2" className="actions-container">
        <h1>Actions</h1>
        <div className="actions">
            <Button variant="outlined" disabled={cart.state !== CartStates.Saisie}>
                Réglement CB
            </Button>
            <Button variant="outlined" disabled={cart.state !== CartStates.Saisie}>
                Réglement Espèces
            </Button>
            <Button variant={cart.state === CartStates.Annulation ? "contained" : "outlined"} onClick={cart?.toggleAnnulation}>
                Annulation
            </Button>
            <Button variant="outlined" disabled={cart.state !== CartStates.Saisie}>
                Mise en attente
            </Button>
            <Button variant="outlined" disabled={cart.state !== CartStates.Saisie}>
                Historique ventes
            </Button>
            <Button variant="outlined" disabled={cart.state !== CartStates.Saisie}>
                Client suivant
            </Button>
        </div>
    </div>
}

Actions.propTypes = { cart: CartType }