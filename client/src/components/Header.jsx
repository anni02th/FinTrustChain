import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";

const tabs = [
  { to: "/", label: "Home" },
  { to: "/brochures", label: "Brochures" },
  { to: "/create-loan", label: "Create Loan" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/payments", label: "Payments" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-white/6 from-black/60 to-black/40">
      <div className="container-max flex items-center justify-between h-16">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3">
            <span className="logo-mark" aria-hidden />
            <span className="font-semibold text-white">FinTrustChain</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-2">
          {tabs.map((t) => (
            <NavLink
              key={t.to}
              to={t.to}
              className={({ isActive }) =>
                (isActive ? "text-white border-b-2 border-neon" : "text-gray-300 hover:text-white") +
                " px-3 py-2 text-sm font-medium"
              }
            >
              {t.label}
            </NavLink>
          ))}

          <Link to="/login" className="ml-4 btn-neon px-3 py-2 rounded text-sm font-semibold">
            Sign in
          </Link>
        </nav>

        <div className="md:hidden">
          <button
            onClick={() => setOpen((s) => !s)}
            className="p-2 rounded bg-white/3 text-white"
            aria-label="Toggle menu"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-black/60 border-t border-white/4">
          <div className="flex flex-col p-4 gap-2">
            {tabs.map((t) => (
              <Link key={t.to} to={t.to} className="text-gray-200 px-2 py-2 rounded hover:bg-white/2">
                {t.label}
              </Link>
            ))}

            <Link to="/login" className="mt-2 btn-neon px-3 py-2 rounded text-center font-semibold">
              Sign in
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
