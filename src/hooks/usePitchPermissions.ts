'use client';

import { useState, useEffect } from 'react';
import { useSupabaseAuth } from '@/context/SupabaseAuthContext';
import { PitchesService } from '@/services/pitches.service';

export function usePitchPermissions(pitchId: string) {
  const { user, isAuthenticated } = useSupabaseAuth();
  const [pitch, setPitch] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [canEdit, setCanEdit] = useState(false);

  useEffect(() => {
    if (pitchId) {
      fetchPitch();
    }
  }, [pitchId, user]);

  const fetchPitch = async () => {
    try {
      setLoading(true);
      const pitchData = await PitchesService.getPitch(pitchId);
      setPitch(pitchData);

      const isOwner = isAuthenticated && user?.id === pitchData?.author_id;
      setCanEdit(isOwner);
    } catch (error) {
      console.error('Error fetching pitch:', error);
      setPitch(null);
      setCanEdit(false);
    } finally {
      setLoading(false);
    }
  };

  return {
    pitch,
    loading,
    canEdit,
    isAuthenticated,
    isOwner: canEdit,
    refetch: fetchPitch,
  };
}
