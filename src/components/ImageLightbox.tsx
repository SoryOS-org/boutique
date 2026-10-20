import React, { useState } from 'react';
import { X, ZoomIn, ZoomOut, RotateCcw, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

interface ImageLightboxProps {
  isOpen: boolean;
  images: string[];
  initialIndex?: number;
  productName: string;
  onClose: () => void;
}

export const ImageLightbox: React.FC<ImageLightboxProps> = ({
  isOpen,
  images,
  initialIndex = 0,
  productName,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const activeImage = images[currentIndex] || images[0];

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => {
      const next = Math.max(prev - 0.5, 1);
      if (next === 1) setPosition({ x: 0, y: 0 });
      return next;
    });
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    handleResetZoom();
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    handleResetZoom();
  };

  if (!isOpen || images.length === 0) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-2xl flex flex-col items-center justify-center p-4 sm:p-8 animate-in fade-in duration-300 select-none"
      onClick={onClose}
    >
      {/* Top Header Bar */}
      <div
        className="absolute top-0 inset-x-0 p-4 sm:p-6 flex items-center justify-between z-20 bg-gradient-to-b from-black/80 to-transparent pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-white text-xs font-medium border border-white/15">
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            <span className="truncate max-w-[220px] sm:max-w-md">{productName}</span>
          </div>
          {images.length > 1 && (
            <span className="text-xs font-mono text-zinc-400 bg-black/40 px-2.5 py-1 rounded-full border border-white/10">
              {currentIndex + 1} / {images.length}
            </span>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleZoomOut}
            disabled={zoomLevel <= 1}
            title="Dézoomer"
            className="p-2.5 bg-white/10 hover:bg-white/20 disabled:opacity-40 text-white rounded-full transition-all cursor-pointer backdrop-blur-md border border-white/15"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomIn}
            disabled={zoomLevel >= 3}
            title="Zoom HD (Jusqu'à 3x)"
            className="p-2.5 bg-white/10 hover:bg-white/20 disabled:opacity-40 text-white rounded-full transition-all cursor-pointer backdrop-blur-md border border-white/15"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          {zoomLevel > 1 && (
            <button
              onClick={handleResetZoom}
              title="Réinitialiser le zoom"
              className="p-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-full transition-all cursor-pointer shadow-lg"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            aria-label="Fermer le visualiseur"
            className="p-2.5 bg-white/15 hover:bg-white/25 text-white rounded-full transition-all cursor-pointer backdrop-blur-md border border-white/20 ml-2 shadow-xl"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Image Display Box */}
      <div
        className="relative w-full h-full flex items-center justify-center overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-4 sm:left-8 z-20 p-3 bg-black/50 hover:bg-black/80 backdrop-blur-md text-white rounded-full border border-white/25 shadow-2xl transition-all hover:scale-110 cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 sm:right-8 z-20 p-3 bg-black/50 hover:bg-black/80 backdrop-blur-md text-white rounded-full border border-white/25 shadow-2xl transition-all hover:scale-110 cursor-pointer"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        <div
          className="relative max-w-5xl max-h-[75vh] flex items-center justify-center overflow-hidden rounded-2xl cursor-grab active:cursor-grabbing transition-transform duration-100"
          style={{
            transform: `scale(${zoomLevel}) translate(${position.x / zoomLevel}px, ${position.y / zoomLevel}px)`,
          }}
          onMouseDown={(e) => {
            if (zoomLevel > 1) {
              setIsDragging(true);
              setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
            }
          }}
          onMouseMove={(e) => {
            if (isDragging && zoomLevel > 1) {
              setPosition({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y,
              });
            }
          }}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
        >
          <img
            src={activeImage}
            alt={productName}
            className="max-w-[90vw] max-h-[72vh] object-contain rounded-xl shadow-2xl pointer-events-none"
          />
        </div>
      </div>

      {/* Bottom Thumbnail Strip */}
      {images.length > 1 && (
        <div
          className="absolute bottom-4 inset-x-0 flex justify-center z-20 pointer-events-auto px-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-2 p-2 bg-black/60 backdrop-blur-xl rounded-2xl border border-white/15 max-w-full overflow-x-auto scrollbar-none shadow-2xl">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentIndex(idx);
                  handleResetZoom();
                }}
                className={`relative w-12 h-12 rounded-xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                  currentIndex === idx
                    ? 'border-orange-500 scale-105 shadow-md ring-2 ring-orange-500/50'
                    : 'border-white/20 opacity-60 hover:opacity-100'
                }`}
              >
                <img
                  src={img}
                  alt={`Vignette ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
