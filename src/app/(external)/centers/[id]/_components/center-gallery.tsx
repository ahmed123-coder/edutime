"use client";

import { useState } from "react";

import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface CenterGalleryProps {
  images: string[];
}

export function CenterGallery({ images }: CenterGalleryProps) {
  const [currentImage, setCurrentImage] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  const nextLightboxImage = () => {
    setLightboxIndex((prev) => (prev + 1) % images.length);
  };

  const prevLightboxImage = () => {
    setLightboxIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Photos du centre</h2>

      {/* Main Gallery */}
      <div className="grid h-96 grid-cols-4 gap-4">
        {/* Main Image */}
        <div className="group relative col-span-2 cursor-pointer" onClick={() => openLightbox(currentImage)}>
          <div className="bg-muted flex h-full w-full items-center justify-center rounded-lg">
            <span className="text-muted-foreground">Image principale</span>
          </div>
          <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/0 transition-colors group-hover:bg-black/20">
            <Expand className="h-8 w-8 text-white opacity-0 transition-opacity group-hover:opacity-100" />
          </div>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-1/2 left-2 -translate-y-1/2 transform bg-black/50 text-white hover:bg-black/70"
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-1/2 right-2 -translate-y-1/2 transform bg-black/50 text-white hover:bg-black/70"
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}

          {/* Image Counter */}
          <div className="absolute right-2 bottom-2 rounded bg-black/50 px-2 py-1 text-sm text-white">
            {currentImage + 1} / {images.length}
          </div>
        </div>

        {/* Thumbnail Grid */}
        <div className="col-span-2 grid grid-cols-2 gap-4">
          {images.slice(1, 5).map((image, index) => (
            <div key={index} className="group relative cursor-pointer" onClick={() => openLightbox(index + 1)}>
              <div className="bg-muted flex h-full w-full items-center justify-center rounded-lg">
                <span className="text-muted-foreground text-sm">Image {index + 2}</span>
              </div>
              <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/0 transition-colors group-hover:bg-black/20">
                <Expand className="h-6 w-6 text-white opacity-0 transition-opacity group-hover:opacity-100" />
              </div>

              {/* Show more overlay for last image */}
              {index === 3 && images.length > 5 && (
                <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/60">
                  <span className="font-medium text-white">+{images.length - 5} photos</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* View All Button */}
      <div className="text-center">
        <Button variant="outline" onClick={() => openLightbox(0)}>
          Voir toutes les photos ({images.length})
        </Button>
      </div>

      {/* Lightbox */}
      <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
        <DialogContent className="h-[80vh] w-full max-w-4xl p-0">
          <div className="relative h-full w-full overflow-hidden rounded-lg bg-black">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10 bg-black/50 text-white hover:bg-black/70"
              onClick={() => setIsLightboxOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>

            {/* Main Image */}
            <div className="flex h-full w-full items-center justify-center">
              <div className="bg-muted flex h-full w-full items-center justify-center">
                <span className="text-muted-foreground">Image {lightboxIndex + 1}</span>
              </div>
            </div>

            {/* Navigation */}
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-1/2 left-4 -translate-y-1/2 transform bg-black/50 text-white hover:bg-black/70"
                  onClick={prevLightboxImage}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-1/2 right-4 -translate-y-1/2 transform bg-black/50 text-white hover:bg-black/70"
                  onClick={nextLightboxImage}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </>
            )}

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 transform rounded bg-black/50 px-3 py-1 text-white">
              {lightboxIndex + 1} / {images.length}
            </div>

            {/* Thumbnail Strip */}
            <div className="absolute right-4 bottom-4 left-4">
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {images.map((image, index) => (
                  <div
                    key={index}
                    className={`bg-muted h-12 w-16 flex-shrink-0 cursor-pointer rounded border-2 ${
                      index === lightboxIndex ? "border-white" : "border-transparent"
                    }`}
                    onClick={() => setLightboxIndex(index)}
                  >
                    <div className="text-muted-foreground flex h-full w-full items-center justify-center text-xs">
                      {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
