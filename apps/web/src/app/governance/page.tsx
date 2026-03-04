'use client';

import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useAccount } from 'wagmi';

const MOCK_PROPOSALS = [
  {
    id: 1,
    property: 'Marina Bay Tower',
    title: 'Approve sale at $3.2M to Al Habtoor Group',
    status: 'active',
    votesFor: 4200,
    votesAgainst: 1800,
    totalVotes: 7234,
    deadline: '2026-03-15',
  },
  {
    id: 2,
    property: 'Downtown Loft',
    title: 'Increase monthly maintenance budget by 5%',
    status: 'active',
    votesFor: 5600,
    votesAgainst: 2100,
    totalVotes: 8901,
    deadline: '2026-03-20',
  },
  {
    id: 3,
    property: 'Palm Residences',
    title: 'Approve renovation of lobby and pool area',
    status: 'passed',
    votesFor: 3800,
    votesAgainst: 500,
    totalVotes: 4521,
    deadline: '2026-02-28',
  },
];

export default function GovernancePage() {
  const { isConnected } = useAccount();

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <section className="pt-28 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Governance</h1>
          <p className="mt-2 text-base text-zinc-400">
            Vote on property decisions proportional to your pixel holdings
          </p>

          <div className="mt-10 space-y-4">
            {MOCK_PROPOSALS.map((proposal) => {
              const forPercent = Math.round((proposal.votesFor / proposal.totalVotes) * 100);
              const againstPercent = Math.round((proposal.votesAgainst / proposal.totalVotes) * 100);
              const quorumPercent = Math.round(((proposal.votesFor + proposal.votesAgainst) / proposal.totalVotes) * 100);

              return (
                <div key={proposal.id} className="rounded-2xl border border-white/10 bg-zinc-900/30 p-6 transition-all hover:border-white/20">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-zinc-500">{proposal.property}</span>
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                          proposal.status === 'active'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'bg-zinc-500/10 text-zinc-400'
                        }`}>
                          {proposal.status === 'active' ? 'Active' : 'Passed'}
                        </span>
                      </div>
                      <h3 className="text-base font-semibold text-white">{proposal.title}</h3>
                      <p className="mt-1 text-xs text-zinc-500">Deadline: {proposal.deadline}</p>
                    </div>

                    {proposal.status === 'active' && isConnected && (
                      <div className="flex gap-2">
                        <button className="rounded-full bg-emerald-500/10 px-4 py-2 text-xs font-semibold text-emerald-400 transition-colors hover:bg-emerald-500/20">
                          Vote For
                        </button>
                        <button className="rounded-full bg-red-500/10 px-4 py-2 text-xs font-semibold text-red-400 transition-colors hover:bg-red-500/20">
                          Vote Against
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-emerald-400">For: {forPercent}%</span>
                      <span className="text-red-400">Against: {againstPercent}%</span>
                    </div>
                    <div className="flex h-2 w-full overflow-hidden rounded-full bg-white/5">
                      <div className="h-full bg-emerald-500" style={{ width: `${forPercent}%` }} />
                      <div className="h-full bg-red-500" style={{ width: `${againstPercent}%` }} />
                    </div>
                    <p className="text-xs text-zinc-500">Quorum: {quorumPercent}% participation</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
