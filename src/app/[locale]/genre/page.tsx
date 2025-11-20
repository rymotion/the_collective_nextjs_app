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
    <div className="w-full page-content">
      <div className="container">
        <div className="mb-16 text-center">
          <h1 className="text-h1 mb-6">Browse by Genre</h1>
          <p className="text-subtitle max-w-3xl mx-auto leading-relaxed">
            Explore projects across different genres and find your next favorite story
          </p>
        </div>

        <div className="mb-16">
          <div className="flex flex-wrap gap-4 justify-center max-w-5xl mx-auto">
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 ${
                  selectedGenre === genre
                    ? "bg-primary text-white shadow-xl shadow-primary/40 scale-105"
                    : "bg-surface text-foreground border-2 border-white/10 hover:border-primary hover:bg-white/5"
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="inline-block w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <div className="mb-10">
              <p className="text-lg text-muted text-center font-medium">
                {filteredProjects.length} project{filteredProjects.length !== 1 ? "s" : ""}{" "}
                {selectedGenre !== "All" && (
                  <span className="text-primary font-bold">in {selectedGenre}</span>
                )}
              </p>
            </div>

            {filteredProjects.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
                {filteredProjects.map((project) => (
                  <ProjectCard key={project.id} {...project} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-20 h-20 mx-auto mb-6 text-muted opacity-50"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-1.5A1.125 1.125 0 0118 18.375M20.625 4.5H3.375m17.25 0c.621 0 1.125.504 1.125 1.125M20.625 4.5h-1.5C18.504 4.5 18 5.004 18 5.625m3.75 0v1.5c0 .621-.504 1.125-1.125 1.125M3.375 4.5c-.621 0-1.125.504-1.125 1.125M3.375 4.5h1.5C5.496 4.5 6 5.004 6 5.625m-3.75 0v1.5c0 .621.504 1.125 1.125 1.125m0 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m1.5-3.75C5.496 8.25 6 7.746 6 7.125v-1.5M4.875 8.25C5.496 8.25 6 8.754 6 9.375v1.5m0-5.25v5.25m0-5.25C6 5.004 6.504 4.5 7.125 4.5h9.75c.621 0 1.125.504 1.125 1.125m1.125 2.625h1.5m-1.5 0A1.125 1.125 0 0118 7.125v-1.5m1.125 2.625c-.621 0-1.125.504-1.125 1.125v1.5m2.625-2.625c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125M18 5.625v5.25M7.125 12h9.75m-9.75 0A1.125 1.125 0 016 10.875M7.125 12C6.504 12 6 12.504 6 13.125m0-2.25C6 11.496 5.496 12 4.875 12M18 10.875c0 .621-.504 1.125-1.125 1.125M18 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m-12 5.25v-5.25m0 5.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125m-12 0v-1.5c0-.621-.504-1.125-1.125-1.125M18 18.375v-5.25m0 5.25v-1.5c0-.621.504-1.125 1.125-1.125M18 13.125v1.5c0 .621.504 1.125 1.125 1.125M18 13.125c0-.621.504-1.125 1.125-1.125M6 13.125v1.5c0 .621-.504 1.125-1.125 1.125M6 13.125C6 12.504 5.496 12 4.875 12m-1.5 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M19.125 12h1.5m0 0c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h1.5m14.25 0h1.5"
                  />
                </svg>
                <p className="text-h3 text-muted mb-4">No projects in this genre</p>
                <p className="text-body text-muted max-w-md mx-auto">
                  Check back later for new projects or explore other genres
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
