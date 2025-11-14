import React, { useState } from "react";
import { loanRequests } from "../api/api";
import toast from "react-hot-toast";

export default function LoanRequestForm() {
  const [form, setForm] = useState({ amount: "", termMonths: 12, interestRate: 12.0, purpose: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await loanRequests.create(form);
      toast.success("Loan request submitted");
      setForm({ amount: "", termMonths: 12, interestRate: 12.0, purpose: "" });
    } catch (err) {
      toast.error(err?.response?.data?.error?.message || "Failed to create loan request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-max py-12">
      <div className="max-w-lg mx-auto card p-6 rounded">
        <h2 className="text-2xl neon-text font-semibold">Create Loan Request</h2>
        <form onSubmit={submit} className="mt-4 flex flex-col gap-3">
          <input required placeholder="Amount (USD)" value={form.amount} onChange={(e)=>setForm({...form,amount:e.target.value})} className="p-3 rounded bg-transparent border border-white/6" />
          <input required placeholder="Term (months)" value={form.termMonths} onChange={(e)=>setForm({...form,termMonths:e.target.value})} className="p-3 rounded bg-transparent border border-white/6" />
          <input required placeholder="Interest rate (%)" value={form.interestRate} onChange={(e)=>setForm({...form,interestRate:e.target.value})} className="p-3 rounded bg-transparent border border-white/6" />
          <textarea placeholder="Purpose" value={form.purpose} onChange={(e)=>setForm({...form,purpose:e.target.value})} className="p-3 rounded bg-transparent border border-white/6" />

          <button disabled={loading} className="btn-neon p-3 rounded">{loading?"Submitting...":"Submit request"}</button>
        </form>
      </div>
    </div>
  )
}
