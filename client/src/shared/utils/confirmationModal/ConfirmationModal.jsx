//Hooks
import { useChoiceTracking, useHoverTracking } from "../../hooks";

export const ConfirmationModal = ({ isOpen, onConfirm, onCancel }) => {

    const { elapsedHoverTime, handleMouseEnter, handleMouseLeave, resetHoverTime } = useHoverTracking();
    
    if(!isOpen){
        return null
    }



    const handleConfirm = () => {
        console.log('Modal elapsed hover time:', elapsedHoverTime);
        resetHoverTime();
        onConfirm();
    }

    const handleCancel = () => {
        console.log('Modal elapsed hover time:', elapsedHoverTime);
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