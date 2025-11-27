"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  ProjectsService,
  ProjectWithDetails,
} from "@/services/projects.service";
import ProjectCard from "@/components/ProjectCard";
import Input from "@/components/Input";
import styles from "./page.module.css";

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [projects, setProjects] = useState<ProjectWithDetails[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<
    ProjectWithDetails[]
  >([]);
  const [loading, setLoading] = useState(true);
  const t = useTranslations("SearchPage");

  useEffect(() => {
    const loadProjects = async () => {
      console.log("[SearchPage] Loading projects from Supabase...");
      try {
        const { projects: data } = await ProjectsService.getAllProjects(100);
        console.log("[SearchPage] Loaded", data.length, "projects");
        setProjects(data);
        setFilteredProjects(data);
      } catch (error) {
        console.error("[SearchPage] Error loading projects:", error);
      } finally {
        setLoading(false);
      }
    };
    loadProjects();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredProjects(projects);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = projects.filter((project) => {
      const authorName =
        typeof project.author === "string"
          ? project.author
          : project.author?.display_name || "";
      return (
        project.title?.toLowerCase().includes(query) ||
        authorName.toLowerCase().includes(query) ||
        project.genre?.toLowerCase().includes(query) ||
        project.synopsis?.toLowerCase().includes(query)
      );
    });
    setFilteredProjects(filtered);
  }, [searchQuery, projects]);

  return (
    <div className="w-full page-content">
      <div className="container">
        <div className="container-narrow mx-auto mb-12">
          <h1 className="text-h1 mb-8 text-center">Search Projects</h1>

          <div className="max-w-2xl mx-auto">
            <Input
              label="Search"
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search by title, author, genre, or description..."
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                </svg>
              }
            />
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
                {filteredProjects.length} project
                {filteredProjects.length !== 1 ? "s" : ""} found
              </p>
            </div>

            {filteredProjects.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
                {filteredProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    id={project.id}
                    title={project.title}
                    author={
                      typeof project.author === "string"
                        ? project.author
                        : project.author?.display_name || "Anonymous"
                    }
                    imageUrl={project.image_url || ""}
                    raised={
                      typeof project.raised === "string"
                        ? parseFloat(project.raised)
                        : project.raised
                    }
                    goal={
                      typeof project.goal === "string"
                        ? parseFloat(project.goal)
                        : project.goal
                    }
                    genre={project.genre}
                    synopsis={project.synopsis || ""}
                  />
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
                  <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                </svg>
                <p className={styles.emptyStateText}>
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
