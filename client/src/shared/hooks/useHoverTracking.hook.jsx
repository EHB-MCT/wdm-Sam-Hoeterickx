import { useState, useRef } from "react";

export const useHoverTracking = () => {
  const [elapsedHoverTime, setElapsedHoverTime] = useState({ option1: 0, option2: 0 });
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
    setElapsedHoverTime({ option1: 0, option2: 0 });
    hoverStart.current = {};
  };

  return { elapsedHoverTime, handleMouseEnter, handleMouseLeave, resetHoverTime };
}
