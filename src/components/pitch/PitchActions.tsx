'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/routing';
import { useSupabaseAuth } from '@/context/SupabaseAuthContext';
import { PitchesService } from '@/services/pitches.service';

interface PitchActionsProps {
  pitch: any;
  isEditMode?: boolean;
  onToggleEdit?: () => void;
}

export default function PitchActions({
  pitch,
  isEditMode = false,
  onToggleEdit,
}: PitchActionsProps) {
  const { user } = useSupabaseAuth();
  const router = useRouter();
  const [showShareModal, setShowShareModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isOwner = user?.id === pitch.author_id;

  const handleToggleEdit = () => {
    if (onToggleEdit) {
      onToggleEdit();
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        'Are you sure you want to delete this pitch? This action cannot be undone.'
      )
    ) {
      return;
    }

    setDeleting(true);
    try {
      await PitchesService.deletePitch(pitch.id);
      router.push('/pitches');
    } catch (error) {
      console.error('Error deleting pitch:', error);
      alert('Failed to delete pitch');
      setDeleting(false);
    }
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  const copyShareLink = () => {
    const shareUrl = `${window.location.origin}/pitches/${pitch.id}`;
    navigator.clipboard.writeText(shareUrl);
    alert('Link copied to clipboard!');
  };

  if (!isOwner) {
    return (
      <button onClick={handleShare} className="btn btn-outline">
        Share
      </button>
    );
  }

  return (
    <>
      <div className="flex items-center gap-3">
        {onToggleEdit && (
          <button onClick={handleToggleEdit} className="btn btn-primary">
            {isEditMode ? 'Cancel Edit' : 'Edit'}
          </button>
        )}
        <button onClick={handleShare} className="btn btn-outline">
          Share
        </button>
        {!isEditMode && (
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="btn btn-outline text-red-500 hover:bg-red-500/10 disabled:opacity-50"
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        )}
      </div>

      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-surface rounded-xl border border-white/10 max-w-md w-full p-6 space-y-4">
            <h3 className="text-xl font-bold">Share This Pitch</h3>
            <p className="text-sm text-muted">
              Share this pitch with others via the link below.
            </p>

            <div className="flex gap-2">
              <input
                type="text"
                value={`${window.location.origin}/pitches/${pitch.id}`}
                readOnly
                className="flex-1 p-3 bg-background border border-white/10 rounded-lg text-sm"
              />
              <button onClick={copyShareLink} className="btn btn-primary">
                Copy
              </button>
            </div>

            <button
              onClick={() => setShowShareModal(false)}
              className="btn btn-outline w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
