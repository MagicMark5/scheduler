import { useState } from 'react';

export default function useVisualMode(modeState) {
  // Set the mode State with the argument provided
  const [mode, setMode] = useState(modeState); // modeState will be our initial default value
  const [history, setHistory] = useState([modeState]);

  // Helper for back(), returns previous history based on current history
  const checkHistory = (historyArr) => historyArr.length > 1 ? historyArr.slice(0, -1) : historyArr;
  
  // transition moves forward one state
  const transition = (newMode, replace = false) => {
    setMode(newMode);
    setHistory((prev) => {
      const currentHistory = replace ? prev.slice(0, -1) : prev;
      return [...currentHistory, newMode];
    });
  };

  // back moves back to the previous state
  // It should not allow the user to go back past the initial modeState.
  const back = () => {
    const prevHistory = checkHistory(history); // make sure history length is > 1
    setMode(history[prevHistory.length - 1]);
    setHistory((prev) => {
      const prevHistory = checkHistory(prev); // ensures we don't go back if only 1 element
      return prevHistory;
    });
  };

  
  return { 
    mode, 
    history,
    transition,
    back
  }; 
}