'use client';

import { useState, useEffect } from 'react';
import { CommentsService } from '@/services/comments.service';
import { useSupabaseAuth } from '@/context/SupabaseAuthContext';

interface VoteButtonsProps {
  commentId: string;
  initialScore: number;
  onVoteChange?: () => void;
}

export default function VoteButtons({
  commentId,
  initialScore,
  onVoteChange,
}: VoteButtonsProps) {
  const { user, isAuthenticated } = useSupabaseAuth();
  const [score, setScore] = useState(initialScore);
  const [userVote, setUserVote] = useState<'upvote' | 'downvote' | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchUserVote();
    }
  }, [commentId, user]);

  const fetchUserVote = async () => {
    if (!user) return;
    try {
      const vote = await CommentsService.getUserVote(commentId, user.id);
      setUserVote(vote);
    } catch (error) {
      console.error('Error fetching user vote:', error);
    }
  };

  const handleVote = async (voteType: 'upvote' | 'downvote') => {
    if (!isAuthenticated || !user || loading) return;

    setLoading(true);
    try {
      const result = await CommentsService.voteOnComment({
        comment_id: commentId,
        user_id: user.id,
        vote_type: voteType,
      });

      if (result.action === 'added') {
        setUserVote(voteType);
        setScore((prev) => prev + (voteType === 'upvote' ? 1 : -1));
      } else if (result.action === 'changed') {
        setUserVote(voteType);
        setScore((prev) => prev + (voteType === 'upvote' ? 2 : -2));
      } else if (result.action === 'removed') {
        setUserVote(null);
        setScore((prev) => prev + (voteType === 'upvote' ? -1 : 1));
      }

      onVoteChange?.();
    } catch (error) {
      console.error('Error voting on comment:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleVote('upvote')}
        disabled={!isAuthenticated || loading}
        className={`p-1 rounded transition-colors ${
          userVote === 'upvote'
            ? 'text-primary'
            : 'text-muted hover:text-primary'
        } ${!isAuthenticated ? 'opacity-50 cursor-not-allowed' : ''}`}
        title={isAuthenticated ? 'Upvote' : 'Sign in to vote'}
      >
        <svg
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 3l6 7h-4v7H8v-7H4l6-7z" />
        </svg>
      </button>

      <span className={`text-sm font-bold min-w-[2rem] text-center ${
        score > 0 ? 'text-primary' : score < 0 ? 'text-red-500' : 'text-muted'
      }`}>
        {score}
      </span>

      <button
        onClick={() => handleVote('downvote')}
        disabled={!isAuthenticated || loading}
        className={`p-1 rounded transition-colors ${
          userVote === 'downvote'
            ? 'text-red-500'
            : 'text-muted hover:text-red-500'
        } ${!isAuthenticated ? 'opacity-50 cursor-not-allowed' : ''}`}
        title={isAuthenticated ? 'Downvote' : 'Sign in to vote'}
      >
        <svg
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 17l-6-7h4V3h4v7h4l-6 7z" />
        </svg>
      </button>
    </div>
  );
}
