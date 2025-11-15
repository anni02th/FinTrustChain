import React, { useEffect, useState } from "react";
import { loanRequests, brochures } from "../api/api";
import toast from "react-hot-toast";

export default function LoanRequestForm() {
  const [available, setAvailable] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await brochures.list();
        // Normalize different possible response shapes to an array
        const data = res?.data;
        const arr = data?.data?.brochures || data?.brochures || data?.data || data || [];
        setAvailable(Array.isArray(arr) ? arr : []);
      } catch (err) {
        setAvailable([]);
      }
    }
    load();
  }, []);

  const toggle = (id) => {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  };

  // Extra UI fields (optional)
  const [purpose, setPurpose] = useState("");
  const [phone, setPhone] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (selected.length === 0) {
      toast.error("Select at least one brochure (1-3).");
      return;
    }
    if (selected.length > 3) {
      toast.error("You can select up to 3 brochures only.");
      return;
    }

    // basic validation for optional fields
    if (phone && !/^\+?[0-9\-\s]{6,20}$/.test(phone)) {
      toast.error("Please enter a valid phone number.");
      return;
    }

    setLoading(true);
    try {
      // server expects only brochureIds. We include optional fields locally for UX.
      await loanRequests.create({ brochureIds: selected });
      toast.success("Loan request submitted");
      setSelected([]);
      setPurpose("");
      setPhone("");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create loan request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-max py-36 h-screen">
      <div className="max-w-lg mx-auto card p-6 rounded">
        <h2 className="text-2xl neon-text font-semibold">Create Loan Request</h2>

        <form onSubmit={submit} className="mt-4 flex flex-col gap-3">
          <div className="text-sm text-gray-300">Select brochures (1–3)</div>
          <div className="grid gap-2 mt-2">
            {available.length === 0 && <div className="text-gray-400">No brochures available</div>}
            {available.map((b) => {
              const id = b._id || b.id;
              return (
                <label key={id} className="flex items-center gap-3 p-2 border rounded cursor-pointer">
                  <input type="checkbox" checked={selected.includes(id)} onChange={() => toggle(id)} />
                  <div>
                    <div className="font-medium">₹{b.amount.toLocaleString?.() ?? b.amount} • {b.tenorDays} days</div>
                    <div className="text-sm text-gray-300">Lender: {b.lender?.name || "—"} · {b.interestRate}%</div>
                  </div>
                </label>
              );
            })}
          </div>
          <div className="mt-4 grid grid-cols-1 gap-3">
            <label className="text-sm text-gray-300">Purpose (optional)</label>
            <textarea value={purpose} onChange={(e)=>setPurpose(e.target.value)} rows={3} className="p-3 rounded bg-transparent border border-white/6" />

            <label className="text-sm text-gray-300">Phone (optional)</label>
            <input value={phone} onChange={(e)=>setPhone(e.target.value)} placeholder="+91-XXXXXXXXXX" className="p-3 rounded bg-transparent border border-white/6" />

            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-400">Selected: {selected.length}</div>
              <button disabled={loading} className="btn-neon p-3 rounded">{loading?"Submitting...":"Submit request"}</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
