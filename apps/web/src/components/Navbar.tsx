'use client';

import Link from 'next/link';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useState } from 'react';

export function Navbar() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const [mobileOpen, setMobileOpen] = useState(false);

  const shortAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : '';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500">
            <span className="text-sm font-bold text-white">PE</span>
          </div>
          <span className="text-lg font-bold text-white">
            Pixel<span className="text-violet-400">Estate</span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <Link href="/properties" className="text-sm text-zinc-400 transition-colors hover:text-white">
            Properties
          </Link>
          <Link href="/marketplace" className="text-sm text-zinc-400 transition-colors hover:text-white">
            Marketplace
          </Link>
          <Link href="/portfolio" className="text-sm text-zinc-400 transition-colors hover:text-white">
            Portfolio
          </Link>
          <Link href="/governance" className="text-sm text-zinc-400 transition-colors hover:text-white">
            Governance
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {isConnected ? (
            <button
              onClick={() => disconnect()}
              className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/20"
            >
              {shortAddress}
            </button>
          ) : (
            <button
              onClick={() => connect({ connector: connectors[0] })}
              className="rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:shadow-violet-500/40"
            >
              Connect Wallet
            </button>
          )}

          <button
            className="md:hidden text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-white/10 bg-black/95 md:hidden">
          <div className="flex flex-col gap-1 px-4 py-3">
            <Link href="/properties" className="rounded-lg px-3 py-2 text-sm text-zinc-400 hover:bg-white/5 hover:text-white" onClick={() => setMobileOpen(false)}>Properties</Link>
            <Link href="/marketplace" className="rounded-lg px-3 py-2 text-sm text-zinc-400 hover:bg-white/5 hover:text-white" onClick={() => setMobileOpen(false)}>Marketplace</Link>
            <Link href="/portfolio" className="rounded-lg px-3 py-2 text-sm text-zinc-400 hover:bg-white/5 hover:text-white" onClick={() => setMobileOpen(false)}>Portfolio</Link>
            <Link href="/governance" className="rounded-lg px-3 py-2 text-sm text-zinc-400 hover:bg-white/5 hover:text-white" onClick={() => setMobileOpen(false)}>Governance</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
