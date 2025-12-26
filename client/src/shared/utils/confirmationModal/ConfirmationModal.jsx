//Style
import './confirmationModal.css';

export const ConfirmationModal = ({ isOpen, onConfirm, onCancel }) => {
    
    if(!isOpen){
        return null
    }

    const handleConfirm = () => {
        onConfirm();
    }

    const handleCancel = () => {
        onCancel();
    }

    return (
        <div className="pop-up">
            <h4>Nog even nadenken?</h4>
            <p>Soms twijfelen we aan ons eerste antwoord. Neem een moment om na te denken.</p>
            <div className="button-container">
                <button
                    className="confirm-button"
                    onClick={ handleConfirm }
                >
                    Ik sta achter mijn antwoord
                </button>
                <button
                    className="cancel-button"
                    onClick={ handleCancel }
                >
                    Ik wil mijn antwoord veranderen
                </button>
            </div>
        </div>
    )
}