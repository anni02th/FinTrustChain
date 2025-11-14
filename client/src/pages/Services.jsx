import React from "react";

export default function Services(){
  return (
    <div className="container-max py-24">
      <div className="max-w-4xl mx-auto card p-6 rounded">
        <h1 className="text-3xl font-bold neon-text">Services</h1>
        <ul className="mt-4 list-disc ml-6 text-gray-300">
          <li>Trust Index calculation and history</li>
          <li>Loan brochure creation for lenders</li>
          <li>Loan request and acceptance workflow</li>
          <li>Endorsements and guarantor requests</li>
        </ul>
      </div>
    </div>
  )
}
