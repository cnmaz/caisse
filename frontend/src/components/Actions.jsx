
import { Button } from '@mui/material';
import './Actions.scss';
import { CartStates, CartType } from '../hooks/useCart';

export default function Actions({ cart, setActiveTab }) {

    return <div elevation="2" className="actions-container">
        <h1>Actions</h1>
        <div className="actions">
            {cart.state !== CartStates.PaiementCB ?
                <Button variant="outlined" disabled={cart.state !== CartStates.Saisie} onClick={() => { cart?.paiementCB(); setActiveTab('paiement'); }}>
                    Réglement CB
                </Button>
                : <Button variant="outlined" onClick={cart?.annulationPaiement}>
                    Annulation du paiement
                </Button>
            }
            {cart.state !== CartStates.PaiementEspeces ?
                <Button variant="outlined" disabled={cart.state !== CartStates.Saisie} onClick={() => { cart?.paiementEspeces(); setActiveTab('paiement'); }}>
                    Réglement Espèces
                </Button> : <Button variant="outlined" onClick={cart?.annulationPaiement}>
                    Annulation du paiement
                </Button>}
            <Button variant={cart.state === CartStates.Annulation ? "contained" : "outlined"} onClick={() => { cart?.toggleAnnulation(); setActiveTab("produits"); }} disabled={cart.state !== CartStates.Saisie && cart.state !== CartStates.Annulation}>
                Mode Annulation
            </Button>
            <Button variant="outlined" disabled={cart.state !== CartStates.Saisie}>
                Mise en attente
            </Button>
            <Button variant="outlined" disabled={cart.state !== CartStates.Saisie}>
                Historique ventes
            </Button>
            <Button variant="outlined" disabled={cart.state !== CartStates.PaiementCB && cart.state !== CartStates.PaiementEspeces}>
                Client suivant
            </Button>
        </div>
    </div>
}

Actions.propTypes = { cart: CartType }