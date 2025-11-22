"use client";

import { Link } from "@/i18n/routing";

interface ProjectCardProps {
  id: string;
  title: string;
  author: string;
  imageUrl: string;
  raised: number;
  goal: number;
  genre: string;
  deadline?: string;
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
}: ProjectCardProps) {
  const progress = Math.min((raised / goal) * 100, 100);
  const daysLeft = deadline
    ? Math.ceil(
        (new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      )
    : null;

  return (
    <Link href={`/projects/${id}`} className="group block">
      <article className="flex flex-col h-full bg-surface rounded-xl border border-white/10 overflow-hidden transition-all hover:border-primary/50 hover:shadow-xl hover:-translate-y-1">
        <div className="relative aspect-[4/3] bg-black overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <span className="absolute top-3 left-3 px-3 py-1 text-xs font-bold bg-black/60 backdrop-blur-sm rounded-full uppercase tracking-wider">
            {genre}
          </span>
        </div>

        <div className="flex-1 flex flex-col p-5">
          <h3 className="text-lg font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-sm text-muted mb-4">by {author}</p>

          <div className="mt-auto">
            <div className="h-1.5 w-full bg-white/10 rounded-full mb-3 overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex justify-between items-end">
              <div>
                <p className="text-lg font-bold">
                  ${raised.toLocaleString()}
                </p>
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
          </div>
        </div>
      </article>
    </Link>
  );
}
