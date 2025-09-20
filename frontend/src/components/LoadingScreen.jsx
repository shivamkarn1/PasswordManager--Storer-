import { useState, useEffect } from 'react';
import Loader from './Loader';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Premium Dark Background Pattern */}
      <div className="absolute inset-0">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/20 via-black to-purple-950/20"></div>
        
        {/* Animated glow effects */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-blue-600/40 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-600/40 rounded-full blur-3xl animate-pulse delay-700"></div>
          <div className="absolute top-2/3 left-1/2 w-48 h-48 bg-cyan-500/30 rounded-full blur-2xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/6 right-1/6 w-32 h-32 bg-indigo-500/25 rounded-full blur-xl animate-pulse delay-1500"></div>
        </div>

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
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
              className="w-32 h-32 rounded-2xl shadow-2xl shadow-blue-500/50 border-2 border-blue-400/40 backdrop-blur-sm relative z-10"
            />
            {/* Logo glow effect */}
            <div className="absolute inset-0 w-32 h-32 rounded-2xl bg-blue-500/20 blur-lg animate-pulse"></div>
          </div>
        </div>
        
        {/* Animated Loader */}
        <div className="transform scale-110">
          <Loader />
        </div>
        
        {/* Title and Loading Text */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold font-mono tracking-wider text-white drop-shadow-lg">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Shivam's Vault
            </span>
          </h1>
          <p className="font-mono text-lg text-blue-300/90 animate-pulse">
            Initializing secure vault...
          </p>
          
          {/* Premium Loading Bar */}
          <div className="w-80 h-2 bg-gray-800/60 rounded-full overflow-hidden backdrop-blur-sm border border-gray-700/50">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-400 rounded-full shadow-lg shadow-blue-500/30"
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
              className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 animate-bounce shadow-sm shadow-blue-400/50"
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
            className="absolute w-1 h-1 bg-blue-400/40 rounded-full animate-ping"
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
      <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-blue-500/30"></div>
      <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-purple-500/30"></div>
      <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-cyan-500/30"></div>
      <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-indigo-500/30"></div>
      
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