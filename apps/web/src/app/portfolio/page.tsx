'use client';

import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { PixelGrid } from '@/components/PixelGrid';
import { useAccount } from 'wagmi';
import Link from 'next/link';

export default function PortfolioPage() {
  const { isConnected } = useAccount();

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <section className="pt-28 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Portfolio</h1>
          <p className="mt-2 text-base text-zinc-400">
            Your pixel holdings and rental income
          </p>

          {!isConnected ? (
            <div className="mt-16 flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-zinc-900/30 py-20">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/10">
                <svg className="h-8 w-8 text-violet-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
                </svg>
              </div>
              <h2 className="mt-4 text-lg font-semibold">Connect Your Wallet</h2>
              <p className="mt-2 max-w-sm text-center text-sm text-zinc-500">
                Connect your wallet to view your pixel holdings, rental income, and governance participation.
              </p>
            </div>
          ) : (
            <div className="mt-10 space-y-8">
              {/* Summary Cards */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <SummaryCard label="Total Pixels Owned" value="0" />
                <SummaryCard label="Portfolio Value" value="$0.00" />
                <SummaryCard label="Total Rental Earned" value="$0.00" />
                <SummaryCard label="Properties Invested" value="0" />
              </div>

              {/* Holdings */}
              <div className="rounded-2xl border border-white/10 bg-zinc-900/30 p-6">
                <h2 className="text-lg font-semibold">Your Holdings</h2>
                <div className="mt-8 flex flex-col items-center py-10">
                  <p className="text-sm text-zinc-500">No pixel holdings yet.</p>
                  <Link
                    href="/properties"
                    className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-2 text-sm font-semibold text-white"
                  >
                    Browse Properties
                  </Link>
                </div>
              </div>

              {/* Rental History */}
              <div className="rounded-2xl border border-white/10 bg-zinc-900/30 p-6">
                <h2 className="text-lg font-semibold">Rental Income History</h2>
                <div className="mt-8 flex flex-col items-center py-10">
                  <p className="text-sm text-zinc-500">No rental income received yet.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-zinc-900/50 p-4">
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="mt-1 text-xl font-bold text-white">{value}</p>
    </div>
  );
}
