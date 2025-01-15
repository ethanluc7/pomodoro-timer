"use client";

import { useContext, ReactNode } from "react";
import { AuthContext } from "./AuthContext";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { token } = useContext(AuthContext);

  if (!token) {
    return <p>You must be logged in to access this page.</p>;
  }

  return <>{children}</>;
}
