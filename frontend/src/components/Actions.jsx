
import { Button } from '@mui/material';
import './Actions.scss';
import { CartType } from '../hooks/useCart';

export default function Actions({ cart }) {

    return <div elevation="2" className="actions-container">
        <h1>Actions</h1>
        <div className="actions">
            <Button variant="outlined">
                Réglement CB
            </Button>
            <Button variant="outlined">
                Réglement Espèces
            </Button>
            <Button variant="outlined">
                Annulation
            </Button>
            <Button variant="outlined">
                Mise en attent
            </Button>
            <Button variant="outlined">
                Historique ventes
            </Button>
            <Button variant="outlined">
                Client suivant
            </Button>
        </div>
    </div>
}

Actions.propTypes = { cart: CartType }