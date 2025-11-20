"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { getProjects, Project } from "@/data/mockData";
import ProjectCard from "@/components/ProjectCard";

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const t = useTranslations("SearchPage");

  useEffect(() => {
    const loadProjects = async () => {
      const { data } = await getProjects(1, 100);
      setProjects(data);
      setFilteredProjects(data);
      setLoading(false);
    };
    loadProjects();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredProjects(projects);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = projects.filter(
      (project) =>
        project.title.toLowerCase().includes(query) ||
        project.author.toLowerCase().includes(query) ||
        project.genre.toLowerCase().includes(query) ||
        project.synopsis.toLowerCase().includes(query)
    );
    setFilteredProjects(filtered);
  }, [searchQuery, projects]);

  return (
    <div className="w-full page-content">
      <div className="container">
        <div className="container-narrow mx-auto mb-12">
          <h1 className="text-h1 mb-8 text-center">Search Projects</h1>

          <div className="relative">
            <input
              type="text"
              placeholder="Search by title, author, genre, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-5 bg-surface border-2 border-white/10 rounded-xl text-foreground text-lg placeholder:text-muted focus:outline-none focus:border-primary transition-all shadow-lg focus:shadow-primary/20"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-6 h-6 absolute right-5 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
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
                {filteredProjects.length} project{filteredProjects.length !== 1 ? "s" : ""} found
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
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
                <p className="text-h3 text-muted mb-4">No projects found</p>
                <p className="text-body text-muted max-w-md mx-auto">
                  Try adjusting your search terms or explore different keywords
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
