
import React, { createContext, useState } from 'react';

// Create the context
export const EmailContext = createContext();

// Create the provider component
export const EmailProvider = ({ children }) => {
    const [globalemail, setEmail] = useState(''); //Start the changes from here


  return (
    <EmailContext.Provider value={{ globalemail, setEmail }}>
      {children}
    </EmailContext.Provider>
  );
};
