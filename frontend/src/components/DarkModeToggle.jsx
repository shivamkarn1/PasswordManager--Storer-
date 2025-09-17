import React, { useState, useEffect } from 'react';
import { useTheme } from './ThemeContext';

const DarkModeToggle = () => {
  const { isDarkMode, toggleDarkMode, isTransitioning } = useTheme();
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Handle the animation sequence
  const handleToggle = () => {
    setIsAnimating(true);
    // Call the actual toggle after a brief delay to let the animation start
    setTimeout(() => {
      toggleDarkMode();
    }, 50);
    
    // Reset animation state after animation completes
    setTimeout(() => {
      setIsAnimating(false);
    }, 800);
  };

  return (
    <button
      onClick={handleToggle}
      className={`
        relative w-16 h-8 rounded-full transition-all duration-500 ease-in-out
        ${isDarkMode 
          ? 'bg-gradient-to-r from-zinc-800 to-black border border-zinc-700' 
          : 'bg-gradient-to-r from-zinc-200 to-zinc-300 border border-zinc-300'
        }
        hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 
        ${isDarkMode ? 'focus:ring-zinc-600' : 'focus:ring-zinc-400'}
        shadow-lg hover:shadow-xl transform
        ${isAnimating ? 'overflow-visible' : 'overflow-hidden'}
        ${isTransitioning ? 'animate-pulse' : ''}
      `}
      aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
      disabled={isAnimating}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 rounded-full overflow-hidden">
        {/* Night sky background (visible in dark mode) */}
        <div 
          className={`
            absolute inset-0 bg-gradient-to-br from-black via-zinc-900 to-zinc-800
            transition-opacity duration-500 ease-in-out
            ${isDarkMode ? 'opacity-100' : 'opacity-0'}
          `}
        >
          {/* Stars */}
          <div className="stars absolute inset-0">
            {[...Array(12)].map((_, i) => (
              <div 
                key={i}
                className={`
                  absolute w-0.5 h-0.5 bg-white rounded-full
                  ${isAnimating && !isDarkMode ? 'animate-fadeout' : ''}
                `}
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  opacity: 0.4 + Math.random() * 0.6,
                  animationDelay: `${Math.random() * 0.5}s`
                }}
              ></div>
            ))}
          </div>
        </div>
        
        {/* Day sky background (visible in light mode) */}
        <div 
          className={`
            absolute inset-0 bg-gradient-to-br from-blue-100 via-zinc-100 to-zinc-200
            transition-opacity duration-500 ease-in-out
            ${isDarkMode ? 'opacity-0' : 'opacity-100'}
          `}
        >
          {/* Clouds */}
          <div className="clouds absolute inset-0">
            {[...Array(3)].map((_, i) => (
              <div 
                key={i}
                className={`
                  absolute w-2 h-1 bg-white rounded-full blur-[1px]
                  ${isAnimating && isDarkMode ? 'animate-fadeout' : ''}
                `}
                style={{
                  top: `${30 + Math.random() * 40}%`,
                  left: `${10 + Math.random() * 80}%`,
                  opacity: 0.6 + Math.random() * 0.4,
                  animationDelay: `${Math.random() * 0.5}s`
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* Toggle Circle */}
      <div
        className={`
          absolute top-0.5 w-7 h-7 rounded-full 
          transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1)
          transform ${isDarkMode ? 'translate-x-8' : 'translate-x-0.5'}
          ${isDarkMode 
            ? 'bg-gradient-to-br from-zinc-300 to-zinc-100 shadow-lg' 
            : 'bg-gradient-to-br from-yellow-100 to-yellow-300 shadow-md'
          }
          flex items-center justify-center z-10
          ${isAnimating ? isDarkMode ? 'scale-110' : 'scale-110' : 'scale-100'}
        `}
      >
        {/* Sun/Moon Icons with Rotation Animation */}
        <div 
          className={`
            relative w-4 h-4 transition-transform duration-700
            ${isAnimating ? 'animate-spin-slow' : ''}
          `}
        >
          {/* Sun Icon */}
          <svg
            className={`
              absolute inset-0 w-4 h-4 transition-all duration-500
              ${isDarkMode 
                ? 'opacity-0 rotate-90 scale-0' 
                : 'opacity-100 rotate-0 scale-100'
              }
              text-amber-500
            `}
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
          </svg>

          {/* Moon Icon */}
          <svg
            className={`
              absolute inset-0 w-4 h-4 transition-all duration-500
              ${isDarkMode 
                ? 'opacity-100 rotate-0 scale-100' 
                : 'opacity-0 -rotate-90 scale-0'
              }
              text-zinc-600
            `}
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
          </svg>
        </div>
      </div>

      {/* Animation Particles */}
      {isAnimating && (
        <div className="absolute inset-0 overflow-visible pointer-events-none">
          {/* Particle effect during transition */}
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className={`
                absolute w-1 h-1 rounded-full pointer-events-none
                animate-particle-fade
                ${isDarkMode ? 'bg-yellow-200' : 'bg-zinc-300'}
              `}
              style={{
                top: '50%',
                left: '50%',
                transform: `translate(-50%, -50%) 
                            rotate(${i * 30}deg) 
                            translateY(${isDarkMode ? '-' : ''}${20 + Math.random() * 30}px)`,
                opacity: isDarkMode ? 0.8 : 0.5,
                animationDelay: `${i * 20}ms`,
                animationDuration: `${400 + Math.random() * 300}ms`
              }}
            ></div>
          ))}
        </div>
      )}
    </button>
  );
};

export default DarkModeToggle;