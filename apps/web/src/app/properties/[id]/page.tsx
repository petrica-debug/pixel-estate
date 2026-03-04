'use client';

import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { PixelGrid } from '@/components/PixelGrid';
import { useState, use } from 'react';
import Link from 'next/link';

const MOCK_PROPERTIES: Record<string, {
  name: string;
  location: string;
  description: string;
  totalPixels: number;
  soldPixels: number;
  pricePerPixel: number;
  annualYield: string;
  propertyValue: string;
  rentalIncome: string;
  propertyType: string;
  area: string;
}> = {
  '1': {
    name: 'Marina Bay Tower',
    location: 'Dubai Marina, UAE',
    description: 'A stunning 45-floor residential tower in the heart of Dubai Marina with panoramic sea views. Features luxury amenities including infinity pool, private beach access, and 24/7 concierge service.',
    totalPixels: 10000,
    soldPixels: 7234,
    pricePerPixel: 25,
    annualYield: '8.2%',
    propertyValue: '$2,500,000',
    rentalIncome: '$17,083/mo',
    propertyType: 'Residential Tower',
    area: '4,200 sq ft',
  },
  '2': {
    name: 'Palm Residences',
    location: 'Palm Jumeirah, UAE',
    description: 'Exclusive beachfront villa on the iconic Palm Jumeirah. Private pool, direct beach access, and breathtaking views of the Arabian Gulf and Dubai skyline.',
    totalPixels: 10000,
    soldPixels: 4521,
    pricePerPixel: 42,
    annualYield: '9.5%',
    propertyValue: '$4,200,000',
    rentalIncome: '$33,250/mo',
    propertyType: 'Beachfront Villa',
    area: '6,800 sq ft',
  },
  '3': {
    name: 'Downtown Loft',
    location: 'Downtown Dubai, UAE',
    description: 'Modern loft apartment with views of the Burj Khalifa and Dubai Fountain. Walking distance to Dubai Mall and the DIFC financial district.',
    totalPixels: 10000,
    soldPixels: 8901,
    pricePerPixel: 18,
    annualYield: '7.1%',
    propertyValue: '$1,800,000',
    rentalIncome: '$10,650/mo',
    propertyType: 'Luxury Apartment',
    area: '2,100 sq ft',
  },
};

export default function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const property = MOCK_PROPERTIES[id];
  const [selectedPixels, setSelectedPixels] = useState<number[]>([]);

  if (!property) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <div className="flex items-center justify-center pt-40">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Property Not Found</h1>
            <p className="mt-2 text-zinc-400">This property does not exist.</p>
            <Link href="/properties" className="mt-4 inline-block text-violet-400 hover:text-violet-300">
              Back to Properties
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const percentSold = Math.round((property.soldPixels / property.totalPixels) * 100);
  const ownedPixels = Array.from({ length: property.soldPixels }, (_, i) => i);
  const totalCost = selectedPixels.length * property.pricePerPixel;

  const handlePixelClick = (index: number) => {
    if (ownedPixels.includes(index)) return;
    setSelectedPixels((prev) =>
      prev.includes(index) ? prev.filter((p) => p !== index) : [...prev, index]
    );
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <section className="pt-24 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link href="/properties" className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-white mb-6">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to Properties
          </Link>

          <div className="grid gap-10 lg:grid-cols-5">
            {/* Pixel Grid */}
            <div className="lg:col-span-3">
              <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-medium text-zinc-400">Pixel Grid</h2>
                  <div className="flex items-center gap-4 text-xs text-zinc-500">
                    <span className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-sm bg-violet-500" /> Owned
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500" /> Selected
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-sm bg-white/5 border border-white/10" /> Available
                    </span>
                  </div>
                </div>
                <div className="flex justify-center overflow-auto">
                  <PixelGrid
                    rows={100}
                    cols={100}
                    ownedPixels={ownedPixels}
                    highlightPixels={selectedPixels}
                    interactive
                    onPixelClick={handlePixelClick}
                    size="sm"
                  />
                </div>
              </div>
            </div>

            {/* Property Info */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 mb-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-medium text-emerald-300">Active</span>
                </div>
                <h1 className="text-2xl font-bold">{property.name}</h1>
                <p className="mt-1 text-sm text-zinc-400">{property.location}</p>
              </div>

              <p className="text-sm leading-6 text-zinc-400">{property.description}</p>

              <div className="grid grid-cols-2 gap-3">
                <InfoCard label="Property Value" value={property.propertyValue} />
                <InfoCard label="Monthly Rental" value={property.rentalIncome} />
                <InfoCard label="Annual Yield" value={property.annualYield} highlight />
                <InfoCard label="Price per Pixel" value={`${property.pricePerPixel} USDC`} />
                <InfoCard label="Property Type" value={property.propertyType} />
                <InfoCard label="Total Area" value={property.area} />
              </div>

              {/* Progress */}
              <div className="rounded-xl border border-white/10 bg-zinc-900/50 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-400">Pixels Sold</span>
                  <span className="font-semibold text-white">{property.soldPixels.toLocaleString()} / {property.totalPixels.toLocaleString()}</span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
                    style={{ width: `${percentSold}%` }}
                  />
                </div>
                <p className="mt-1 text-right text-xs text-zinc-500">{percentSold}% sold</p>
              </div>

              {/* Purchase */}
              <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4">
                <h3 className="text-sm font-semibold text-white">Purchase Pixels</h3>
                {selectedPixels.length > 0 ? (
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-zinc-400">Selected Pixels</span>
                      <span className="font-medium text-white">{selectedPixels.length}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-zinc-400">Total Cost</span>
                      <span className="font-semibold text-white">{totalCost} USDC</span>
                    </div>
                    <button className="mt-2 w-full rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:shadow-violet-500/40">
                      Buy {selectedPixels.length} Pixels
                    </button>
                    <button
                      onClick={() => setSelectedPixels([])}
                      className="w-full rounded-full border border-white/10 py-2 text-xs text-zinc-400 hover:text-white"
                    >
                      Clear Selection
                    </button>
                  </div>
                ) : (
                  <p className="mt-2 text-xs text-zinc-500">
                    Click on available pixels in the grid to select them for purchase.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function InfoCard({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="rounded-xl border border-white/5 bg-zinc-900/30 p-3">
      <p className="text-xs text-zinc-500">{label}</p>
      <p className={`mt-0.5 text-sm font-semibold ${highlight ? 'text-emerald-400' : 'text-white'}`}>
        {value}
      </p>
    </div>
  );
}
