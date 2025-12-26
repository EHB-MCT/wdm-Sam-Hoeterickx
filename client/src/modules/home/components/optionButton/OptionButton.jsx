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
            {value}
        </button>
    );

}