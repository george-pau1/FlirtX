import React, { createContext, useState } from 'react';

// Create the context
export const IsSubmittedContext = createContext();

// Create the provider component
export const IsSubmittedProvider = ({ children }) => {
    const [isSubmitted, setIsSubmitted] = useState(false); //Start the changes from here


  return (
    <IsSubmittedContext.Provider value={{isSubmitted, setIsSubmitted}}>
      {children}
    </IsSubmittedContext.Provider>
  );
};