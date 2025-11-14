import React from "react";

export default function About() {
  return (
    <div className="container-max py-24">
      <div className="max-w-4xl mx-auto card p-6 rounded">
        <h1 className="text-3xl font-bold neon-text">About FinTrustChain</h1>
        <p className="mt-4 text-gray-300">FinTrustChain is a decentralized-inspired trust scoring and loan matchmaking platform that helps lenders and receivers connect directly. We combine signature verification, trust indexes and community endorsements to minimise friction and fraud in small-value lending.</p>

        <h2 className="mt-6 font-semibold neon-text">Mission</h2>
        <p className="text-gray-300">To make credit accessible by building transparent trust signals and simple tools for lenders and borrowers.</p>

        <h2 className="mt-6 font-semibold neon-text">How it works</h2>
        <ol className="list-decimal ml-6 text-gray-300 mt-2">
          <li>Sign up and verify your e-signature image.</li>
          <li>Build trust through endorsements and on-time repayments.</li>
          <li>Create or apply to loan brochures and settle via the platform.</li>
        </ol>
      </div>
    </div>
  );
}
