import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main className="main-content container-max py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-4xl md:text-6xl font-extrabold neon-text">FinTrustChain</h1>
          <p className="mt-4 text-gray-300 max-w-xl">
            A modern loan management platform with blockchain-backed contracts and a trust index.
            Borrow, lend and guarantee with clarity and on-chain verifiability.
          </p>

          <div className="mt-8 flex gap-3">
            <Link to="/create-loan" className="btn-neon px-5 py-3 rounded font-semibold">
              Create Loan Request
            </Link>

            <Link to="/brochures" className="px-5 py-3 rounded border border-white/6 text-white">
              Browse Brochures
            </Link>
          </div>
        </div>

        <div className="card p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Quick Stats</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 card rounded">
              <div className="text-sm text-gray-400">Active Loans</div>
              <div className="text-2xl font-bold neon-text">12</div>
            </div>
            <div className="p-4 card rounded">
              <div className="text-sm text-gray-400">Outstanding</div>
              <div className="text-2xl font-bold neon-text">$124,300</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
