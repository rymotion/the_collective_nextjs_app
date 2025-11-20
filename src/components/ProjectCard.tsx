import { Link } from "@/i18n/routing";

interface ProjectCardProps {
  id: string;
  title: string;
  author: string;
  imageUrl: string;
  raised: number;
  goal: number;
  genre: string;
}

export default function ProjectCard({
  id,
  title,
  author,
  imageUrl,
  raised,
  goal,
  genre,
}: ProjectCardProps) {
  const progress = Math.min((raised / goal) * 100, 100);

  return (
    <Link href={`/projects/${id}`} className="group block">
      <div className="relative aspect-[2/3] overflow-hidden rounded-lg mb-4">
        <img
          src={imageUrl}
          alt={title}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
        
        <div className="absolute top-4 right-4">
          <span className="px-3 py-1 text-xs font-bold bg-black/50 backdrop-blur-md text-white rounded-full border border-white/10">
            {genre}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-bold leading-tight group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-sm text-muted">by {author}</p>

        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-primary font-bold">${raised.toLocaleString()} raised</span>
            <span className="text-muted">{Math.round(progress)}%</span>
          </div>
          
          {/* Enhanced Progress Bar */}
          <div className="relative h-2 w-full bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary via-red-500 to-primary transition-all duration-700 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              {/* Animated shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            </div>
            {/* Glow effect */}
            <div 
              className="absolute top-0 left-0 h-full bg-primary/50 blur-sm transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <div className="text-right text-xs text-muted">
            Goal: ${goal.toLocaleString()}
          </div>
        </div>
      </div>
    </Link>
  );
}
