'use client';

import React, { useEffect, useRef, useState } from 'react';

export interface PixelData {
  index: number;
  state: 'AVAILABLE' | 'OWNED_BY_OTHERS' | 'OWNED_BY_ME';
  owner?: string;
  price?: number;
}

interface PixelGridProps {
  imageUrl: string;
  gridSize: number; // e.g., 100 for 100x100 = 10,000 pixels
  pixels: PixelData[];
  onPixelSelect?: (selectedIndexes: number[]) => void;
}

export const PixelGrid: React.FC<PixelGridProps> = ({
  imageUrl,
  gridSize,
  pixels,
  onPixelSelect,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedIndexes, setSelectedIndexes] = useState<Set<number>>(new Set());
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      // Draw background image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const pixelWidth = canvas.width / gridSize;
      const pixelHeight = canvas.height / gridSize;

      // Draw grid overlay
      pixels.forEach((pixel) => {
        const x = (pixel.index % gridSize) * pixelWidth;
        const y = Math.floor(pixel.index / gridSize) * pixelHeight;

        ctx.beginPath();
        ctx.rect(x, y, pixelWidth, pixelHeight);

        if (selectedIndexes.has(pixel.index)) {
          ctx.fillStyle = 'rgba(255, 215, 0, 0.6)'; // Gold for selected
        } else if (pixel.state === 'OWNED_BY_ME') {
          ctx.fillStyle = 'rgba(0, 255, 0, 0.4)'; // Green for owned by me
        } else if (pixel.state === 'OWNED_BY_OTHERS') {
          ctx.fillStyle = 'rgba(255, 0, 0, 0.4)'; // Red for owned by others
        } else {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'; // Semi-transparent for available
        }

        if (hoveredIndex === pixel.index) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'; // Highlight on hover
        }

        ctx.fill();
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.stroke();
      });
    };
  }, [imageUrl, gridSize, pixels, selectedIndexes, hoveredIndex]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const pixelWidth = canvas.width / gridSize;
    const pixelHeight = canvas.height / gridSize;

    const col = Math.floor(x / pixelWidth);
    const row = Math.floor(y / pixelHeight);
    const index = row * gridSize + col;

    if (index >= 0 && index < gridSize * gridSize) {
      setHoveredIndex(index);
    } else {
      setHoveredIndex(null);
    }
  };

  const handleClick = () => {
    if (hoveredIndex !== null) {
      const pixel = pixels.find((p) => p.index === hoveredIndex);
      if (pixel && pixel.state === 'AVAILABLE') {
        const newSelected = new Set(selectedIndexes);
        if (newSelected.has(hoveredIndex)) {
          newSelected.delete(hoveredIndex);
        } else {
          newSelected.add(hoveredIndex);
        }
        setSelectedIndexes(newSelected);
        if (onPixelSelect) {
          onPixelSelect(Array.from(newSelected));
        }
      }
    }
  };

  return (
    <div className="relative w-full max-w-4xl aspect-square">
      <canvas
        ref={canvasRef}
        width={800}
        height={800}
        className="w-full h-full cursor-pointer rounded-lg shadow-lg"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoveredIndex(null)}
        onClick={handleClick}
      />
      {hoveredIndex !== null && (
        <div className="absolute top-4 left-4 bg-black/80 text-white p-2 rounded text-sm pointer-events-none">
          Pixel #{hoveredIndex}
          {pixels[hoveredIndex]?.price && ` - $${pixels[hoveredIndex].price}`}
        </div>
      )}
    </div>
  );
};
