export const OptionButton = ({ id, value, isSelected, onClick, onMouseEnter, onMouseLeave }) => {
    const className = `option-button ${isSelected ? "selected" : ""}`;

    const handleOptionClick = () => {
        onClick(id, value); 
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
        >
            {value}
        </button>
    );

}