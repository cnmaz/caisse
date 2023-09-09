
import { Button, FormControl, TextField, useFormControl } from '@mui/material';
import './Actions.scss';
import { usePos, tabNameAlwaysDisplayed } from '../config'
import { CartStates, CartType } from '../hooks/useCart';
import { debounce } from 'lodash';

export default function Actions({ cart, setActiveTab }) {


    return <div elevation="2" className="actions-container">
        <h1>Actions</h1>
        {(cart.state === CartStates.EnAttente || (tabNameAlwaysDisplayed && cart.state === CartStates.Saisie) || cart.name) && <div style={{ padding: "0.8rem" }}>
            <TextField label="Nom de l'ardoise" sx={{ width: '100%' }} value={cart?.name} onChange={(val) => cart.setName(val.target.value)}></TextField>
        </div>}
        <div className="actions">
            {cart.state !== CartStates.PaiementCB ?
                <Button variant={cart.state === CartStates.Saisie?"contained":"outlined"} disabled={cart.state !== CartStates.Saisie || !usePos} onClick={() => { cart?.paiementCB(); setActiveTab('paiement'); }}>
                    Réglement CB
                </Button>
                : <Button variant="outlined" onClick={cart?.retourEdition}>
                    Retour Edition
                </Button>
            }
            {cart.state !== CartStates.PaiementEspeces ?
                <Button variant={cart.state === CartStates.Saisie?"contained":"outlined"} disabled={cart.state !== CartStates.Saisie} onClick={() => { cart?.paiementEspeces(); setActiveTab('paiement'); }}>
                    Réglement Espèces
                </Button> : <Button variant="outlined" onClick={cart?.retourEdition}>
                    Retour Edition
                </Button>}
            <Button variant={cart.state === CartStates.Annulation ? "contained" : "outlined"} onClick={() => { cart?.toggleAnnulation(); setActiveTab("produits"); }} disabled={cart.state !== CartStates.Saisie && cart.state !== CartStates.Annulation}>
                Mode Annulation
            </Button>
            {cart.state !== CartStates.EnAttente ?
                <Button variant="outlined" disabled={cart.state !== CartStates.Saisie && cart.state !== CartStates.PaiementCB && cart.state !== CartStates.PaiementEspeces} onClick={cart?.miseEnAttente}>
                    Mise en attente
                </Button>
                :
                <Button variant="contained" disabled={cart.state !== CartStates.EnAttente} onClick={cart?.retourEdition}>
                    Reprise
                </Button>
            }
            {cart.state !== CartStates.PaiementEspeces && cart.state !== CartStates.PaiementCB ? (
                (cart.state !== CartStates.Ardoises) ? (
                    <Button variant="outlined" disabled={false} onClick={() => { cart?.ardoises(); setActiveTab('tabs') }}>
                        Ardoises
                    </Button>
                ) : (
                    <Button variant="outlined" disabled={false} onClick={() => { cart?.historiqueVentes(); setActiveTab('historique') }}>
                        Historique ventes
                    </Button>
                )) : (
                <Button variant="outlined" disabled={cart.state !== CartStates.PaiementCB && cart.state !== CartStates.PaiementEspeces} onClick={cart?.validationPaiement}>
                    Validation paiement
                </Button>
            )}
            <Button variant="contained" disabled={cart.state !== CartStates.HistoriqueVentes && cart.state !== CartStates.Ardoises && cart.state !== CartStates.Annule && cart.state !== CartStates.Paye && cart.state !== CartStates.EnAttente} onClick={() => { cart?.nouveauClient(); setActiveTab("produits") }}>
                Nouveau client
            </Button>
        </div>
    </div>
}

Actions.propTypes = { cart: CartType }