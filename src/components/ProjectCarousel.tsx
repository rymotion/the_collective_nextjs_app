"use client";

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Project } from "@/data/mockData";
import ProjectCard from "./ProjectCard";

interface ProjectCarouselProps {
  projects: Project[];
  title?: string;
}

export default function ProjectCarousel({
  projects,
  title,
}: ProjectCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "start",
    skipSnaps: false,
    dragFree: true,
  });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  if (projects.length === 0) return null;

  return (
    <div className="relative w-full">
      {title && (
        <div className="container mb-8">
          <h2 className="text-h2">{title}</h2>
        </div>
      )}

      <div className="relative group">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-6 pl-4 sm:pl-8 md:pl-12 lg:pl-16 pr-4 sm:pr-8 md:pr-12 lg:pr-16">
            {projects.map((project) => (
              <div
                key={project.id}
                className="flex-none w-[240px] sm:w-[280px] md:w-[300px] lg:w-[320px]"
              >
                <ProjectCard {...project} />
              </div>
            ))}
          </div>
        </div>

        {canScrollPrev && (
          <button
            className="absolute left-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-surface/90 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-primary hover:scale-110 transition-all duration-300 z-10 shadow-xl hover:shadow-primary/50 opacity-0 group-hover:opacity-100"
            onClick={scrollPrev}
            aria-label="Previous"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </button>
        )}

        {canScrollNext && (
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-surface/90 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-primary hover:scale-110 transition-all duration-300 z-10 shadow-xl hover:shadow-primary/50 opacity-0 group-hover:opacity-100"
            onClick={scrollNext}
            aria-label="Next"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
