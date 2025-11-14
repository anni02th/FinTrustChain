import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../api/api";
import toast from "react-hot-toast";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "borrower" });
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await auth.register(form);
      const { token } = res.data;
      localStorage.setItem("token", token);
      toast.success("Account created");
      nav("/dashboard");
    } catch (err) {
      toast.error(err?.response?.data?.error?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-max py-12">
      <div className="max-w-md mx-auto card p-6 rounded">
        <h2 className="text-2xl font-semibold neon-text">Create account</h2>
        <form onSubmit={submit} className="mt-4 flex flex-col gap-3">
          <input required placeholder="Full name" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} className="p-3 rounded bg-transparent border border-white/6" />
          <input required type="email" placeholder="Email" value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})} className="p-3 rounded bg-transparent border border-white/6" />
          <input required type="password" placeholder="Password" value={form.password} onChange={(e)=>setForm({...form,password:e.target.value})} className="p-3 rounded bg-transparent border border-white/6" />

          <select value={form.role} onChange={(e)=>setForm({...form,role:e.target.value})} className="p-3 rounded bg-transparent border border-white/6">
            <option value="borrower">Borrower</option>
            <option value="lender">Lender</option>
            <option value="guarantor">Guarantor</option>
          </select>

          <button className="btn-neon p-3 rounded" disabled={loading}>{loading?"Creating...":"Create account"}</button>
        </form>
      </div>
    </div>
  )
}
