"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { getProjects, Project } from "@/data/mockData";
import ProjectCard from "@/components/ProjectCard";
import styles from "./page.module.css";

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
                className={`${styles.genreButton} ${selectedGenre === genre
                    ? styles.activeGenreButton
                    : styles.inactiveGenreButton
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
              <div className={styles.emptyState}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className={styles.emptyStateIcon}
                >
                  <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z" />
                </svg>
                <p className="text-h3 text-muted mb-4">
                  No {selectedGenre !== "All" ? selectedGenre : ""} projects yet
                </p>
                <p className="text-body text-muted max-w-md mx-auto mb-8">
                  {selectedGenre !== "All"
                    ? `Be the first to bring a ${selectedGenre} story to life!`
                    : "Check back later for new projects or explore other genres"
                  }
                </p>

                {selectedGenre !== "All" && (
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
                    <a
                      href="/create-pitch"
                      className={styles.pitchButton}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                      </svg>
                      Pitch Your {selectedGenre} Project
                    </a>
                    <button
                      onClick={() => setSelectedGenre("All")}
                      className={styles.browseButton}
                    >
                      Browse All Genres
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
