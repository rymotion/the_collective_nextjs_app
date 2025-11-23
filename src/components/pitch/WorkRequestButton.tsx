'use client';

import { useState } from 'react';
import { useSupabaseAuth } from '@/context/SupabaseAuthContext';
import { useRouter } from '@/i18n/routing';
import WorkRequestForm from './WorkRequestForm';

interface WorkRequestButtonProps {
  projectId: string;
  projectTitle: string;
}

export default function WorkRequestButton({
  projectId,
  projectTitle,
}: WorkRequestButtonProps) {
  const { isAuthenticated } = useSupabaseAuth();
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);

  const handleClick = () => {
    if (!isAuthenticated) {
      router.push(`/auth/signin?redirect=/pitches/${projectId}`);
      return;
    }
    setShowForm(true);
  };

  return (
    <>
      <div className="glass-panel p-6 border-l-4 border-primary">
        <h3 className="font-bold text-lg mb-3">Join the Team</h3>
        <p className="text-muted text-sm mb-4">
          {isAuthenticated
            ? 'Interested in working on this project? Submit a request to join the team.'
            : 'Sign in to request to work on this project'}
        </p>
        <button onClick={handleClick} className="btn btn-primary w-full">
          🎬 Request to Work on This Project
        </button>
      </div>

      {showForm && (
        <WorkRequestForm
          projectId={projectId}
          projectTitle={projectTitle}
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            window.location.reload();
          }}
        />
      )}
    </>
  );
}
