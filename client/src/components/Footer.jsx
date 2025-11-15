import React from 'react';
import {Link} from 'react-router-dom';

export default function Footer () {
  const tabs = [
    {to: '/', label: 'Home'},
    {to: '/about', label: 'About'},
    {to: '/services', label: 'Services'},
    {to: '/pricing', label: 'Pricing'},
    {to: '/contact', label: 'Contact'},
    {to: '/privacy', label: 'Privacy'},
  ];

  return (
    <footer className="w-full border-t border-white/6 bg-dark">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-6 py-6">
          <div>
            <Link to="/" className="text-lg font-semibold text-white">FinTrustChain</Link>
            <p className="text-sm text-gray-300 mt-2">Decentralized-inspired micro-lending platform. Build trust, lend responsibly.</p>
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            {tabs.map(tab => (
              <Link key={tab.to} to={tab.to} className="px-3 py-2 text-sm rounded-md text-white hover:text-gray-100 hover:bg-gray-800 transition-colors duration-150">{tab.label}</Link>
            ))}
          </div>

          <div className="text-right">
            <div className="text-sm text-gray-300">Contact</div>
            <a href="mailto:support@fintrustchain.example" className="text-white underline">support@fintrustchain.example</a>
            <div className="mt-3 text-xs text-gray-400">Follow us</div>
            <div className="flex gap-2 justify-end mt-2">
              <a href="#" className="text-white">Twitter</a>
              <a href="#" className="text-white">LinkedIn</a>
            </div>
          </div>
        </div>

        <div className="py-3 border-t border-white/6 text-center">
          <p className="text-xs text-white">© {new Date().getFullYear()} FinTrustChain. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
