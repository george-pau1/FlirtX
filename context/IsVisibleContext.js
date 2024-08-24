import React, { createContext, useState } from 'react';

// Create the context
export const IsVisibleContext = createContext();

// Create the provider component
export const IsVisibleProvider = ({ children }) => {
    const [ExtraVisibility, setExtraVisibility] = useState(false); //Start the changes from here


  return (
    <IsVisibleContext.Provider value={{ExtraVisibility, setExtraVisibility}}>
      {children}
    </IsVisibleContext.Provider>
  );
};