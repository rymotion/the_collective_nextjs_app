"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { getProjects, Project } from "@/data/mockData";
import ProjectCard from "@/components/ProjectCard";

export default function GenrePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string>("All");
  const [genres, setGenres] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const t = useTranslations("GenrePage");

  useEffect(() => {
    const loadProjects = async () => {
      const { data } = await getProjects(1, 100);
      setProjects(data);

      const uniqueGenres = Array.from(
        new Set(data.map((p) => p.genre))
      ).sort();
      setGenres(["All", ...uniqueGenres]);
      setLoading(false);
    };
    loadProjects();
  }, []);

  const filteredProjects =
    selectedGenre === "All"
      ? projects
      : projects.filter((p) => p.genre === selectedGenre);

  return (
    <div className="container py-12">
      <div className="mb-12">
        <h1 className="text-h1 mb-6 text-center">Browse by Genre</h1>
        <p className="text-subtitle text-center max-w-2xl mx-auto">
          Explore projects across different genres and find your next favorite story
        </p>
      </div>

      <div className="mb-12">
        <div className="flex flex-wrap gap-3 justify-center">
          {genres.map((genre) => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                selectedGenre === genre
                  ? "bg-primary text-white shadow-lg shadow-primary/30"
                  : "bg-surface text-foreground border border-white/10 hover:border-primary hover:bg-surface/80"
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          <div className="mb-8">
            <p className="text-muted text-center">
              {filteredProjects.length} project{filteredProjects.length !== 1 ? "s" : ""}{" "}
              {selectedGenre !== "All" && `in ${selectedGenre}`}
            </p>
          </div>

          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} {...project} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-h3 text-muted mb-4">No projects in this genre</p>
              <p className="text-body text-muted">
                Check back later for new projects
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
