import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { PropertyCard } from '@/components/PropertyCard';

const FEATURED_PROPERTIES = [
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
];

const STATS = [
  { label: 'Total Value Locked', value: '$12.4M' },
  { label: 'Properties Listed', value: '24' },
  { label: 'Pixel Holders', value: '3,847' },
  { label: 'Avg. Annual Yield', value: '8.3%' },
];

const FEATURES = [
  {
    title: 'Fractional Ownership',
    description: 'Own a piece of premium Dubai real estate starting from just $25. Each pixel represents a fraction of the property.',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
  },
  {
    title: 'Rental Income',
    description: 'Earn passive income from rental yields distributed automatically to your wallet every month via smart contracts.',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
      </svg>
    ),
  },
  {
    title: 'On-Chain Governance',
    description: 'Vote on property decisions proportional to your pixel holdings. Full transparency through blockchain governance.',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
  {
    title: 'Secondary Market',
    description: 'Trade your pixel shares anytime on our built-in marketplace. Full liquidity for your real estate investments.',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
      </svg>
    ),
  },
  {
    title: 'KYC Verified',
    description: 'All investors are KYC-verified ensuring regulatory compliance and a trusted investment environment.',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" />
      </svg>
    ),
  },
  {
    title: 'Polygon Network',
    description: 'Built on Polygon for fast, low-cost transactions. ERC-1155 NFTs represent your property pixel shares.',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-2.25-1.313M21 7.5v2.25m0-2.25l-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3l2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75l2.25-1.313M12 21.75V19.5m0 2.25l-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25" />
      </svg>
    ),
  },
];

const STEPS = [
  { step: '01', title: 'Connect Wallet', description: 'Connect your MetaMask or WalletConnect-compatible wallet to get started.' },
  { step: '02', title: 'Complete KYC', description: 'Verify your identity through our streamlined KYC process for regulatory compliance.' },
  { step: '03', title: 'Browse Properties', description: 'Explore premium Dubai properties and view their pixel grids, yields, and details.' },
  { step: '04', title: 'Buy Pixels', description: 'Purchase pixel shares with USDC. Each pixel is an ERC-1155 NFT on Polygon.' },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-violet-600/20 blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 h-[300px] w-[400px] rounded-full bg-fuchsia-600/15 blur-[100px]" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 mb-6">
                <div className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse" />
                <span className="text-xs font-medium text-violet-300">Live on Polygon Amoy Testnet</span>
              </div>

              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Own Dubai Real Estate,{' '}
                <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
                  One Pixel at a Time
                </span>
              </h1>

              <p className="mt-6 max-w-lg text-lg leading-8 text-zinc-400">
                Fractional property ownership through NFT pixel shares. Invest in premium Dubai real estate starting from $25, earn rental yields, and trade on our marketplace.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/properties"
                  className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:shadow-violet-500/40 hover:scale-[1.02]"
                >
                  Explore Properties
                  <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
                <Link
                  href="#how-it-works"
                  className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-7 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
                >
                  How It Works
                </Link>
              </div>
            </div>

            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 blur-2xl" />
              <div className="relative rounded-2xl border border-white/10 bg-zinc-900/80 p-8 backdrop-blur-sm">
                <HeroPixelGrid />
                <div className="mt-4 flex items-center justify-between text-xs text-zinc-500">
                  <span>Marina Bay Tower</span>
                  <span>72% sold</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-white/5 bg-zinc-950/50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-bold text-white sm:text-3xl">{stat.value}</p>
                <p className="mt-1 text-xs text-zinc-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Featured Properties
            </h2>
            <p className="mt-3 text-base text-zinc-400">
              Premium Dubai real estate available for fractional ownership
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURED_PROPERTIES.map((property) => (
              <PropertyCard key={property.id} {...property} />
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 text-sm font-medium text-violet-400 transition-colors hover:text-violet-300"
            >
              View all properties
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-white/5 bg-zinc-950/50 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Why PixelEstate?
            </h2>
            <p className="mt-3 text-base text-zinc-400">
              The future of real estate investment is on-chain
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-2xl border border-white/5 bg-zinc-900/30 p-6 transition-all hover:border-violet-500/20 hover:bg-zinc-900/60"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400 transition-colors group-hover:bg-violet-500/20">
                  {feature.icon}
                </div>
                <h3 className="mt-4 text-base font-semibold text-white">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-3 text-base text-zinc-400">
              Start investing in Dubai real estate in four simple steps
            </p>
          </div>

          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((item) => (
              <div key={item.step} className="relative">
                <div className="text-5xl font-black text-white/5">{item.step}</div>
                <h3 className="mt-2 text-base font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-500">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/5">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 to-fuchsia-600 px-8 py-16 text-center sm:px-16">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_40%_at_50%_60%,rgba(255,255,255,0.12),transparent)]" />
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to Own Dubai Real Estate?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base text-white/80">
              Join thousands of investors earning passive rental income through fractional property ownership on the blockchain.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/properties"
                className="inline-flex items-center justify-center rounded-full bg-white px-7 py-3 text-sm font-semibold text-violet-700 shadow-lg transition-all hover:bg-white/90 hover:scale-[1.02]"
              >
                Start Investing
              </Link>
              <Link
                href="#"
                className="inline-flex items-center justify-center rounded-full border border-white/30 px-7 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
              >
                Read Whitepaper
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function HeroPixelGrid() {
  const rows = 20;
  const cols = 25;
  const total = rows * cols;

  const owned = Array.from({ length: Math.floor(total * 0.72) }, (_, i) => i);

  const colors = [
    'bg-violet-500', 'bg-violet-600', 'bg-fuchsia-500', 'bg-fuchsia-600',
    'bg-purple-500', 'bg-pink-500', 'bg-indigo-500',
  ];

  return (
    <div className="inline-grid gap-[2px]" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
      {Array.from({ length: total }, (_, i) => {
        const isOwned = i < owned.length;
        const color = isOwned ? colors[i % colors.length] : 'bg-white/[0.03]';
        return (
          <div
            key={i}
            className={`h-2.5 w-2.5 rounded-[1px] ${color} ${isOwned ? 'opacity-80' : ''}`}
          />
        );
      })}
    </div>
  );
}
