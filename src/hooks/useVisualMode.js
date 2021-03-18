import { useState } from 'react';

export default function useVisualMode(modeState) {
  // Set the mode State with the argument provided
  const [mode, setMode] = useState(modeState); // modeState will be our initial default value
  const [history, setHistory] = useState([modeState]);
  
  // transition moves forward one state
  const transition = (newMode, replace = false) => {
    setMode(newMode);
    const currentHistory = replace ? history.slice(0, -1) : history;
    setHistory([...currentHistory, newMode]);
  };

  // back moves back to the previous state
  // It should not allow the user to go back past the initial modeState.
  const back = () => {
    const prevHistory = history.length > 1 ? history.slice(0, -1) : history; // don't go back if only 1 element
    // console.log("history after going back, ", prevHistory);
    setMode(history[prevHistory.length - 1]);
    setHistory(prevHistory);
    // if console.log(mode) on this line the mode will not have changed yet because useState is async
  };
  // when we console.log(mode) here the mode has been updated before returning
  return { 
    mode, 
    transition,
    back
  }; 
}