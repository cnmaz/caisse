import PaveNumerique from "./PaveNumerique";
import './PaiementEspeces.scss'

export default function PaiementEspeces({ cart }) {
    return <div className="paiement-container">
        <h1>
            Espèces reçues
        </h1>
        <PaveNumerique value={cart?.especesRecues} setValue={cart?.setEspecesRecues} />
    </div>
}