"use client";

import { useSupabaseAuth } from "@/context/SupabaseAuthContext";
import Link from "next/link";

interface CastMember {
  name: string;
  role: string;
  imageUrl?: string;
}

interface Accolade {
  title: string;
  year: string;
}

interface Funder {
  id: string;
  name: string;
  amount: number;
  imageUrl?: string;
}

interface PitchDetailsProps {
  synopsis: string;
  cast: CastMember[];
  crew: CastMember[];
  accolades: Accolade[];
  funders: Funder[];
}

export default function PitchDetails({
  synopsis,
  cast,
  crew,
  accolades,
  funders,
}: PitchDetailsProps) {
  const { isVerified } = useSupabaseAuth();

  return (
    <div className="space-y-12">
      {/* Synopsis - Public for all users */}
      <section>
        <h3 className="text-2xl font-bold mb-4">Synopsis</h3>
        <p className="text-lg leading-relaxed text-muted">{synopsis}</p>
      </section>

      {/* Cast & Crew - Verified users only */}
      {isVerified ? (
        <section>
          <h3 className="text-2xl font-bold mb-6">Cast & Crew</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4 text-primary">Cast</h4>
              <ul className="space-y-4">
                {cast.map((member, idx) => (
                  <li key={idx} className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-surface overflow-hidden">
                      {member.imageUrl ? (
                        <img src={member.imageUrl} alt={member.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted font-bold">
                          {member.name[0]}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{member.name}</div>
                      <div className="text-sm text-muted">{member.role}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-primary">Crew</h4>
              <ul className="space-y-4">
                {crew.map((member, idx) => (
                  <li key={idx} className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-surface overflow-hidden">
                      {member.imageUrl ? (
                        <img src={member.imageUrl} alt={member.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted font-bold">
                          {member.name[0]}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{member.name}</div>
                      <div className="text-sm text-muted">{member.role}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      ) : (
        <section className="glass-panel p-8 text-center">
          <div className="max-w-md mx-auto">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-16 h-16 mx-auto mb-4 text-primary"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
              />
            </svg>
            <h4 className="text-xl font-bold mb-2">Sign Up to View Full Details</h4>
            <p className="text-muted mb-6">
              Cast and crew information is available to verified users only. Create a free account to see the full pitch details.
            </p>
            <Link href="/auth/signup" className="btn btn-primary inline-block">
              Sign Up Free
            </Link>
          </div>
        </section>
      )}

      {/* Accolades - Public for all users */}
      {accolades.length > 0 && (
        <section>
          <h3 className="text-2xl font-bold mb-6">Accolades</h3>
          <div className="flex flex-wrap gap-4">
            {accolades.map((accolade, idx) => (
              <div key={idx} className="glass-panel px-6 py-4 flex flex-col items-center text-center">
                <span className="text-2xl mb-2">🏆</span>
                <span className="font-bold">{accolade.title}</span>
                <span className="text-sm text-muted">{accolade.year}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Funders - Public for all users */}
      <section>
        <h3 className="text-2xl font-bold mb-6">Funders</h3>
        <div className="glass-panel p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {funders.map((funder) => (
              <div key={funder.id} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-surface overflow-hidden">
                  {funder.imageUrl ? (
                    <img src={funder.imageUrl} alt={funder.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted font-bold">
                      {funder.name[0]}
                    </div>
                  )}
                </div>
                <div>
                  <div className="text-sm font-medium">{funder.name}</div>
                  <div className="text-xs text-primary">${funder.amount.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
