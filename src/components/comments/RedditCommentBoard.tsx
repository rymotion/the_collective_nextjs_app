'use client';

import { useState, useEffect } from 'react';
import { CommentsService } from '@/services/comments.service';
import { useSupabaseAuth } from '@/context/SupabaseAuthContext';
import CommentForm from './CommentForm';
import CommentThread from './CommentThread';
import CommentSortBar from './CommentSortBar';

interface RedditCommentBoardProps {
  projectId: string;
}

export default function RedditCommentBoard({ projectId }: RedditCommentBoardProps) {
  const { isAuthenticated } = useSupabaseAuth();
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'score' | 'created_at'>('score');

  useEffect(() => {
    fetchComments();
  }, [projectId, sortBy]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const data = await CommentsService.getComments(projectId, sortBy);
      const topLevelComments = data.filter((c) => !c.parent_id);
      setComments(topLevelComments);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCommentAdded = () => {
    fetchComments();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          Discussion ({comments.length} comments)
        </h2>
      </div>

      <CommentSortBar sortBy={sortBy} onSortChange={setSortBy} />

      {isAuthenticated ? (
        <div className="glass-panel p-6">
          <CommentForm
            projectId={projectId}
            onCommentAdded={handleCommentAdded}
          />
        </div>
      ) : (
        <div className="glass-panel p-6 text-center">
          <p className="text-muted mb-4">Sign in to join the discussion</p>
          <a href="/auth/signin" className="btn btn-primary">
            Sign In
          </a>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <p className="text-muted">Loading comments...</p>
        </div>
      ) : comments.length === 0 ? (
        <div className="glass-panel p-8 text-center">
          <p className="text-muted">
            No comments yet. Be the first to share your thoughts!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentThread
              key={comment.id}
              comment={comment}
              projectId={projectId}
              onUpdate={fetchComments}
            />
          ))}
        </div>
      )}
    </div>
  );
}
