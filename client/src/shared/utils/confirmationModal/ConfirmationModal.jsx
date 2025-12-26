//Hooks
import { useHoverTracking, useQuestions } from "../../hooks";

//Service
import { confirmationService } from "../../services";

//Style
import './confirmationModal.css'

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
        <div className="pop-up">
            <h4>Nog even nadenken?</h4>
            <p>Soms twijfelen we aan ons eerste antwoord. Neem een moment om na te denken.</p>
            <div className="button-container">
                <button
                    className="confirm-button"
                    onClick={ handleConfirm }
                    onMouseEnter={ () => handleMouseEnter('confirm') }
                    onMouseLeave={ () => handleMouseLeave('confirm')}
                >
                    Ik sta achter mijn antwoord
                </button>
                <button
                    className="cancel-button"
                    onClick={ handleCancel }
                    onMouseEnter={ () => handleMouseEnter('cancel') }
                    onMouseLeave={ () => handleMouseLeave('cancel')}
                >
                    Ik wil mijn antwoord veranderen
                </button>
            </div>
        </div>
    )
}