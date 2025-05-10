import React, { useState } from 'react';
import { FaInstagram, FaGithub, FaSnapchat, FaEnvelope } from 'react-icons/fa';
import { useTheme } from './ThemeContext';

const Contact = () => {
    const { currentTheme } = useTheme();
    const [hoveredCard, setHoveredCard] = useState(null);

    const socialLinks = [
        {
            id: 1,
            icon: <FaInstagram size={28} />,
            name: 'Instagram',
            url: 'https://www.instagram.com/shivam.karn.67/profilecard/?igsh=djg4dTdOdDFiZ3hx',
            color: 'hover:text-pink-500',
            gradient: 'from-purple-500 to-pink-500',
            bgHover: 'hover:bg-pink-50',
            emoji: '📸',
            description: 'Follow me for updates and photos'
        },
        {
            id: 2,
            icon: <FaGithub size={28} />,
            name: 'GitHub',
            url: 'https://github.com/Shivam67Code',
            color: 'hover:text-gray-800',
            gradient: 'from-gray-700 to-gray-900',
            bgHover: 'hover:bg-gray-50',
            emoji: '💻',
            description: 'Check out my latest projects'
        },
        {
            id: 3,
            icon: <FaSnapchat size={28} />,
            name: 'Snapchat',
            url: 'https://snapchat.com/add/ankushkarn?share_id=8PSnDkcCs-s&locale=en-US',
            color: 'hover:text-yellow-500',
            gradient: 'from-yellow-400 to-yellow-500',
            bgHover: 'hover:bg-yellow-50',
            emoji: '👻',
            description: 'Add me for fun snaps'
        },
        {
            id: 4,
            icon: <FaEnvelope size={28} />,
            name: 'Email',
            url: 'mailto:shivamkarn767@gmail.com',
            color: 'hover:text-blue-500',
            gradient: 'from-blue-400 to-blue-600',
            bgHover: 'hover:bg-blue-50',
            emoji: '✉️',
            description: 'Drop me a message'
        }
    ];

    return (
        <div className={`min-h-screen ${currentTheme.colors.background} relative overflow-hidden`}>
            {/* Animated Background */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/5"></div>
                {currentTheme.id === 'redRoses' && (
                    [...Array(12)].map((_, i) => (
                        <span
                            key={i}
                            className="absolute animate-heart-float"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                fontSize: `${Math.random() * 20 + 15}px`,
                                opacity: 0.2,
                                animationDelay: `${Math.random() * 5}s`
                            }}
                        >
                            {['🌹', '❤️', '💌'][Math.floor(Math.random() * 3)]}
                        </span>
                    ))
                )}
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                {/* Hero Section */}
                <div className={`text-center space-y-8 mb-20 ${currentTheme.animation.enter}`}>
                    <h1 className={`text-5xl md:text-6xl font-bold tracking-tight`}>
                        <span className={`bg-clip-text text-transparent bg-gradient-to-r 
                            ${currentTheme.id === 'cyberNight' ? 'from-cyan-400 to-blue-500' :
                            currentTheme.id === 'redRoses' ? 'from-rose-500 to-pink-500' :
                            'from-indigo-500 to-purple-500'}`}>
                            Let's Connect
                        </span>
                        <span className={`inline-block ml-2 ${currentTheme.animation.button}`}>
                            {currentTheme.icon}
                        </span>
                    </h1>
                    <p className={`text-xl md:text-2xl text-${currentTheme.colors.secondaryText} max-w-2xl mx-auto`}>
                        Feel free to reach out through any of these platforms. I'm always excited to collaborate and connect!
                    </p>
                </div>

                {/* Social Links Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {socialLinks.map((link, index) => (
                        <a
                            key={link.id}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`group relative p-8 flex flex-col items-center justify-center 
                                ${currentTheme.colors.cardBg} rounded-2xl
                                transform transition-all duration-300
                                hover:scale-105 hover:shadow-2xl
                                ${currentTheme.animation.enter}`}
                            style={{ 
                                animationDelay: `${index * 0.1}s`,
                                background: hoveredCard === link.id ? 
                                    `linear-gradient(135deg, ${currentTheme.colors.accent}10, transparent)` : 
                                    undefined
                            }}
                            onMouseEnter={() => setHoveredCard(link.id)}
                            onMouseLeave={() => setHoveredCard(null)}
                        >
                            <div className={`relative group-hover:animate-bounce-gentle
                                p-4 rounded-full bg-gradient-to-br ${link.gradient} 
                                text-white shadow-lg`}>
                                {link.icon}
                            </div>
                            <h3 className={`mt-6 text-xl font-semibold text-${currentTheme.colors.headerText}`}>
                                {link.name}
                            </h3>
                            <p className={`mt-2 text-sm text-${currentTheme.colors.secondaryText} opacity-75`}>
                                {link.description}
                            </p>
                            <span className={`text-2xl mt-4 ${currentTheme.animation.button}
                                transform group-hover:scale-125 transition-transform`}>
                                {link.emoji}
                            </span>
                            
                            {/* Hover Effect Overlay */}
                            <div className="absolute inset-0 -z-10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className={`absolute inset-0 bg-gradient-to-br ${link.gradient} opacity-5`}></div>
                            </div>
                        </a>
                    ))}
                </div>

                {/* Footer Message */}
                <div className={`text-center mt-20 ${currentTheme.animation.enter}`}>
                    <p className={`text-lg text-${currentTheme.colors.secondaryText} font-medium`}>
                        Looking forward to hearing from you! 
                        <span className={`inline-block ml-2 animate-bounce`}>
                            {currentTheme.id === 'redRoses' ? '💌' : 
                             currentTheme.id === 'cyberNight' ? '💻' :
                             currentTheme.id === 'frostbyte' ? '❄️' :
                             currentTheme.id === 'raining' ? '☔' : '👋'}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Contact;