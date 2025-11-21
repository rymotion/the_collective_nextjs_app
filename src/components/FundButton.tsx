"use client";

import { useRouter } from "next/navigation";
import { useSupabaseAuth } from "@/context/SupabaseAuthContext";

interface FundButtonProps {
  projectId: string;
  className?: string;
}

export default function FundButton({ projectId, className = "" }: FundButtonProps) {
  const router = useRouter();
  const { isAuthenticated, loading } = useSupabaseAuth();

  const handleFundClick = () => {
    if (isAuthenticated) {
      router.push(`/fund/${projectId}`);
    } else {
      router.push(`/auth/signin?redirect=/fund/${projectId}`);
    }
  };

  if (loading) {
    return (
      <button
        disabled
        className={`btn btn-primary w-full text-xl py-4 shadow-lg shadow-primary/20 opacity-50 cursor-wait ${className}`}
      >
        Loading...
      </button>
    );
  }

  return (
    <button
      onClick={handleFundClick}
      className={`btn btn-primary w-full text-xl py-4 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all ${className}`}
    >
      Fund This Project
    </button>
  );
}
