"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import type { ProjectImage } from "@/lib/queries/projects";

interface ImageCarouselProps {
  images: ProjectImage[];
  projectTitle: string;
  fallbackThumbnail?: string | null;
}

export default function ImageCarousel({
  images,
  projectTitle,
  fallbackThumbnail,
}: ImageCarouselProps) {
  // If no images in project_images array, use thumbnail if available
  const allImages = images.length > 0
    ? images.map((img) => img.image_url)
    : fallbackThumbnail
    ? [fallbackThumbnail]
    : [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  }, [allImages.length]);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  }, [allImages.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (allImages.length <= 1) return;
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "ArrowRight") nextSlide();
      if (e.key === "Escape" && lightboxOpen) setLightboxOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [prevSlide, nextSlide, lightboxOpen, allImages.length]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) nextSlide();
      else prevSlide();
    }
    setTouchStartX(null);
  };

  if (allImages.length === 0) {
    return (
      <div className="w-full aspect-video rounded-2xl bg-[#070522] border border-[#e1bee7]/20 flex items-center justify-center text-gray-500 text-sm">
        No preview images available for this project.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Carousel Frame */}
      <div
        className="relative w-full aspect-video sm:aspect-[16/9] rounded-2xl overflow-hidden bg-[#070522] border border-[#e1bee7]/20 shadow-2xl shadow-black/80 group select-none"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Current Image */}
        <div className="relative w-full h-full">
          <Image
            src={allImages[currentIndex]}
            alt={`${projectTitle} screenshot ${currentIndex + 1}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1100px"
            priority
            className="object-contain sm:object-cover transition-all duration-500 ease-out"
          />
        </div>

        {/* Gradient Overlay for subtle depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#070522]/60 via-transparent to-transparent pointer-events-none" />

        {/* Navigation Arrows (if multiple images) */}
        {allImages.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              aria-label="Previous Slide"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-[#ff3f81] text-white flex items-center justify-center backdrop-blur-md border border-white/10 transition-all opacity-80 sm:opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95 z-10"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              aria-label="Next Slide"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-[#ff3f81] text-white flex items-center justify-center backdrop-blur-md border border-white/10 transition-all opacity-80 sm:opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95 z-10"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Counter Badge & Fullscreen Button */}
        <div className="absolute bottom-3 right-3 flex items-center gap-2 z-10">
          {allImages.length > 1 && (
            <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[11px] font-medium text-white border border-white/15">
              {currentIndex + 1} / {allImages.length}
            </span>
          )}
          <button
            onClick={() => setLightboxOpen(true)}
            aria-label="View Fullscreen"
            className="p-1.5 rounded-full bg-black/70 hover:bg-[#ff3f81] backdrop-blur-md text-white border border-white/15 transition-colors"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Thumbnail Strip (if multiple images) */}
      {allImages.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
          {allImages.map((src, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`relative w-20 sm:w-24 aspect-video rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                idx === currentIndex
                  ? "border-[#ff3f81] scale-105 shadow-md shadow-[#ff3f81]/30"
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <Image
                src={src}
                alt={`Thumbnail ${idx + 1}`}
                fill
                sizes="96px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg flex items-center justify-center p-4">
          <button
            onClick={() => setLightboxOpen(false)}
            aria-label="Close Lightbox"
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-[#ff3f81] text-white transition-colors z-50"
          >
            <X className="w-6 h-6" />
          </button>

          {allImages.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-[#ff3f81] text-white transition-colors z-50"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-[#ff3f81] text-white transition-colors z-50"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          <div className="relative w-full max-w-5xl h-[80vh] flex items-center justify-center">
            <Image
              src={allImages[currentIndex]}
              alt={`${projectTitle} fullscreen view`}
              fill
              className="object-contain"
            />
          </div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-black/80 text-white text-xs border border-white/20">
            {currentIndex + 1} of {allImages.length}
          </div>
        </div>
      )}
    </div>
  );
}
