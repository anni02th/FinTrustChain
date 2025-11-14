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
        <nav
          className="flex flex-col sm:flex-row justify-between items-center py-4"
          aria-label="Footer"
        >
          <div className="flex items-center mb-3 sm:mb-0">
            <Link to="/" className="text-lg font-semibold text-white">
              FinTrustChain
            </Link>
          </div>

          <div className="flex flex-wrap justify-center sm:justify-end gap-2">
            {tabs.map (tab => (
              <Link
                key={tab.to}
                to={tab.to}
                className="px-3 py-2 text-sm rounded-md text-white hover:text-gray-100 hover:bg-gray-800 transition-colors duration-150"
              >
                {tab.label}
              </Link>
            ))}
          </div>
        </nav>

        <div className="py-3 border-t border-white/6 text-center">
          <p className="text-xs text-white">
            © {new Date ().getFullYear ()} FinTrustChain. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
