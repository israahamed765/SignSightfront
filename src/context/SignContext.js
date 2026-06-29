"use client";
import { createContext, useState } from "react";

// 1. تصدير الـ Context
export const SignContext = createContext();

// 2. تصدير الـ Provider
export function SignProvider({ children }) {
  const [dictionary, setDictionary] = useState([]);
  
  return (
    <SignContext.Provider value={{ dictionary, setDictionary }}>
      {children}
    </SignContext.Provider>
  );
}