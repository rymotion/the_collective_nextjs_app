'use client';

import { Link } from '@/i18n/routing';
import { useSupabaseAuth } from '@/context/SupabaseAuthContext';

interface PitchCardProps {
  pitch: any;
}

export default function PitchCard({ pitch }: PitchCardProps) {
  const { user } = useSupabaseAuth();
  const isOwner = user?.id === pitch.author_id;

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

  return (
    <Link href={`/pitches/${pitch.id}`} className="group block">
      <article className="bg-surface rounded-xl border border-white/10 overflow-hidden transition-all hover:border-primary/50 hover:shadow-xl hover:-translate-y-1 h-full flex flex-col">
        <div className="p-6 border-b border-white/10 flex-1">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                {pitch.title}
              </h3>
              <div className="flex items-center gap-3 text-sm text-muted">
                <span>by {pitch.author?.display_name || 'Anonymous'}</span>
                <span>•</span>
                <span>{formatTimeAgo(pitch.created_at)}</span>
              </div>
            </div>

            {pitch.pitch_status === 'funded' && (
              <span className="px-3 py-1 text-xs font-bold bg-green-500/20 text-green-500 rounded-full">
                Funded
              </span>
            )}
          </div>

          <p className="text-muted line-clamp-3 mb-4">{pitch.synopsis}</p>

          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 text-xs font-bold bg-primary/20 text-primary rounded-full">
              {pitch.genre}
            </span>
            <span className="px-3 py-1 text-xs font-bold bg-surface border border-white/10 rounded-full">
              {pitch.work_requests?.[0]?.count || 0} work requests
            </span>
            <span className="px-3 py-1 text-xs font-bold bg-surface border border-white/10 rounded-full">
              {pitch.comments?.[0]?.count || 0} comments
            </span>
          </div>
        </div>

        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm">
            <span className="text-muted">Goal: ${pitch.goal?.toLocaleString()}</span>
            {pitch.raised && pitch.raised > 0 && (
              <span className="text-primary font-bold">
                Raised: ${pitch.raised.toLocaleString()}
              </span>
            )}
          </div>

          {isOwner && (
            <span className="text-xs text-muted bg-background px-2 py-1 rounded">
              Your Pitch
            </span>
          )}
        </div>
      </article>
    </Link>
  );
}
