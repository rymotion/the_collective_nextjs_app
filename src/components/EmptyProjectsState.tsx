"use client";

import { useRouter } from 'next/navigation';
import { useSupabaseAuth } from '@/context/SupabaseAuthContext';

interface EmptyProjectsStateProps {
  locale: string;
}

export default function EmptyProjectsState({ locale }: EmptyProjectsStateProps) {
  const router = useRouter();
  const { isAuthenticated } = useSupabaseAuth();

  const handleCreatePitch = () => {
    if (isAuthenticated) {
      router.push(`/${locale}/create-pitch`);
    } else {
      router.push(`/${locale}/auth/signin?redirect=/create-pitch`);
    }
  };

  return (
    <div className="container py-20">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-12 animate-fade-in">
          <div className="inline-block mb-6 p-4 bg-glass backdrop-blur-sm border border-glass-border rounded-full">
            <svg
              className="w-16 h-16 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"
              />
            </svg>
          </div>

          <h2 className="text-display mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            No Projects Yet
          </h2>

          <p className="text-subtitle mb-10 leading-relaxed max-w-2xl mx-auto">
            Be the first to bring your cinematic vision to life. Share your screenplay
            and connect with a community ready to support independent filmmakers.
          </p>

          <button
            onClick={handleCreatePitch}
            className="btn btn-primary text-lg px-10 py-5 shadow-2xl hover:shadow-primary/50 transform hover:scale-105 transition-all duration-300 group"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-6 h-6 mr-3 inline-block group-hover:rotate-90 transition-transform duration-300"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            Pitch Your Screenplay
          </button>
        </div>

        <div className="mt-16 grid grid-cols-1 md-grid-cols-3 gap-6 text-left">
          <div className="glass-panel p-8 hover:border-primary/50 transition-all duration-300 group animate-slide-up">
            <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-8 h-8 text-primary"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                />
              </svg>
            </div>
            <h3 className="text-h3 mb-3 group-hover:text-primary transition-colors">
              Share Your Story
            </h3>
            <p className="text-caption leading-relaxed">
              Present your screenplay with a compelling pitch that captures the
              essence of your vision
            </p>
          </div>

          <div className="glass-panel p-8 hover:border-secondary/50 transition-all duration-300 group animate-slide-up" style={{ animationDelay: '100ms' }}>
            <div className="w-16 h-16 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-8 h-8 text-secondary"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                />
              </svg>
            </div>
            <h3 className="text-h3 mb-3 group-hover:text-secondary transition-colors">
              Build Your Team
            </h3>
            <p className="text-caption leading-relaxed">
              Invite crew members and collaborators to join your project directly
            </p>
          </div>

          <div className="glass-panel p-8 hover:border-accent/50 transition-all duration-300 group animate-slide-up" style={{ animationDelay: '200ms' }}>
            <div className="w-16 h-16 bg-gradient-to-br from-accent/20 to-accent/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-8 h-8 text-accent"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-h3 mb-3 group-hover:text-accent transition-colors">
              Get Funded
            </h3>
            <p className="text-caption leading-relaxed">
              Set your funding goal and duration to bring your film to life
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
