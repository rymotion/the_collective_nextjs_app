'use client';

import { useState } from 'react';
import { useSupabaseAuth } from '@/context/SupabaseAuthContext';
import { CommentsService } from '@/services/comments.service';
import VoteButtons from './VoteButtons';
import CommentForm from './CommentForm';

interface CommentItemProps {
  comment: any;
  projectId: string;
  level: number;
  onReplyAdded: () => void;
  onUpdate: () => void;
}

export default function CommentItem({
  comment,
  projectId,
  level,
  onReplyAdded,
  onUpdate,
}: CommentItemProps) {
  const { user, isVerified } = useSupabaseAuth();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  const isAuthor = user?.id === comment.user_id;

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const handleEdit = async () => {
    if (!editContent.trim()) return;

    try {
      await CommentsService.updateComment(comment.id, editContent.trim());
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      console.error('Error updating comment:', error);
      alert('Failed to update comment');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    try {
      await CommentsService.deleteComment(comment.id);
      onUpdate();
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Failed to delete comment');
    }
  };

  if (comment.is_deleted) {
    return (
      <div className="glass-panel p-4 opacity-50">
        <p className="text-sm text-muted italic">[deleted]</p>
      </div>
    );
  }

  return (
    <div className="glass-panel p-4 space-y-3">
      <div className="flex items-start gap-4">
        <VoteButtons
          commentId={comment.id}
          initialScore={comment.score}
          onVoteChange={onUpdate}
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="font-semibold">
              {comment.author?.display_name || 'Anonymous'}
            </span>
            <span className="text-xs text-muted">
              {formatTimeAgo(comment.created_at)}
            </span>
            {comment.is_edited && (
              <span className="text-xs text-muted italic">(edited)</span>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full p-2 bg-background border border-white/10 rounded-lg text-sm resize-none"
                rows={3}
              />
              <div className="flex gap-2">
                <button onClick={handleEdit} className="btn btn-primary text-sm">
                  Save
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditContent(comment.content);
                  }}
                  className="btn btn-outline text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-sm whitespace-pre-wrap break-words">
                {comment.content}
              </p>

              <div className="flex items-center gap-4 mt-3">
                {isVerified && level < 5 && (
                  <button
                    onClick={() => setShowReplyForm(!showReplyForm)}
                    className="text-xs text-muted hover:text-primary transition-colors"
                  >
                    Reply
                  </button>
                )}
                {isAuthor && (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-xs text-muted hover:text-primary transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={handleDelete}
                      className="text-xs text-muted hover:text-red-500 transition-colors"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </>
          )}

          {showReplyForm && (
            <div className="mt-4">
              <CommentForm
                projectId={projectId}
                parentId={comment.id}
                onCommentAdded={() => {
                  setShowReplyForm(false);
                  onReplyAdded();
                }}
                onCancel={() => setShowReplyForm(false)}
                placeholder="Write a reply..."
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
