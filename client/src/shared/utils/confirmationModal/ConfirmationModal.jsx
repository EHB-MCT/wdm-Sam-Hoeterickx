//Hooks
import { useHoverTracking, useQuestions } from "../../hooks";

//Service
import { confirmationService } from "../../services";

//Style
import './confirmationModal.css'

/**
 * Modal component that displays a confirmation dialog asking users to verify their answer choice.
 * Tracks hover time and decision duration before allowing confirmation or cancellation.
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal should be displayed
 * @param {Function} props.onConfirm - Callback when user confirms their choice
 * @param {Function} props.onCancel - Callback when user wants to change their choice
 * @returns {React.ReactNode|null} - Modal JSX or null if not open
 */
export const ConfirmationModal = ({ isOpen, onConfirm, onCancel }) => {

    const { elapsedHoverTime, handleMouseEnter, handleMouseLeave, resetHoverTime } = useHoverTracking();
    const { getDecisionTime } = useQuestions();
    
    if(!isOpen){
        return null
    }

    const handleConfirm = () => {
        saveConfirmationData(false);
        resetHoverTime();
        onConfirm();
    }

    const handleCancel = () => {
        saveConfirmationData(true);
        resetHoverTime();
        onCancel();
    }

    const saveConfirmationData = async(changedMind) => {
        try{
            const decisionTime = getDecisionTime();
            await confirmationService.saveConfirmationData(changedMind, elapsedHoverTime, decisionTime);    
        }catch(error){
            console.error('Failed to save confirmation data:', error);
        }
    } 

    return (
        <>
            <div className="modal-overlay"></div>
            <div className="modal">
                <div className="modal-header">
                    <div className="modal-icon">🤔</div>
                    <h3 className="modal-title">Nog even nadenken?</h3>
                </div>
                <div className="modal-body">
                    <p className="modal-message">
                        <strong>Soms twijfelen we aan ons eerste antwoord.</strong> Neem een moment om na te denken en maak een bewuste keuze.
                    </p>
                </div>
                <div className="modal-footer">
                    <button
                        className="modal-button modal-button-secondary"
                        onClick={ handleCancel }
                        onMouseEnter={ () => handleMouseEnter('cancel') }
                        onMouseLeave={ () => handleMouseLeave('cancel')}
                    >
                        Ik wil mijn antwoord veranderen
                    </button>
                    <button
                        className="modal-button modal-button-primary"
                        onClick={ handleConfirm }
                        onMouseEnter={ () => handleMouseEnter('confirm') }
                        onMouseLeave={ () => handleMouseLeave('confirm')}
                    >
                        Ik sta achter mijn antwoord
                    </button>
                </div>
            </div>
        </>
    )
}