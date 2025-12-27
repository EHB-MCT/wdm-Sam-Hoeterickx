//Components
import { OptionButton } from '../optionButton/OptionButton';

/**
 * Main quiz interface component that displays questions, options, and navigation.
 * Handles different states for regular questions, time pressure questions, and quiz completion.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.question - Current question object with _id, question, category, options
 * @param {string|null} props.selectedButtonId - ID of currently selected option button
 * @param {Function} props.onOptionClick - Handler for option selection (params: id, value)
 * @param {Function} props.onNextClick - Handler for next navigation (params: questionId)
 * @param {Function} props.onHoverStart - Handler for hover start (params: id)
 * @param {Function} props.onHoverEnd - Handler for hover end (params: id)
 * @param {number} props.timeLeft - Seconds remaining for time pressure questions
 * @param {boolean} props.timerActive - Whether timer is currently active
 * @param {boolean} props.optionLocked - Whether options are locked (time expired)
 * @param {boolean} props.lastAnswerSubmitted - Whether this is the final question completion view
 * @returns {React.ReactNode} - Quiz interface JSX
 */
export const QuizUI = ({ question, selectedButtonId, onOptionClick, onNextClick, onHoverStart, onHoverEnd, timeLeft, timerActive, optionLocked, lastAnswerSubmitted }) => {
    
    const handleNext = () => {
        if (lastAnswerSubmitted) {
            onNextClick(question._id);
        } else {
            localStorage.setItem('question_id', question._id);
            onNextClick(question._id);
        }
    };

    return(
        <>
            {
                question && !lastAnswerSubmitted && (
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
                                disabled={!selectedButtonId && !optionLocked}
                            >
                                Next
                            </button>
                        </section>
                    </div>
                )
            }
            {
                lastAnswerSubmitted && (
                    <div className="quiz-container">
                        <section className="quiz-section">
                            <h3>Quiz Voltooid!</h3>
                            <div className="quiz-complete-message">
                                <p>Bedankt voor het voltooien van de quiz. Je antwoorden zijn opgeslagen.</p>
                                <p>Klik hieronder om in te loggen en je resultaten te bekijken.</p>
                            </div>
                            <button
                                className="next-button"
                                onClick={handleNext}
                            >
                                Bekijk je resultaten
                            </button>
                        </section>
                    </div>
                )
            }
        </>
    )
}