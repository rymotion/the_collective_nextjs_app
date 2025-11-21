"use client";

import { AuthProvider } from "@/context/AuthContext";
import { SupabaseAuthProvider } from "@/context/SupabaseAuthContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <SupabaseAuthProvider>
        {children}
      </SupabaseAuthProvider>
    </AuthProvider>
  );
}
