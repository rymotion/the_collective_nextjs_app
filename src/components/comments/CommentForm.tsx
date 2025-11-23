'use client';

import { useState } from 'react';
import { useSupabaseAuth } from '@/context/SupabaseAuthContext';
import { CommentsService } from '@/services/comments.service';

interface CommentFormProps {
  projectId: string;
  parentId?: string;
  onCommentAdded: () => void;
  onCancel?: () => void;
  placeholder?: string;
}

export default function CommentForm({
  projectId,
  parentId,
  onCommentAdded,
  onCancel,
  placeholder = 'Share your thoughts...',
}: CommentFormProps) {
  const { user } = useSupabaseAuth();
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !user) return;

    setSubmitting(true);
    try {
      await CommentsService.createComment({
        project_id: projectId,
        user_id: user.id,
        content: content.trim(),
        parent_id: parentId || null,
      });

      setContent('');
      onCommentAdded();
    } catch (error) {
      console.error('Error posting comment:', error);
      alert('Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        rows={parentId ? 3 : 4}
        className="w-full p-3 bg-background border border-white/10 rounded-lg focus:border-primary focus:outline-none resize-none"
        disabled={submitting}
      />
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={!content.trim() || submitting}
          className="btn btn-primary disabled:opacity-50"
        >
          {submitting ? 'Posting...' : parentId ? 'Reply' : 'Comment'}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn btn-outline">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
