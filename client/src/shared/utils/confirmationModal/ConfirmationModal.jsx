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
    
        savePredictionData(false, elapsedHoverTime, decisionTime);

        resetHoverTime();
        onConfirm();
    }

    const handleCancel = () => {
        console.log('Modal elapsed hover time:', elapsedHoverTime);
        const decisionTime = getDecisionTime();
    
        savePredictionData(true, elapsedHoverTime, decisionTime);
        
        resetHoverTime();
        onCancel();
    }

    const savePredictionData = async(changedMindState, elapsedHoverTime, decisionTime) =>{
        try{
            const data = await predictionService.savePredictionData(changedMindState, elapsedHoverTime, decisionTime);    
        }catch(error){
            console.error('Failed to fetch predictionData:', error);
        }
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