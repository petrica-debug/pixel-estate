import Link from 'next/link';
import { PixelGrid } from './PixelGrid';

interface PropertyCardProps {
  id: number;
  name: string;
  location: string;
  totalPixels: number;
  soldPixels: number;
  pricePerPixel: string;
  annualYield: string;
  imageUrl?: string;
}

export function PropertyCard({
  id,
  name,
  location,
  totalPixels,
  soldPixels,
  pricePerPixel,
  annualYield,
}: PropertyCardProps) {
  const percentSold = Math.round((soldPixels / totalPixels) * 100);

  const ownedPixels = Array.from({ length: soldPixels }, (_, i) => i);

  return (
    <Link href={`/properties/${id}`} className="group block">
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/50 transition-all duration-300 hover:border-violet-500/30 hover:shadow-xl hover:shadow-violet-500/5">
        <div className="relative flex items-center justify-center bg-black/40 p-6">
          <PixelGrid
            rows={15}
            cols={15}
            ownedPixels={ownedPixels}
            size="sm"
          />
          <div className="absolute top-3 right-3 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
            {annualYield} APY
          </div>
        </div>

        <div className="p-5">
          <h3 className="text-base font-semibold text-white group-hover:text-violet-300 transition-colors">
            {name}
          </h3>
          <p className="mt-1 text-xs text-zinc-500">{location}</p>

          <div className="mt-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-500">Price per pixel</p>
              <p className="text-sm font-semibold text-white">{pricePerPixel}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-zinc-500">Sold</p>
              <p className="text-sm font-semibold text-white">{percentSold}%</p>
            </div>
          </div>

          <div className="mt-3">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-500"
                style={{ width: `${percentSold}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
