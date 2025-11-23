'use client';

import { useState, useEffect } from 'react';
import { CommentsService } from '@/services/comments.service';
import { useSupabaseAuth } from '@/context/SupabaseAuthContext';
import CommentItem from './CommentItem';

interface CommentThreadProps {
  comment: any;
  projectId: string;
  level?: number;
  onUpdate: () => void;
}

export default function CommentThread({
  comment,
  projectId,
  level = 0,
  onUpdate,
}: CommentThreadProps) {
  const [replies, setReplies] = useState<any[]>([]);
  const [showReplies, setShowReplies] = useState(true);
  const [loadingReplies, setLoadingReplies] = useState(false);

  useEffect(() => {
    if (comment.id && showReplies) {
      fetchReplies();
    }
  }, [comment.id, showReplies]);

  const fetchReplies = async () => {
    try {
      setLoadingReplies(true);
      const data = await CommentsService.getReplies(comment.id);
      setReplies(data);
    } catch (error) {
      console.error('Error fetching replies:', error);
    } finally {
      setLoadingReplies(false);
    }
  };

  const handleReplyAdded = () => {
    fetchReplies();
    onUpdate();
  };

  return (
    <div className={level > 0 ? 'ml-8 border-l-2 border-white/5 pl-4' : ''}>
      <CommentItem
        comment={comment}
        projectId={projectId}
        level={level}
        onReplyAdded={handleReplyAdded}
        onUpdate={onUpdate}
      />

      {replies.length > 0 && (
        <div className="mt-4 space-y-4">
          <button
            onClick={() => setShowReplies(!showReplies)}
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            {showReplies ? '▼' : '▶'} {replies.length}{' '}
            {replies.length === 1 ? 'reply' : 'replies'}
          </button>

          {showReplies && (
            <div className="space-y-4">
              {replies.map((reply) => (
                <CommentThread
                  key={reply.id}
                  comment={reply}
                  projectId={projectId}
                  level={level + 1}
                  onUpdate={onUpdate}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
