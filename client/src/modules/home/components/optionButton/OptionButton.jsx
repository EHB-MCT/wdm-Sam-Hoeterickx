/**
 * Interactive button component for quiz answer options.
 * Supports selection states, hover tracking, and disabled states.
 * 
 * @param {Object} props - Component props
 * @param {string} props.id - Unique identifier for the button option
 * @param {string} props.value - Display text/value of the button
 * @param {boolean} props.isSelected - Whether this button is currently selected
 * @param {Function} props.onClick - Click handler (params: id, value)
 * @param {Function} props.onMouseEnter - Mouse enter handler (params: id)
 * @param {Function} props.onMouseLeave - Mouse leave handler (params: id)
 * @param {boolean} props.disabled - Whether the button should be disabled
 * @returns {React.ReactNode} - Button JSX element
 */
export const OptionButton = ({ id, value, isSelected, onClick, onMouseEnter, onMouseLeave, disabled }) => {
    const baseClass = "option-button";
    const selectedClass = isSelected ? "selected" : "";
    const disabledClass = disabled ? "disabled" : "";
    const className = `${baseClass} ${selectedClass} ${disabledClass}`.trim();

    const handleOptionClick = () => {
        if (!disabled) {
            onClick(id, value); 
        }
    };

    const handleMouseEnter = () => onMouseEnter(id);
    const handleMouseLeave = () => onMouseLeave(id);

    return (
        <button
            className={className}
            id={value}
            value={value}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleOptionClick}
            disabled={disabled}
        >
            <div className="option-button-content">
                <div className="option-button-text">{value}</div>
            </div>
        </button>
    );

}