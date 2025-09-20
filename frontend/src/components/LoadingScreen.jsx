import { useState, useEffect } from 'react';
import Loader from './Loader';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Premium Dark Background Pattern */}
      <div className="absolute inset-0">
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 via-black to-gray-800/30"></div>
        
        {/* Animated glow effects - only grayscale */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-gray-600/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gray-700/25 rounded-full blur-3xl animate-pulse delay-700"></div>
          <div className="absolute top-2/3 left-1/2 w-48 h-48 bg-gray-500/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/6 right-1/6 w-32 h-32 bg-gray-800/15 rounded-full blur-xl animate-pulse delay-1500"></div>
        </div>

        {/* Subtle grid pattern - grayscale */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `
            linear-gradient(rgba(128, 128, 128, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(128, 128, 128, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center space-y-8">
        {/* Logo with premium glow */}
        <div className="transform animate-pulse">
          <div className="relative">
            <img 
              src="/bluelogo.png" 
              alt="Shivam's Vault Logo" 
              className="w-32 h-32 rounded-2xl shadow-2xl shadow-gray-500/50 border-2 border-gray-600/40 backdrop-blur-sm relative z-10"
            />
            {/* Logo glow effect - grayscale */}
            <div className="absolute inset-0 w-32 h-32 rounded-2xl bg-gray-500/20 blur-lg animate-pulse"></div>
          </div>
        </div>
        
        {/* Animated Loader */}
        <div className="transform scale-110">
          <Loader />
        </div>
        
        {/* Title and Loading Text */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold font-mono tracking-wider text-white drop-shadow-lg">
            Shivam's Vault
          </h1>
          <p className="font-mono text-lg text-gray-300 animate-pulse">
            Initializing secure vault...
          </p>
          
          {/* Premium Loading Bar */}
          <div className="w-80 h-2 bg-gray-800/60 rounded-full overflow-hidden backdrop-blur-sm border border-gray-700/50">
            <div 
              className="h-full bg-gradient-to-r from-gray-400 via-gray-300 to-white rounded-full shadow-lg shadow-gray-400/30"
              style={{
                animation: 'loadingBar 2.5s ease-in-out infinite'
              }}
            ></div>
          </div>

          {/* Loading percentage indicator */}
          <div className="text-xs text-gray-400 font-mono animate-pulse">
            Encrypting your data...
          </div>
        </div>

        {/* Premium Accent Elements */}
        <div className="flex space-x-3 mt-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-gradient-to-r from-gray-400 to-white animate-bounce shadow-sm shadow-gray-400/50"
              style={{
                animationDelay: `${i * 0.15}s`,
                animationDuration: '1.2s'
              }}
            ></div>
          ))}
        </div>
      </div>
      
      {/* Floating Particles for Premium Feel */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-gray-400/40 rounded-full animate-ping"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.4}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>

      {/* Corner accent lines */}
      <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-gray-500/30"></div>
      <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-gray-600/30"></div>
      <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-gray-400/30"></div>
      <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-gray-700/30"></div>
      
      <style jsx>{`
        @keyframes loadingBar {
          0% {
            transform: translateX(-100%);
            width: 0%;
          }
          50% {
            width: 75%;
          }
          100% {
            transform: translateX(100%);
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;