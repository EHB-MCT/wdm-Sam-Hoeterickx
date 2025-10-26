//Components
import { OptionButton } from '../optionButton/OptionButton';

export const QuizUI = ({ question, selectedButtonId, onOptionClick, onNextClick, onHoverStart, onHoverEnd }) => {
    
    const handleNext = () => {
        onNextClick(question._id);
    };

    return(
        <>
            {
                question && (
                    <div className="quiz-container">
                        <section className="quiz-section">
                            <h3>{ question.question }</h3>
                            <div className="options-container">
                                <OptionButton
                                    id="option1"
                                    value={question.options[0]}
                                    isSelected={selectedButtonId === 'option1'}
                                    onClick={onOptionClick}
                                    onMouseEnter={onHoverStart}
                                    onMouseLeave={onHoverEnd}
                                />
                                <OptionButton
                                    id="option2"
                                    value={question.options[1]}
                                    isSelected={selectedButtonId === 'option2'}
                                    onClick={onOptionClick}
                                    onMouseEnter={onHoverStart}
                                    onMouseLeave={onHoverEnd}
                                />
                            </div>
                            <button
                                className="next-button"
                                onClick={handleNext}
                            >
                                Next
                            </button>
                        </section>
                    </div>
                )
            }
        </>
    )
}