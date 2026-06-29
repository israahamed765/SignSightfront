"use client";
import { createContext, useState } from "react";
export const SignContext = createContext();

export function SignProvider({ children }) {
  const [dictionary, setDictionary] = useState([]); // هنا ستُحفظ الإشارات
  return (
    <SignContext.Provider value={{ dictionary, setDictionary }}>
      {children}
    </SignContext.Provider>
  );
}