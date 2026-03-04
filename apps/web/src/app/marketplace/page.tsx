import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const MOCK_LISTINGS = [
  { id: 1, property: 'Marina Bay Tower', seller: '0x1a2b...3c4d', pixels: 50, pricePerPixel: 28, totalPrice: 1400 },
  { id: 2, property: 'Palm Residences', seller: '0x5e6f...7g8h', pixels: 120, pricePerPixel: 45, totalPrice: 5400 },
  { id: 3, property: 'Downtown Loft', seller: '0x9i0j...1k2l', pixels: 30, pricePerPixel: 20, totalPrice: 600 },
  { id: 4, property: 'Marina Bay Tower', seller: '0x3m4n...5o6p', pixels: 200, pricePerPixel: 27, totalPrice: 5400 },
  { id: 5, property: 'Palm Residences', seller: '0x7q8r...9s0t', pixels: 75, pricePerPixel: 44, totalPrice: 3300 },
  { id: 6, property: 'Downtown Loft', seller: '0xu1v2...w3x4', pixels: 15, pricePerPixel: 21, totalPrice: 315 },
];

export default function MarketplacePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <section className="pt-28 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Marketplace</h1>
              <p className="mt-2 text-base text-zinc-400">
                Buy and sell pixel shares on the secondary market
              </p>
            </div>

            <button className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25">
              + List Pixels for Sale
            </button>
          </div>

          {/* Filters */}
          <div className="mt-8 flex flex-wrap gap-2">
            <select className="rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-white outline-none focus:border-violet-500">
              <option>All Properties</option>
              <option>Marina Bay Tower</option>
              <option>Palm Residences</option>
              <option>Downtown Loft</option>
            </select>
            <select className="rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-white outline-none focus:border-violet-500">
              <option>Sort: Newest</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Pixels: Most</option>
            </select>
          </div>

          {/* Listings Table */}
          <div className="mt-8 overflow-hidden rounded-2xl border border-white/10">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5 bg-zinc-900/50">
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">Property</th>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">Seller</th>
                  <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wider text-zinc-500">Pixels</th>
                  <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wider text-zinc-500">Price/Pixel</th>
                  <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wider text-zinc-500">Total</th>
                  <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wider text-zinc-500">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {MOCK_LISTINGS.map((listing) => (
                  <tr key={listing.id} className="transition-colors hover:bg-white/[0.02]">
                    <td className="px-5 py-4 text-sm font-medium text-white">{listing.property}</td>
                    <td className="px-5 py-4 text-sm font-mono text-zinc-400">{listing.seller}</td>
                    <td className="px-5 py-4 text-right text-sm text-white">{listing.pixels}</td>
                    <td className="px-5 py-4 text-right text-sm text-white">{listing.pricePerPixel} USDC</td>
                    <td className="px-5 py-4 text-right text-sm font-semibold text-white">{listing.totalPrice.toLocaleString()} USDC</td>
                    <td className="px-5 py-4 text-right">
                      <button className="rounded-full bg-violet-500/10 px-4 py-1.5 text-xs font-semibold text-violet-400 transition-colors hover:bg-violet-500/20">
                        Buy
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
