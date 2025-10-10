import { useState } from "react";

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
