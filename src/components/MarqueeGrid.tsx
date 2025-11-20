import ProjectCard from "./ProjectCard";

interface Project {
  id: string;
  title: string;
  author: string;
  imageUrl: string;
  raised: number;
  goal: number;
  genre: string;
}

interface MarqueeGridProps {
  projects: Project[];
}

export default function MarqueeGrid({ projects }: MarqueeGridProps) {
  return (
    <div className="grid grid-rows-1 sm:grid-rows-2 md:grid-rows-3 lg:grid-rows-4 gap-8">
      {projects.map((project) => (
        <ProjectCard key={project.id} {...project} />
      ))}
    </div>
  );
}
