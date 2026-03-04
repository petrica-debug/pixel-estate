'use client';

import { useState, useMemo } from 'react';

interface PixelGridProps {
  rows?: number;
  cols?: number;
  ownedPixels?: number[];
  highlightPixels?: number[];
  interactive?: boolean;
  onPixelClick?: (index: number) => void;
  size?: 'sm' | 'md' | 'lg';
}

const COLORS = [
  'bg-violet-500', 'bg-fuchsia-500', 'bg-pink-500',
  'bg-cyan-500', 'bg-emerald-500', 'bg-amber-500',
];

export function PixelGrid({
  rows = 20,
  cols = 20,
  ownedPixels = [],
  highlightPixels = [],
  interactive = false,
  onPixelClick,
  size = 'md',
}: PixelGridProps) {
  const [hoveredPixel, setHoveredPixel] = useState<number | null>(null);

  const ownedSet = useMemo(() => new Set(ownedPixels), [ownedPixels]);
  const highlightSet = useMemo(() => new Set(highlightPixels), [highlightPixels]);

  const pixelSize = size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : 'w-4 h-4';
  const gap = size === 'sm' ? 'gap-px' : 'gap-0.5';

  return (
    <div className={`inline-grid ${gap}`} style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
      {Array.from({ length: rows * cols }, (_, i) => {
        const isOwned = ownedSet.has(i);
        const isHighlighted = highlightSet.has(i);
        const isHovered = hoveredPixel === i;
        const colorClass = isOwned
          ? COLORS[i % COLORS.length]
          : isHighlighted
          ? 'bg-violet-500/60'
          : 'bg-white/5';

        return (
          <div
            key={i}
            className={`${pixelSize} rounded-[1px] transition-all duration-150 ${colorClass} ${
              isHovered ? 'scale-150 z-10 ring-1 ring-white/50' : ''
            } ${interactive ? 'cursor-pointer hover:brightness-125' : ''}`}
            onMouseEnter={() => interactive && setHoveredPixel(i)}
            onMouseLeave={() => interactive && setHoveredPixel(null)}
            onClick={() => interactive && onPixelClick?.(i)}
          />
        );
      })}
    </div>
  );
}
