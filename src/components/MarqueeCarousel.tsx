"use client";

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { useRouter } from "@/i18n/routing";
// Project type for carousel - matches Supabase projects table structure
interface Project {
  id: string;
  title: string;
  author?: { display_name: string | null; avatar_url: string | null } | string;
  image_url?: string | null;
  imageUrl?: string; // Legacy support
  raised: number;
  goal: number;
  genre: string;
  synopsis?: string;
}

interface MarqueeCarouselProps {
  projects: Project[];
}

export default function MarqueeCarousel({ projects }: MarqueeCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    skipSnaps: false,
    axis: "x",
    duration: 25, // Smoother transitions
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const router = useRouter();

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  // Auto-play functionality
  useEffect(() => {
    if (!emblaApi || isHovering) return;

    const autoplay = setInterval(() => {
      emblaApi.scrollNext();
    }, 4000); // Auto-advance every 4 seconds

    return () => clearInterval(autoplay);
  }, [emblaApi, isHovering]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const handleFundProject = () => {
    if (projects[selectedIndex]) {
      router.push(`/projects/${projects[selectedIndex].id}`);
    }
  };

  const selectedProject = projects[selectedIndex];
  const progress = selectedProject
    ? Math.min((selectedProject.raised / selectedProject.goal) * 100, 100)
    : 0;

  return (
    <div
      className="relative w-full"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Carousel */}
      <div
        className="overflow-hidden mb-12 w-full"
        ref={emblaRef}
        style={{ touchAction: "pan-y pinch-zoom" }}
      >
        <div className="flex flex-row flex-nowrap items-center">
          {projects.map((project, index) => {
            const isSelected = index === selectedIndex;
            const offset = Math.abs(index - selectedIndex);

            return (
              <div
                key={project.id}
                className="flex-[0_0_240px] sm:flex-[0_0_280px] md:flex-[0_0_320px] lg:flex-[0_0_360px] min-w-0 px-3 transition-all duration-700 ease-out"
                style={{
                  transform: isSelected
                    ? "scale(1) translateY(0) rotateY(0deg)"
                    : `scale(0.85) translateY(${offset * 5}px) rotateY(${
                        offset > 0 ? -5 : 5
                      }deg)`,
                  opacity: isSelected ? 1 : Math.max(0.3, 1 - offset * 0.2),
                  filter: isSelected
                    ? "blur(0px)"
                    : `blur(${Math.min(offset * 0.5, 2)}px)`,
                  transformStyle: "preserve-3d",
                }}
              >
                <button
                  onClick={() => scrollTo(index)}
                  className="w-full group/poster relative block"
                >
                  {/* 27" x 41" aspect ratio = 0.659:1 */}
                  <div
                    className="relative rounded-xl overflow-hidden shadow-2xl border border-white/10 transition-all duration-500 group-hover/poster:shadow-primary/40 group-hover/poster:scale-105 group-hover/poster:border-primary/50"
                    style={{ aspectRatio: "27 / 41" }}
                  >
                    <img
                      src={
                        (project as any).imageUrl ||
                        (project as any).image_url ||
                        ""
                      }
                      alt={project.title}
                      className="w-full h-full object-fill transition-transform duration-700 group-hover/poster:scale-110"
                      style={{ aspectRatio: "27 / 41" }}
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-60 group-hover/poster:opacity-40 transition-opacity duration-300" />

                    {/* Shine effect on hover */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/0 to-transparent group-hover/poster:via-white/10 transition-all duration-500 opacity-0 group-hover/poster:opacity-100" />

                    {/* Genre badge - always visible */}
                    <div className="absolute top-3 right-3 transition-transform duration-300 group-hover/poster:scale-110">
                      <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-white rounded border border-white/20">
                        {project.genre}
                      </span>
                    </div>
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Buttons */}
      <button
        className="absolute left-4 top-1/3 -translate-y-1/2 w-14 h-14 rounded-full bg-surface/90 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-primary hover:scale-110 hover:rotate-12 transition-all duration-300 z-10 shadow-xl hover:shadow-primary/50 active:scale-95"
        onClick={scrollPrev}
        aria-label="Previous project"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
      </button>
      <button
        className="absolute right-4 top-1/3 -translate-y-1/2 w-14 h-14 rounded-full bg-surface/90 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-primary hover:scale-110 hover:-rotate-12 transition-all duration-300 z-10 shadow-xl hover:shadow-primary/50 active:scale-95"
        onClick={scrollNext}
        aria-label="Next project"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 4.5l7.5 7.5-7.5 7.5"
          />
        </svg>
      </button>

      {/* Selected Project Info - Only shown for centered poster */}
      {selectedProject && (
        <div className="max-w-2xl mx-auto text-center space-y-6 animate-fade-in">
          <div className="animate-slide-up">
            <h2 className="text-h1 mb-2 leading-tight">
              {selectedProject.title}
            </h2>
            <p className="text-subtitle">
              by{" "}
              {typeof (selectedProject as any).author === "string"
                ? (selectedProject as any).author
                : (selectedProject as any).author?.display_name || "Anonymous"}
            </p>
          </div>

          {/* Funding Progress */}
          <div
            className="glass-panel p-6 max-w-md mx-auto animate-slide-up"
            style={{ animationDelay: "100ms" }}
          >
            <div className="flex justify-between items-end mb-3">
              <div>
                <span className="text-3xl font-bold text-primary">
                  ${selectedProject.raised.toLocaleString()}
                </span>
                <span className="text-sm text-muted ml-2">
                  of ${selectedProject.goal.toLocaleString()}
                </span>
              </div>
              <span className="text-2xl font-bold">
                {Math.round(progress)}%
              </span>
            </div>

            {/* Enhanced Progress Bar */}
            <div className="relative h-3 w-full bg-white/10 rounded-full overflow-hidden mb-4">
              <div
                className="h-full bg-gradient-to-r from-primary via-red-500 to-primary transition-all duration-700 ease-out relative"
                style={{ width: `${progress}%` }}
              >
                {/* Animated shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
              </div>
              {/* Glow effect */}
              <div
                className="absolute top-0 left-0 h-full bg-primary/60 blur-md transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>

            <button
              onClick={handleFundProject}
              className="btn btn-primary w-full py-3 text-lg shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
            >
              Fund This Project
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
