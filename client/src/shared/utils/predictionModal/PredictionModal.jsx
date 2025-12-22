import './predictionModal.css';

export const PredictionModal = ({ isOpen, predictions, onClose }) => {
    
    if(!isOpen || !predictions){
        return null;
    }

    return (
        <div className="prediction-modal-overlay">
            <div className="prediction-modal">
                <h3>AI Voorspelling</h3>
                <p>Op basis van je vorige antwoorden, voorspelt onze AI je volgende keuzes:</p>
                <div className="predictions-list">
                    {predictions.map((prediction, index) => (
                        <div key={index} className="prediction-item">
                            <span className="question-number">Vraag {index + 1}:</span>
                            <span className="prediction-answer">{prediction}</span>
                        </div>
                    ))}
                </div>
                <button className="close-button" onClick={onClose}>
                    Begrepen
                </button>
            </div>
        </div>
    )
}