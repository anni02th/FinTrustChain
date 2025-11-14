import React, { useEffect, useState } from "react";
import { loanRequests, payments } from "../api/api";

export default function Dashboard() {
  const [stats, setStats] = useState({ active: 0, outstanding: 0 });

  useEffect(() => {
    // Minimal sample data; prefer real endpoints for fuller data
    async function load() {
      try {
        const lr = await loanRequests.list({ page: 1, size: 6 });
        setStats((s) => ({ ...s, active: lr.data?.data?.length ?? 0 }));
      } catch (err) {
        // ignore
      }
    }
    load();
  }, []);

  return (
    <div className="container-max py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6 rounded">
          <div className="text-sm text-gray-400">Active loans</div>
          <div className="text-3xl font-bold neon-text">{stats.active}</div>
        </div>

        <div className="card p-6 rounded">
          <div className="text-sm text-gray-400">Outstanding</div>
          <div className="text-3xl font-bold neon-text">${stats.outstanding}</div>
        </div>

        <div className="card p-6 rounded">
          <div className="text-sm text-gray-400">Recent payments</div>
          <div className="text-3xl font-bold neon-text">0</div>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold">Recent applications</h3>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* placeholder items */}
          <div className="card p-4 rounded">No recent data</div>
        </div>
      </div>
    </div>
  );
}
