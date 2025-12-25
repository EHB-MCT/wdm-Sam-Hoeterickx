//Components
import { OptionButton } from '../optionButton/OptionButton';

export const QuizUI = ({ question, selectedButtonId, onOptionClick, onNextClick, onHoverStart, onHoverEnd, timeLeft, timerActive, optionLocked, isQuizComplete }) => {
    
    const handleNext = () => {
        if (isQuizComplete) {
            localStorage.setItem('quiz_completed', 'true');
            onNextClick(question._id);
        } else {
            localStorage.setItem('question_id', question._id);
            onNextClick(question._id);
        }
    };

    return(
        <>
            {
                question && (
                    <div className="quiz-container">
                        <section className="quiz-section">
                            <h3>{ question.question }</h3>
                            {question.category === 'time_pressure' && timerActive && (
                                <div className="timer">
                                    <p>Time left: {timeLeft}s</p>
                                </div>
                            )}
                            {question.category === 'time_pressure' && optionLocked && (
                                <div className="timer-expired">
                                    <p>Time's up! Your choice is locked.</p>
                                </div>
                            )}
                            <div className="options-container">
                                <OptionButton
                                    id="option1"
                                    value={question.options[0]}
                                    isSelected={selectedButtonId === 'option1'}
                                    onClick={onOptionClick}
                                    onMouseEnter={onHoverStart}
                                    onMouseLeave={onHoverEnd}
                                    disabled={question.category === 'time_pressure' && optionLocked}
                                />
                                <OptionButton
                                    id="option2"
                                    value={question.options[1]}
                                    isSelected={selectedButtonId === 'option2'}
                                    onClick={onOptionClick}
                                    onMouseEnter={onHoverStart}
                                    onMouseLeave={onHoverEnd}
                                    disabled={question.category === 'time_pressure' && optionLocked}
                                />
                            </div>
                            <button
                                className="next-button"
                                onClick={handleNext}
                            >
                                {isQuizComplete ? 'Go to Dashboard' : 'Next'}
                            </button>
                        </section>
                    </div>
                )
            }
        </>
    )
}