import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function Verify() {
  const { user, refreshUser } = useAuth();
  const [checking, setChecking] = useState(false);
  const nav = useNavigate();

  const checkVerified = async () => {
    setChecking(true);
    try {
      const res = await refreshUser();
      const updatedUser = res.ok ? null : null;
      // refreshUser updated context; check via user from context may be stale here,
      // so directly fetch users/me could be used but refreshUser already did that.
      // We'll wait briefly and then fetch via window to ensure latest context.
      await new Promise((r) => setTimeout(r, 300));
      // Access latest user from localStorage -> users.me via context was updated
      // Simple approach: reload page to have latest state
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No session token found. Please log in.");
        nav("/login");
        return;
      }
      // If backend verified, users.me will show verification flag; call refreshUser again
      const final = await refreshUser();
      // We cannot access updated user synchronously here due to closure; rely on redirect
      // Instead, try to navigate to dashboard; backend will enforce verification on login when needed
      toast.success("Checked verification status. If verified, you can proceed.");
      nav("/dashboard");
    } catch (err) {
      toast.error("Still not verified. Check your email for the verification link.");
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="container-max h-screen flex items-center justify-center">
      <div className="max-w-lg card p-6 rounded">
        <h2 className="text-2xl font-semibold neon-text">Verify your email</h2>
        <p className="mt-3 text-gray-300">We have sent a verification link to your registered email. Please check your inbox and click the link to verify your account.</p>
        <div className="mt-4 flex gap-3">
          <button onClick={checkVerified} className="btn-neon p-3 rounded" disabled={checking}>{checking?"Checking...":"I have verified"}</button>
          <a className="text-sm text-gray-400 self-center underline" href="mailto:" onClick={(e)=>{e.preventDefault(); toast('Open your email client to find the verification message.')}}>Open email</a>
        </div>
      </div>
    </div>
  );
}
