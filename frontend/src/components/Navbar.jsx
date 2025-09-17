import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleHomeClick = () => {
    setIsRefreshing(true);
    
    // Add a subtle animation delay before navigating
    setTimeout(() => {
      navigate('/');
      setIsRefreshing(false);
    }, 300);
    
    setIsMobileMenuOpen(false);
  };

  const navigateToPage = (page) => {
    navigate(`/${page}`);
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Helper function to check if a route is active
  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 bg-gradient-to-br from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white dark:text-slate-900" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 font-tagesschrift">
                SecureVault
              </h1>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-source-code">
                Password Manager
              </p>
            </div>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={handleHomeClick}
              className={`text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-all duration-200 font-medium font-source-code focus:outline-none flex items-center gap-2 ${isRefreshing ? 'animate-pulse' : ''} ${isActiveRoute('/') ? 'text-slate-900 dark:text-slate-100 font-semibold' : ''}`}
              disabled={isRefreshing}
            >
              <svg 
                className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Home
            </button>
            <button 
              onClick={() => navigateToPage('about')}
              className={`text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-colors duration-200 font-medium font-source-code focus:outline-none flex items-center gap-2 ${isActiveRoute('/about') ? 'text-slate-900 dark:text-slate-100 font-semibold' : ''}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              About
            </button>
            <button 
              onClick={() => navigateToPage('contact')}
              className={`text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-colors duration-200 font-medium font-source-code focus:outline-none flex items-center gap-2 ${isActiveRoute('/contact') ? 'text-slate-900 dark:text-slate-100 font-semibold' : ''}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Contact
            </button>
          </div>

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:flex items-center">
            <SignedOut>
              <SignInButton>
                <button className="px-6 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 text-white dark:text-slate-900 font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg font-source-code">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
            
            <SignedIn>
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10 rounded-xl border-2 border-slate-200 dark:border-slate-700 shadow-lg",
                    userButtonPopover: "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl rounded-xl",
                  }
                }}
              />
            </SignedIn>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={toggleMobileMenu}
              className="p-2 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-all duration-200 focus:outline-none transform hover:scale-105 active:scale-95"
            >
              <div className="relative w-6 h-6 flex items-center justify-center">
                {/* Hamburger Icon */}
                <div className={`absolute inset-0 transform transition-all duration-300 ${isMobileMenuOpen ? 'rotate-180 opacity-0' : 'rotate-0 opacity-100'}`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </div>
                
                {/* Close Icon */}
                <div className={`absolute inset-0 transform transition-all duration-300 ${isMobileMenuOpen ? 'rotate-0 opacity-100' : 'rotate-180 opacity-0'}`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen 
            ? 'max-h-96 opacity-100 transform translate-y-0' 
            : 'max-h-0 opacity-0 transform -translate-y-4'
        }`}>
          <div className="mt-4 pb-4 border-t border-slate-200 dark:border-slate-700">
            <div className="flex flex-col space-y-4 pt-4">
              {/* Mobile Navigation Links */}
              <button 
                onClick={handleHomeClick}
                className={`text-left text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-all duration-200 font-medium font-source-code focus:outline-none flex items-center gap-2 transform hover:translate-x-2 hover:scale-105 ${isRefreshing ? 'animate-pulse' : ''} ${isActiveRoute('/') ? 'text-slate-900 dark:text-slate-100 font-semibold' : ''}`}
                disabled={isRefreshing}
                style={{ animationDelay: '0.1s' }}
              >
                <svg 
                  className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Home
              </button>
              <button 
                onClick={() => navigateToPage('about')}
                className={`text-left text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-all duration-200 font-medium font-source-code focus:outline-none flex items-center gap-2 transform hover:translate-x-2 hover:scale-105 ${isActiveRoute('/about') ? 'text-slate-900 dark:text-slate-100 font-semibold' : ''}`}
                style={{ animationDelay: '0.2s' }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                About
              </button>
              <button 
                onClick={() => navigateToPage('contact')}
                className={`text-left text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-all duration-200 font-medium font-source-code focus:outline-none flex items-center gap-2 transform hover:translate-x-2 hover:scale-105 ${isActiveRoute('/contact') ? 'text-slate-900 dark:text-slate-100 font-semibold' : ''}`}
                style={{ animationDelay: '0.3s' }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Contact
              </button>
              
              {/* Mobile Auth */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 transform transition-all duration-300" style={{ animationDelay: '0.4s' }}>
                <SignedOut>
                  <SignInButton>
                    <button className="w-full px-6 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 text-white dark:text-slate-900 font-semibold rounded-lg transition-all duration-200 shadow-lg font-source-code transform hover:scale-105 active:scale-95">
                      Sign In
                    </button>
                  </SignInButton>
                </SignedOut>
                
                <SignedIn>
                  <div className="flex items-center space-x-3 transform transition-all duration-200 hover:scale-105">
                    <UserButton 
                      appearance={{
                        elements: {
                          avatarBox: "w-10 h-10 rounded-xl border-2 border-slate-200 dark:border-slate-700 shadow-lg",
                          userButtonPopover: "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl rounded-xl",
                        }
                      }}
                    />
                    <span className="text-slate-700 dark:text-slate-300 font-source-code text-sm">
                      Account
                    </span>
                  </div>
                </SignedIn>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;