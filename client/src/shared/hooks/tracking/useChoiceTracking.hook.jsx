import { useState } from "react";

/**
 * Custom hook that tracks how many times a user has selected or switched between options.
 * Used to detect indecision or "changed mind" behavior before the final submission.
 * 
 * @returns {Object} - The choice tracking object
 * @property {Object} changedMind - Object containing counters for each option (e.g., { option1: 2, option2: 1 })
 * @property {Function} updateChoice - Function to increment the counter for a specific option ID (params: id)
 * @property {Function} resetChoices - Function to reset all counters to zero (e.g., when moving to a new question)
*/

export const useChoiceTracking = () => {
  const [changedMind, setChangedMind] = useState({ option1: 0, option2: 0 });

  const updateChoice = (id) => {
    setChangedMind((prev) => ({
      ...prev,
      [id]: prev[id] + 1,
    }));
  };

  const resetChoices = () => {
    setChangedMind({ option1: 0, option2: 0 });
  };

  return { changedMind, updateChoice, resetChoices };
}
