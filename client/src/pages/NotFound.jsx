import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="container-max h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold neon-text">404</h1>
        <p className="mt-2 text-gray-300">Page not found</p>
        <div className="mt-4">
          <Link to="/" className="btn-neon p-3 rounded">Go home</Link>
        </div>
      </div>
    </div>
  );
}
