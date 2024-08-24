// AnswerContext.js
import React, { createContext, useState } from 'react';

// Create the context
export const AnswerContext = createContext();

// Create the provider component
export const AnswerProvider = ({ children }) => {
    const [answerArray, setMyArray] = useState([]);

  const addToArray = (newItem) => {
    setMyArray((prevArray) => [...prevArray, newItem]);
  };

  return (
    <AnswerContext.Provider value={{ answerArray, setMyArray }}>
      {children}
    </AnswerContext.Provider>
  );
};
