"use client";

import { SupabaseAuthProvider } from "@/context/SupabaseAuthContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SupabaseAuthProvider>
      {children}
    </SupabaseAuthProvider>
  );
}
