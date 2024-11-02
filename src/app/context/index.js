"use client";

import { createContext, useReducer } from "react";

export const MultiContext = createContext(false);

const initState = {
  isOpenMusic: false,
  theme: "dark-theme",
};

function audioReducer(state, action) {
  switch (action.type) {
    case "TURN_ON":
      return {
        isOpenMusic: true,
      };
    case "TURN_OFF":
      return {
        isOpenMusic: false,
      };
    default:
      throw new Error("invalid action type");
  }
}

export default function GlobalContext({ children }) {
  const [state, dispatch] = useReducer(audioReducer, initState);

  return (
    <MultiContext.Provider value={{ state, dispatch }}>
      {children}
    </MultiContext.Provider>
  );
}
