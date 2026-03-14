"use client";

import { Link } from "@/i18n/routing";
import styles from "./ProjectCard.module.css";

interface ProjectCardProps {
  id: string;
  title: string;
  author: string;
  imageUrl?: string;
  raised: number;
  goal: number;
  genre: string;
  deadline?: string;
  synopsis?: string;
  workRequestsCount?: number;
  commentsCount?: number;
  pitchStatus?: string;
}

export default function ProjectCard({
  id,
  title,
  author,
  imageUrl,
  raised,
  goal,
  genre,
  deadline,
  synopsis,
  workRequestsCount = 0,
  commentsCount = 0,
  pitchStatus,
}: ProjectCardProps) {
  const progress = Math.min((raised / goal) * 100, 100);
  const daysLeft = deadline
    ? Math.ceil(
      (new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    )
    : null;

  return (
    <Link href={`/pitches/${id}`} className="group block h-full">
      <article className={styles.card}>
        <div className="relative aspect-[2/3] overflow-hidden rounded-t-lg">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/10 flex items-center justify-center">
              <div className="text-7xl opacity-20">🎬</div>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80" />

          <div className="absolute top-0 left-0 right-0 p-3 flex items-start justify-between">
            <span className="px-3 py-1.5 text-xs font-bold bg-glass backdrop-blur-md border border-glass-border rounded-full uppercase tracking-widest">
              {genre}
            </span>
            {pitchStatus === "funded" && (
              <span className="px-3 py-1.5 text-xs font-bold bg-green-500/30 text-green-400 backdrop-blur-md border border-green-500/30 rounded-full flex items-center gap-1.5">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Funded
              </span>
            )}
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-xl font-bold mb-1 line-clamp-2 group-hover:text-primary transition-colors duration-300 drop-shadow-lg">
              {title}
            </h3>
            <p className="text-sm text-foreground/90 font-medium">by {author}</p>
          </div>
        </div>

        <div className="flex-1 flex flex-col p-5 bg-glass/50 rounded-b-lg">
          {synopsis && (
            <p className="text-sm text-foreground-muted line-clamp-2 mb-4 leading-relaxed">
              {synopsis}
            </p>
          )}

          {(workRequestsCount > 0 || commentsCount > 0) && (
            <div className="flex flex-wrap gap-2 mb-4">
              {workRequestsCount > 0 && (
                <span className="px-3 py-1 text-xs font-semibold bg-glass backdrop-blur-sm border border-glass-border rounded-full flex items-center gap-1.5">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                  {workRequestsCount}
                </span>
              )}
              {commentsCount > 0 && (
                <span className="px-3 py-1 text-xs font-semibold bg-glass backdrop-blur-sm border border-glass-border rounded-full flex items-center gap-1.5">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                  </svg>
                  {commentsCount}
                </span>
              )}
            </div>
          )}

          <div className="mt-auto">
            <div className="relative h-2 w-full bg-glass border border-glass-border rounded-full mb-3 overflow-hidden">
              <div
                className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 transition-all duration-700 ease-out shadow-[0_0_10px_rgba(229,9,20,0.5)]"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex justify-between items-end mb-2">
              <div>
                <p className="text-xl font-bold text-primary">
                  ${raised.toLocaleString()}
                </p>
                <p className="text-xs text-foreground-muted font-medium">
                  of ${goal.toLocaleString()}
                </p>
              </div>
              {daysLeft !== null && (
                <div className="text-right">
                  <p className="text-xl font-bold text-secondary">
                    {daysLeft > 0 ? daysLeft : 0}
                  </p>
                  <p className="text-xs text-foreground-muted font-medium">
                    days left
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-foreground-muted font-medium">
                {progress.toFixed(1)}% funded
              </span>
              {progress >= 100 && (
                <span className="text-green-400 font-semibold flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Goal Reached
                </span>
              )}
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
