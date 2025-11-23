'use client';

interface CommentSortBarProps {
  sortBy: 'score' | 'created_at';
  onSortChange: (sortBy: 'score' | 'created_at') => void;
}

export default function CommentSortBar({
  sortBy,
  onSortChange,
}: CommentSortBarProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted">Sort by:</span>
      <button
        onClick={() => onSortChange('score')}
        className={`px-3 py-1 text-sm rounded-lg transition-colors ${
          sortBy === 'score'
            ? 'bg-primary text-white'
            : 'bg-surface hover:bg-white/5'
        }`}
      >
        Top
      </button>
      <button
        onClick={() => onSortChange('created_at')}
        className={`px-3 py-1 text-sm rounded-lg transition-colors ${
          sortBy === 'created_at'
            ? 'bg-primary text-white'
            : 'bg-surface hover:bg-white/5'
        }`}
      >
        New
      </button>
    </div>
  );
}
