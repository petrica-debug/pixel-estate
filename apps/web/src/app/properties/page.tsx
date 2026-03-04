import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { PropertyCard } from '@/components/PropertyCard';

const ALL_PROPERTIES = [
  {
    id: 1,
    name: 'Marina Bay Tower',
    location: 'Dubai Marina, UAE',
    totalPixels: 10000,
    soldPixels: 7234,
    pricePerPixel: '25 USDC',
    annualYield: '8.2%',
  },
  {
    id: 2,
    name: 'Palm Residences',
    location: 'Palm Jumeirah, UAE',
    totalPixels: 10000,
    soldPixels: 4521,
    pricePerPixel: '42 USDC',
    annualYield: '9.5%',
  },
  {
    id: 3,
    name: 'Downtown Loft',
    location: 'Downtown Dubai, UAE',
    totalPixels: 10000,
    soldPixels: 8901,
    pricePerPixel: '18 USDC',
    annualYield: '7.1%',
  },
  {
    id: 4,
    name: 'Business Bay Suite',
    location: 'Business Bay, UAE',
    totalPixels: 10000,
    soldPixels: 2100,
    pricePerPixel: '30 USDC',
    annualYield: '7.8%',
  },
  {
    id: 5,
    name: 'JBR Beachfront Villa',
    location: 'Jumeirah Beach Residence, UAE',
    totalPixels: 10000,
    soldPixels: 6200,
    pricePerPixel: '55 USDC',
    annualYield: '10.2%',
  },
  {
    id: 6,
    name: 'Creek Harbour Penthouse',
    location: 'Dubai Creek Harbour, UAE',
    totalPixels: 10000,
    soldPixels: 3400,
    pricePerPixel: '38 USDC',
    annualYield: '8.9%',
  },
];

export default function PropertiesPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <section className="pt-28 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Properties</h1>
              <p className="mt-2 text-base text-zinc-400">
                Browse and invest in premium Dubai real estate
              </p>
            </div>

            <div className="flex gap-2">
              <select className="rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-white outline-none focus:border-violet-500">
                <option>All Locations</option>
                <option>Dubai Marina</option>
                <option>Palm Jumeirah</option>
                <option>Downtown Dubai</option>
                <option>Business Bay</option>
              </select>
              <select className="rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-white outline-none focus:border-violet-500">
                <option>Sort: Newest</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Yield: Highest</option>
              </select>
            </div>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {ALL_PROPERTIES.map((property) => (
              <PropertyCard key={property.id} {...property} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
