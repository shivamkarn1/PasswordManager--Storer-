import React from 'react';
import { useTheme } from './ThemeContext';

const About = () => {
  const { currentTheme } = useTheme();

  const features = [
    { 
      icon: '🔒', 
      title: 'Enterprise-Grade Security', 
      description: 'Advanced encryption protocols ensure your passwords remain completely secure and protected.',
      highlights: ['AES-256 Encryption', 'Zero-Knowledge Architecture', 'Secure Storage']
    },
    { 
      icon: '🎨', 
      title: 'Intelligent Theming System', 
      description: 'Immersive visual experiences with dynamic themes that adapt to your preferences.',
      highlights: ['7+ Custom Themes', 'Animated Transitions', 'Responsive Design']
    },
    { 
      icon: '💾', 
      title: 'Seamless Data Management', 
      description: 'Effortlessly manage your password database with advanced import/export capabilities.',
      highlights: ['One-Click Backup', 'Secure Import', 'JSON Support']
    },
    { 
      icon: '🔄', 
      title: 'Real-Time Synchronization', 
      description: 'Never lose your passwords with automatic saving and real-time updates.',
      highlights: ['Auto-Save', 'Local Storage', 'Version History']
    },
  ];

  const stats = [
    { number: '256', label: 'Bit Encryption', icon: '🔐' },
    { number: '100%', label: 'Secure', icon: '🛡️' },
    { number: '7+', label: 'Themes', icon: '🎨' },
    { number: '24/7', label: 'Available', icon: '⚡' },
  ];

  return (
    <div className={`min-h-screen ${currentTheme.colors.background} ${currentTheme.colors.text} relative overflow-hidden`}>
      {/* Hero Section with Glass Effect */}
      <div className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          {/* Theme-specific background decorations */}
          {currentTheme.id === 'redRoses' && (
            [...Array(12)].map((_, i) => (
              <span
                key={i}
                className="absolute animate-heart-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  fontSize: `${Math.random() * 20 + 20}px`,
                  opacity: 0.1,
                  animationDelay: `${Math.random() * 5}s`
                }}
              >
                {['🌹', '❤️', '💝'][Math.floor(Math.random() * 3)]}
              </span>
            ))
          )}
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <h1 className={`text-5xl md:text-6xl font-extrabold ${currentTheme.animation.enter}`}>
              <span className={`bg-clip-text text-transparent bg-gradient-to-r 
                ${currentTheme.id === 'cyberNight' ? 'from-cyan-400 to-blue-500' :
                currentTheme.id === 'redRoses' ? 'from-rose-500 to-pink-500' :
                'from-indigo-500 to-purple-500'}`}>
                Password Manager
              </span>
              <span className={`inline-block ml-2 ${currentTheme.animation.button}`}>
                {currentTheme.icon}
              </span>
            </h1>
            <p className={`text-xl md:text-2xl text-${currentTheme.colors.secondaryText} max-w-3xl mx-auto`}>
              Next-Generation Password Management Solution with Advanced Security and Modern Design
            </p>
            
            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-16">
              {stats.map((stat, index) => (
                <div 
                  key={index}
                  className={`${currentTheme.colors.cardBg} rounded-xl p-6 
                    backdrop-blur-lg bg-opacity-50 transform hover:scale-105 transition-all
                    ${currentTheme.animation.enter}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <div className={`text-2xl font-bold text-${currentTheme.colors.headerText}`}>
                    {stat.number}
                  </div>
                  <div className={`text-sm text-${currentTheme.colors.secondaryText}`}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section with Glass Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div 
              key={feature.title}
              className={`${currentTheme.colors.cardBg} rounded-2xl p-8
                backdrop-blur-lg bg-opacity-50 shadow-xl
                transform hover:scale-102 transition-all
                ${currentTheme.animation.enter}`}
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className="text-4xl mb-6">{feature.icon}</div>
              <h3 className={`text-2xl font-bold text-${currentTheme.colors.headerText} mb-4`}>
                {feature.title}
              </h3>
              <p className={`text-${currentTheme.colors.secondaryText} mb-6`}>
                {feature.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {feature.highlights.map((highlight, i) => (
                  <span 
                    key={i}
                    className={`px-3 py-1 rounded-full text-sm
                      ${currentTheme.id === 'cyberNight' ? 'bg-cyan-900/30 text-cyan-400' :
                      currentTheme.id === 'redRoses' ? 'bg-rose-900/30 text-rose-400' :
                      'bg-indigo-900/30 text-indigo-400'}`}
                  >
                    {highlight}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Developer Section with Glass Effect */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className={`${currentTheme.colors.cardBg} rounded-2xl p-12
          backdrop-blur-lg bg-opacity-50 shadow-xl text-center
          ${currentTheme.animation.enter}`}>
          <div className="relative inline-block mb-8">
            <div className={`absolute inset-0 rounded-full blur-2xl bg-gradient-to-r
              ${currentTheme.id === 'cyberNight' ? 'from-cyan-400/30 to-blue-500/30' :
              currentTheme.id === 'redRoses' ? 'from-rose-500/30 to-pink-500/30' :
              'from-indigo-500/30 to-purple-500/30'}`} />
            <span className="relative text-5xl">👨‍💻</span>
          </div>
          
          <h2 className={`text-3xl font-bold text-${currentTheme.colors.headerText} mb-4`}>
            Developed by Shivam Karn
          </h2>
          <p className={`text-${currentTheme.colors.secondaryText} text-lg mb-8`}>
            Crafting secure and intuitive solutions for modern password management
          </p>
          
          <div className="flex justify-center gap-6 mb-8">
            {['💻', '🚀', '💡', '🎯'].map((emoji, index) => (
              <span 
                key={index}
                className={`text-3xl ${currentTheme.animation.button} hover:scale-125 transition-transform`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {emoji}
              </span>
            ))}
          </div>
          
          <div className={`text-sm text-${currentTheme.colors.secondaryText}`}>
            © 2025 All rights reserved 
            <span className={`inline-block ml-2 ${currentTheme.animation.button}`}>✨</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;