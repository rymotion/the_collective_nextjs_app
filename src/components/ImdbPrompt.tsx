"use client";

import { useRouter } from 'next/navigation';

export default function ImdbPrompt() {
  const router = useRouter();

  const handleConnectImdb = () => {
    router.push('/dashboard?section=imdb');
  };

  return (
    <section className="glass-panel p-8 border-dashed border-2 border-white/20">
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-6xl mb-4 block">🎬</span>
        <h3 className="text-h2 mb-4">Industry Professionals</h3>
        <p className="text-muted mb-6 leading-relaxed">
          To bid on projects and join productions, connect your IMDb profile
          and verify your industry credentials. This ensures quality connections
          between filmmakers and verified professionals.
        </p>

        <button
          onClick={handleConnectImdb}
          className="btn btn-primary mb-6"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 mr-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
          </svg>
          Connect IMDb Profile
        </button>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-xs text-muted">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-green-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Get verified status</span>
          </div>
          <span className="hidden sm:inline text-white/30">•</span>
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-green-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Bid on projects</span>
          </div>
          <span className="hidden sm:inline text-white/30">•</span>
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-green-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Showcase portfolio</span>
          </div>
        </div>
      </div>
    </section>
  );
}
