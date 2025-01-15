"use client";

import { createContext, useState, useEffect, ReactNode } from "react";


export const AuthContext = createContext({
  token: "",
  setToken: (token: string) => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) setToken(storedToken);
  }, []);

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
}
