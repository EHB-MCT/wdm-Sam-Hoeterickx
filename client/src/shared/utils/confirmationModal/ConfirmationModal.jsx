//Hooks
import { useHoverTracking, useQuestions } from "../../hooks";
import { predictionService } from "../../services";

export const ConfirmationModal = ({ isOpen, onConfirm, onCancel }) => {

    const { elapsedHoverTime, handleMouseEnter, handleMouseLeave, resetHoverTime } = useHoverTracking();
    const { getDecisionTime } = useQuestions();
    
    if(!isOpen){
        return null
    }

    const handleConfirm = () => {
        console.log('Modal elapsed hover time:', elapsedHoverTime);
        const decisionTime = getDecisionTime();

        //Post changedMindState, elapsedHoverTime en desicionTime to db
        //predictionService.savePredictionData(false, elapsedHoverTime, decisionTime);
        
        console.log(decisionTime);

        resetHoverTime();
        onConfirm();
    }

    const handleCancel = () => {
        console.log('Modal elapsed hover time:', elapsedHoverTime);
        const decisionTime = getDecisionTime();

        //Post changedMindState, elapsedHoverTime en desicionTime to db
        //predictionService.savePredictionData(true, elapsedHoverTime, decisionTime);
        
        console.log(decisionTime);
        
        resetHoverTime();
        onCancel();
    }

    return (
        <div className="pop-up">
            <h4>Bent u zeker?</h4>
            <div className="button-container">
                <button
                    className="confirm-button"
                    onClick={ handleConfirm }
                    onMouseEnter={ () => handleMouseEnter('confirm') }
                    onMouseLeave={ () => handleMouseLeave('confirm') }
                >
                    Ik ben zeker
                </button>
                 <button
                    className="cancel-button"
                    onClick={ handleCancel }
                    onMouseEnter={ () => handleMouseEnter('cancel') }
                    onMouseLeave={ () => handleMouseLeave('cancel') }
                >
                    Ik ben niet zeker
                </button>
            </div>
        </div>
    )
}