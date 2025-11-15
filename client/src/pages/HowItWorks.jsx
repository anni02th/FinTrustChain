import React from "react";

const HowItWorks = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 py-24 px-4">
      <div className="container mx-auto max-w-5xl">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 text-center">
          How FinTrustChain Works
        </h1>

        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 mb-8">
          <p className="text-gray-300 leading-relaxed">
            FinTrustChain is an app for decentralized unsecured loans based on
            community trust. We mimic the credit score system using our
            TrustIndex metric and have incorporated an endorsement system that
            leverages community connections. This platform enables users to
            quickly access loans without traditional collateral, relying instead
            on social trust and reputation within the community.
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Key Features</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-blue-400 mb-2">
                1. Endorsement System
              </h3>
              <ul className="text-gray-300 space-y-2 ml-4">
                <li>• Search and endorse users by their User ID</li>
                <li>
                  • Bidirectional endorsement - when you endorse someone, they
                  become your endorser too
                </li>
                <li>• Maximum of 4 new endorsements per month</li>
                <li>
                  • Gain or lose TrustIndex based on endorsement activities
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-blue-400 mb-2">
                2. Guarantor System
              </h3>
              <p className="text-gray-300">
                If a receiver is unable to pay the loan within the first 28 days
                of default, the loan responsibility will be transferred to their
                guarantor, providing an additional layer of security for
                lenders.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-blue-400 mb-2">
                3. Dual Role Profiles
              </h3>
              <p className="text-gray-300">
                Every user has 2 profiles - Lender and Receiver. You can toggle
                between them, but you can only have one active role at a time.
                If you have an ongoing loan as a receiver, you can't lend money
                as a lender and vice versa.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">
            Loan Process Workflow
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-green-400 mb-3">
                Step 1: Browse Loan Brochures
              </h3>
              <p className="text-gray-300 mb-2">
                Lenders post loan brochures containing:
              </p>
              <ul className="text-gray-300 space-y-1 ml-4">
                <li>• Loan amount available</li>
                <li>• Interest rate</li>
                <li>• Repayment timeline (in days)</li>
                <li>
                  • Historical data (number of loans given, request/accept
                  ratio, total amount lent)
                </li>
              </ul>
              <p className="text-gray-300 mt-2">
                Receivers can browse brochures filtered by their TrustIndex
                eligibility.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-green-400 mb-3">
                Step 2: Submit Loan Request
              </h3>
              <p className="text-gray-300">
                Receivers can select up to 3 lenders at a time. Whichever lender
                accepts first gets connected, and the request expires for other
                lenders (First-Come-First-Served basis).
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-green-400 mb-3">
                Step 3: Contract Signing
              </h3>
              <p className="text-gray-300 mb-2">
                Once a lender accepts, a standard 3-page contract is generated:
              </p>
              <ul className="text-gray-300 space-y-1 ml-4">
                <li>
                  • <span className="font-semibold">Page 1 (Receiver):</span>{" "}
                  Acceptance of lender's agreement and standard terms
                </li>
                <li>
                  • <span className="font-semibold">Page 2 (Guarantor):</span>{" "}
                  Agreement in case of default
                </li>
                <li>
                  • <span className="font-semibold">Page 3 (Lender):</span>{" "}
                  Acceptance of the request
                </li>
              </ul>
              <p className="text-gray-300 mt-2">
                Each party must sign with their e-signature. Each contract has a
                unique ID.
              </p>
              <p className="text-gray-300 mt-2 text-yellow-300">
                Note: If any party cancels or the guarantor rejects, the entire
                contract is cancelled.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-green-400 mb-3">
                Step 4: Loan Disbursal
              </h3>
              <p className="text-gray-300">
                Once all three parties sign, the lender disburses the funds. As
                soon as the money is sent, the loan repayment countdown begins.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-green-400 mb-3">
                Step 5: Repayment
              </h3>
              <p className="text-gray-300">
                Loan repayment is made in installments through the integrated
                payment gateway. Upon full repayment, an auto-signed
                acknowledgement letter is generated and sent to all three
                parties (Lender, Receiver, and Guarantor).
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">
            TrustIndex Milestones
          </h2>
          <p className="text-gray-300 mb-4">
            Your TrustIndex determines your loan eligibility:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="py-3 px-4 text-blue-400 font-semibold">
                    TrustIndex Range
                  </th>
                  <th className="py-3 px-4 text-blue-400 font-semibold">
                    Eligible Loan Amount (INR)
                  </th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                <tr className="border-b border-white/10">
                  <td className="py-2 px-4">Below 400</td>
                  <td className="py-2 px-4">₹500</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-2 px-4">400 - 500</td>
                  <td className="py-2 px-4">₹1,000</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-2 px-4">500 - 600</td>
                  <td className="py-2 px-4">₹2,000</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-2 px-4">600 - 750</td>
                  <td className="py-2 px-4">₹5,000</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-2 px-4">750 - 850</td>
                  <td className="py-2 px-4">₹10,000</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-2 px-4">850 - 900</td>
                  <td className="py-2 px-4">₹15,000</td>
                </tr>
                <tr>
                  <td className="py-2 px-4">900 - 950</td>
                  <td className="py-2 px-4">₹20,000</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">
            Dashboard Features
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold text-purple-400 mb-3">
                Receiver Dashboard
              </h3>
              <ul className="text-gray-300 space-y-2 text-sm">
                <li>
                  • <span className="font-semibold">Identity & Trust:</span>{" "}
                  TrustIndex breakdown, verification badges, default history
                </li>
                <li>
                  • <span className="font-semibold">Loan Activity:</span> Active
                  loans, request history, repayment schedule, past contracts
                </li>
                <li>
                  • <span className="font-semibold">Network:</span> Endorsed
                  users, guarantor requests, active responsibilities
                </li>
                <li>
                  • <span className="font-semibold">Analytics:</span> TrustIndex
                  trends and milestones
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-purple-400 mb-3">
                Lender Dashboard
              </h3>
              <ul className="text-gray-300 space-y-2 text-sm">
                <li>
                  • <span className="font-semibold">Portfolio Overview:</span>{" "}
                  Active loans, average interest rate, default rate
                </li>
                <li>
                  • <span className="font-semibold">Loan Requests:</span> Inbox
                  with borrower details, TrustIndex, and actions
                </li>
                <li>
                  • <span className="font-semibold">History:</span> Past
                  contracts and acknowledgement letters
                </li>
                <li>
                  • <span className="font-semibold">Transactions:</span>{" "}
                  Complete payment ledger (send/receive)
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-400 text-sm">
            Built with trust, secured by community
          </p>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
