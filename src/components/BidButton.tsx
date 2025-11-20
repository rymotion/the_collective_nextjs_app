"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function BidButton() {
  const { isAuthenticated, isImdbSynced } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col gap-2 flex-1">
        <button disabled className="btn btn-outline border-white/10 text-muted cursor-not-allowed w-full text-lg">
          Bid to Work
        </button>
        <p className="text-[10px] text-center text-muted">
          Sign in to bid
        </p>
      </div>
    );
  }

  if (!isImdbSynced) {
    return (
      <div className="flex flex-col gap-2 flex-1">
        <Link href="/dashboard" className="btn btn-outline border-primary text-primary hover:bg-primary hover:text-white w-full text-lg text-center">
          Sync IMDb to Bid
        </Link>
        <p className="text-[10px] text-center text-muted">
          IMDb verification required
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 flex-1">
      <button className="btn btn-outline border-primary text-primary hover:bg-primary hover:text-white w-full text-lg">
        Bid to Work
      </button>
      <p className="text-[10px] text-center text-green-500">
        ✓ Verified Pro Access
      </p>
    </div>
  );
}
