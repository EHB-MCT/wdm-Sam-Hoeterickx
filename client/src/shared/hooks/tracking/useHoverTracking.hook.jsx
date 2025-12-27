import { useState, useRef } from "react";

/**
 * Custom hook that tracks the duration a user hovers over specific UI elements.
 * Useful for measuring hesitation or attention time on options and confirmation buttons.
 * 
 * @returns {Object} - The hover tracking object
 * @property {Object} elapsedHoverTime - Object accumulating total hover time in seconds per element ID
 * @property {Function} handleMouseEnter - Function to record the start time when hovering begins (params: id)
 * @property {Function} handleMouseLeave - Function to calculate and add the duration when hovering ends (params: id)
 * @property {Function} resetHoverTime - Function to reset all timers to zero
*/

export const useHoverTracking = () => {
  const [elapsedHoverTime, setElapsedHoverTime] = useState({ option1: 0, option2: 0, cancel: 0, confirm: 0 });
  const hoverStart = useRef({});

  const handleMouseEnter = (id) => {
    hoverStart.current[id] = Date.now();
  };

  const handleMouseLeave = (id) => {
    const start = hoverStart.current[id];
    if (start) {
      const duration = (Date.now() - start) / 1000;
      
      hoverStart.current[id] = null;

      setElapsedHoverTime((prev) => ({
        ...prev,
        [id]: prev[id] + duration,
      }));
    }
  };

  const resetHoverTime = () => {
    setElapsedHoverTime({ option1: 0, option2: 0, confirm: 0, cancel: 0 });
    hoverStart.current = {};
  };

  return { elapsedHoverTime, handleMouseEnter, handleMouseLeave, resetHoverTime };
}
