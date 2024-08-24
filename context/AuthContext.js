import React, { createContext, useReducer } from 'react';

const initialState = {
  userToken: null,
};

export const AuthContext = createContext(initialState);

export const SignInReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_SIGN_IN':
      return {
        userToken: action.payload.userToken,
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(SignInReducer, initialState);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
