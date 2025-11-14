import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../api/api";
import toast from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await auth.login({ email, password });
      const { token } = res.data;
      localStorage.setItem("token", token);
      toast.success("Logged in");
      nav("/dashboard");
    } catch (err) {
      toast.error(err?.response?.data?.error?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-max py-12">
      <div className="max-w-md mx-auto card p-6 rounded">
        <h2 className="text-2xl font-semibold neon-text">Sign in</h2>
        <form onSubmit={submit} className="mt-4 flex flex-col gap-3">
          <input
            required
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 rounded bg-transparent border border-white/6 outline-none"
          />

          <input
            required
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 rounded bg-transparent border border-white/6 outline-none"
          />

          <button className="btn-neon p-3 rounded mt-2" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>

          <div className="text-sm text-gray-400 mt-2">
            Don’t have an account? <Link to="/register" className="text-white underline">Register</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
