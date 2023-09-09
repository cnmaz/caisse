
import { Button } from '@mui/material';
import './OverlayActions.scss';
import { CartStates, CartType } from '../hooks/useCart';

export default function Actions({ cart, setActiveTab }) {

    return <div elevation="2" className="overlay-actions-container">
        <div className="overlay-actions">
            <Button variant="outlined" disabled={false} onClick={() => { cart?.historiqueVentes(); setActiveTab('historique') }}>
                Historique ventes
            </Button>
            <Button variant="outlined" disabled={false} onClick={() => { cart?.ardoises(); setActiveTab('tabs') }}>
                Ardoises
            </Button>
            <Button variant="contained" disabled={cart.state !== CartStates.HistoriqueVentes && cart.state !== CartStates.Annule && cart.state !== CartStates.Paye && cart.state !== CartStates.EnAttente} onClick={() => { cart?.nouveauClient(); setActiveTab("produits") }}>
                Nouveau client
            </Button>
        </div>
    </div>
}

Actions.propTypes = { cart: CartType }