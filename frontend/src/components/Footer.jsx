import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white dark:text-slate-900" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex flex-col">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100" style={{ fontFamily: "'Libertinus Keyboard', monospace" }}>
                  SecureVault
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-source-code">
                  Password Manager
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 font-source-code max-w-xs">
              Enterprise-grade password management with military-level security for your digital life.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100" style={{ fontFamily: "'Handlee', cursive" }}>
              Quick Links
            </h3>
            <div className="space-y-2">
              {/*
                { name: 'Home', to: '/' },
                { name: 'About', to: '/about' },
                { name: 'Contact', to: '/contact' }
              */}
              {Object.entries({
                Home: '/',
                About: '/about',
                Contact: '/contact'
              }).map(([name, to]) => (
                <Link
                  key={name}
                  to={to}
                  className="block text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors duration-200 font-source-code"
                >
                  {name}
                </Link>
              ))}
            </div>
          </div>

          {/* Security Features */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100" style={{ fontFamily: "'Handlee', cursive" }}>
              Security Features
            </h3>
            <div className="space-y-3">
              {[
                { icon: '🔒', text: 'AES-256 Encryption' },
                { icon: '🛡️', text: 'Zero-Knowledge Architecture' },
                { icon: '💾', text: 'Secure Cloud Backup' },
                { icon: '📱', text: 'Cross-Platform Sync' }
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="text-lg">{feature.icon}</span>
                  <span className="text-sm text-slate-600 dark:text-slate-400 font-source-code">
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-200 dark:border-slate-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 font-source-code">
              <span>© 2025 SecureVault. All rights reserved.</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 font-source-code">
              <span>Created with</span>
              <svg 
                className="w-4 h-4 text-slate-900 dark:text-slate-100 animate-pulse" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
              <span>by</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100" style={{ fontFamily: "'Handlee', cursive" }}>
                Shivam Karn
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;