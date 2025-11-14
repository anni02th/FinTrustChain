import React, { useEffect, useState } from "react";
import { dashboard, users as usersApi, brochures as brochuresApi, loanRequests as loanReqApi } from "../api/api";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";

// Small presentational stat card
function StatCard({ title, value }) {
  return (
    <div className="card p-6 rounded">
      <div className="text-sm text-gray-400">{title}</div>
      <div className="text-3xl font-bold neon-text">{value}</div>
    </div>
  );
}

function ListCard({ title, items, renderItem, emptyText }) {
  return (
    <div className="card p-4 rounded">
      <h3 className="font-semibold">{title}</h3>
      {(!items || items.length === 0) ? (
        <div className="text-gray-400 mt-3">{emptyText || `No ${title.toLowerCase()}`}</div>
      ) : (
        <ul className="mt-3 space-y-2">{items.map(renderItem)}</ul>
      )}
    </div>
  );
}

export default function Dashboard() {
  const { user, refreshUser } = useAuth();
  const [stats, setStats] = useState(null);
  const [contracts, setContracts] = useState([]);
  const [endorsers, setEndorsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [myBrochures, setMyBrochures] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const res = await dashboard.myStats();
        if (!mounted) return;
        setStats(res.data?.data?.stats || null);

        const contractsRes = await dashboard.myActiveContracts();
        if (!mounted) return;
        setContracts(contractsRes.data?.data?.contracts || []);

        const endorsersRes = await dashboard.myEndorsers();
        if (!mounted) return;
        setEndorsers(endorsersRes.data?.data?.endorsers || []);

        // lender-specific data
        if (user?.currentRole === "LENDER") {
          try {
            const bres = await brochuresApi.list();
            const list = bres?.data?.data?.brochures || bres?.data || [];
            const mine = list.filter((b) => (b.lender === (user?._id || user?.id)) || (b.lender?._id === (user?._id || user?.id)));
            if (!mounted) return;
            setMyBrochures(mine);

            // fetch lender incoming requests
            try {
              const reqs = await loanReqApi.listForLender();
              if (!mounted) return;
              setIncomingRequests(reqs?.data?.data?.requests || reqs?.data || []);
            } catch (er) {
              // ignore
            }
          } catch (err) {
            // ignore
          }
        }
      } catch (err) {
        // ignore
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => (mounted = false);
  }, [user]);

  const handleToggle = async () => {
    setToggling(true);
    try {
      await usersApi.toggleRole();
      await refreshUser();
      const res = await dashboard.myStats();
      setStats(res.data?.data?.stats || null);
    } catch (err) {
      // ignore
    } finally {
      setToggling(false);
    }
  };

  // Shared top stats
  const statsList = [
    { title: "Trust Index", value: stats?.trustIndex ?? "—" },
    { title: "Eligible Loan", value: stats?.eligibleLoan ?? "—" },
    { title: "Endorsements", value: stats?.endorsementsReceived ?? 0 },
  ];

  return (
    <div className="container-max py-36 min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold neon-text">Dashboard</h1>
        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-300">Role: <span className="font-medium ml-2">{user?.currentRole || user?.role || 'RECEIVER'}</span></div>
          <button className="btn-neon p-2 rounded" onClick={handleToggle} disabled={toggling}>{toggling? 'Switching...' : 'Toggle Role'}</button>
        </div>
      </div>

      {loading ? <div className="mt-8"><Loader /></div> : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {statsList.map((s) => (
              <StatCard key={s.title} title={s.title} value={s.value} />
            ))}
          </div>

          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <ListCard
              title="Active Contracts"
              items={contracts}
              emptyText="No active contracts"
              renderItem={(c) => (
                <li key={c._id || c.id} className="p-2 border border-white/6 rounded">
                  <div className="font-medium">Contract: {c.contractId || c._id}</div>
                  <div className="text-sm text-gray-300">Status: {c.status}</div>
                </li>
              )}
            />

            <ListCard
              title="Endorsers"
              items={endorsers}
              emptyText="No endorsers yet"
              renderItem={(e) => (
                <li key={e._id || e.id} className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/6 rounded-full" />
                  <div>
                    <div className="font-medium">{e.name}</div>
                    <div className="text-xs text-gray-300">TI: {e.trustIndex}</div>
                  </div>
                </li>
              )}
            />
          </div>

          {/* Role specific panels */}
          {user?.currentRole === 'LENDER' ? (
            <div className="mt-8">
              <h2 className="font-semibold neon-text">Lender Overview</h2>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="card p-4 rounded">Your Brochures: <div className="text-2xl font-bold neon-text">{myBrochures.length}</div></div>
                <div className="card p-4 rounded">Open Offers: <div className="text-2xl font-bold neon-text">{myBrochures.filter(b=>b.active).length}</div></div>
                <div className="card p-4 rounded">Incoming Requests: <div className="text-2xl font-bold neon-text">{incomingRequests.length}</div></div>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold">Incoming Loan Requests</h3>
                <ListCard
                  title="Requests"
                  items={incomingRequests}
                  emptyText="No incoming requests"
                  renderItem={(r) => (
                    <li key={r._id || r.id} className="p-2 border border-white/6 rounded flex justify-between items-center">
                      <div>
                        <div className="font-medium">Request by: {r.borrower?.name || r.borrowerName || r.borrowerEmail}</div>
                        <div className="text-xs text-gray-300">Amount: {r.amount || r.requestAmount}</div>
                      </div>
                      <div className="flex gap-2">
                        <button className="btn-neon p-2 rounded">View</button>
                        <button className="p-2 rounded border border-white/10">Ignore</button>
                      </div>
                    </li>
                  )}
                />
              </div>
            </div>
          ) : (
            <div className="mt-8">
              <h2 className="font-semibold neon-text">Receiver Overview</h2>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="card p-4 rounded">Active Loans: <div className="text-2xl font-bold neon-text">{contracts.length}</div></div>
                <div className="card p-4 rounded">Endorsements: <div className="text-2xl font-bold neon-text">{endorsers.length}</div></div>
                <div className="card p-4 rounded">Eligible Loan: <div className="text-2xl font-bold neon-text">{stats?.eligibleLoan ?? '—'}</div></div>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold">Recent Activity</h3>
                <ListCard
                  title="Recent Contracts"
                  items={contracts.slice(0,5)}
                  emptyText="No recent activity"
                  renderItem={(c) => (
                    <li key={c._id || c.id} className="p-2 border border-white/6 rounded">
                      <div className="font-medium">{c.contractId || c._id}</div>
                      <div className="text-xs text-gray-300">Status: {c.status}</div>
                    </li>
                  )}
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
