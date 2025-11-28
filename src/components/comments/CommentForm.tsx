'use client';

import { useState } from 'react';
import { useSupabaseAuth } from '@/context/SupabaseAuthContext';
import { CommentsService } from '@/services/comments.service';
import Link from 'next/link';

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
  const { user, isVerified } = useSupabaseAuth();
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

  // Show sign-up prompt for unverified users
  if (!isVerified) {
    return (
      <div className="glass-panel p-6 text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-12 h-12 mx-auto mb-3 text-primary"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
          />
        </svg>
        <h4 className="text-lg font-bold mb-2">Join the Conversation</h4>
        <p className="text-muted mb-4">
          Sign up to comment and engage with the community
        </p>
        <Link href="/auth/signup" className="btn btn-primary inline-block">
          Sign Up to Comment
        </Link>
      </div>
    );
  }

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
