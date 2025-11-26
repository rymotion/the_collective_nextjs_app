"use client";

import { Link } from "@/i18n/routing";

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

import styles from "./ProjectCard.module.css";

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
    <Link href={`/pitches/${id}`} className="group block">
      <article className={styles.card}>
        {/* Project Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <div className="text-6xl opacity-20">🎬</div>
            </div>
          )}
          <span className="absolute top-3 left-3 px-3 py-1 text-xs font-bold bg-black/60 backdrop-blur-sm rounded-full uppercase tracking-wider">
            {genre}
          </span>
          {pitchStatus === "funded" && (
            <span className="absolute top-3 right-3 px-3 py-1 text-xs font-bold bg-green-500/20 text-green-500 backdrop-blur-sm rounded-full">
              Funded
            </span>
          )}
        </div>

        <div className="flex-1 flex flex-col p-5">
          <h3 className="text-lg font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-sm text-muted mb-2">by {author}</p>

          {/* Synopsis */}
          {synopsis && (
            <p className="text-sm text-muted line-clamp-2 mb-4">{synopsis}</p>
          )}

          {/* Tags */}
          {(workRequestsCount > 0 || commentsCount > 0) && (
            <div className="flex flex-wrap gap-2 mb-4">
              {workRequestsCount > 0 && (
                <span className="px-2 py-1 text-xs font-bold bg-surface border border-white/10 rounded-full">
                  {workRequestsCount} work requests
                </span>
              )}
              {commentsCount > 0 && (
                <span className="px-2 py-1 text-xs font-bold bg-surface border border-white/10 rounded-full">
                  {commentsCount} comments
                </span>
              )}
            </div>
          )}

          <div className="mt-auto">
            <div className="h-1.5 w-full bg-white/10 rounded-full mb-3 overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex justify-between items-end">
              <div>
                <p className="text-lg font-bold">${raised.toLocaleString()}</p>
                <p className="text-xs text-muted">pledged</p>
              </div>
              {daysLeft !== null && (
                <div className="text-right">
                  <p className="text-lg font-bold">
                    {daysLeft > 0 ? daysLeft : 0}
                  </p>
                  <p className="text-xs text-muted">days left</p>
                </div>
              )}
            </div>

            {/* Funding Progress Percentage */}
            <div className="text-xs text-muted text-right mt-1">
              {progress.toFixed(1)}% funded
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
