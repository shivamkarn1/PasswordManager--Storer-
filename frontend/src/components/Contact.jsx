import React, { useState } from 'react';
import { FaInstagram, FaGithub, FaSnapchat, FaEnvelope } from 'react-icons/fa';
import Footer from './Footer';

const Contact = () => {
    const [hoveredCard, setHoveredCard] = useState(null);

    const socialLinks = [
        {
            id: 1,
            icon: <FaInstagram size={28} />,
            name: 'Instagram',
            url: 'https://www.instagram.com/shivam.karn.67/profilecard/?igsh=djg4dTdOdDFiZ3hx',
            color: 'hover:text-pink-500',
            gradient: 'from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300',
            bgHover: 'hover:bg-slate-50 dark:hover:bg-slate-800',
            emoji: '📸',
            description: 'Follow me for updates and photos'
        },
        {
            id: 2,
            icon: <FaGithub size={28} />,
            name: 'GitHub',
            url: 'https://github.com/Shivam67Code',
            color: 'hover:text-slate-800 dark:hover:text-slate-200',
            gradient: 'from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300',
            bgHover: 'hover:bg-slate-50 dark:hover:bg-slate-800',
            emoji: '💻',
            description: 'Check out my latest projects'
        },
        {
            id: 3,
            icon: <FaSnapchat size={28} />,
            name: 'Snapchat',
            url: 'https://snapchat.com/add/ankushkarn?share_id=8PSnDkcCs-s&locale=en-US',
            color: 'hover:text-yellow-500',
            gradient: 'from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300',
            bgHover: 'hover:bg-slate-50 dark:hover:bg-slate-800',
            emoji: '👻',
            description: 'Add me for fun snaps'
        },
        {
            id: 4,
            icon: <FaEnvelope size={28} />,
            name: 'Email',
            url: 'mailto:shivamkarn767@gmail.com',
            color: 'hover:text-blue-500',
            gradient: 'from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300',
            bgHover: 'hover:bg-slate-50 dark:hover:bg-slate-800',
            emoji: '✉️',
            description: 'Drop me a message'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-slate-900/5 dark:to-slate-100/5"></div>
                {/* Floating elements */}
                {[...Array(12)].map((_, i) => (
                    <span
                        key={i}
                        className="absolute animate-bounce"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            fontSize: `${Math.random() * 20 + 15}px`,
                            opacity: 0.1,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${3 + Math.random() * 2}s`
                        }}
                    >
                        {['🔒', '💻', '📱', '⚡'][Math.floor(Math.random() * 4)]}
                    </span>
                ))}
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                {/* Hero Section */}
                <div className="text-center space-y-8 mb-20 animate-fade-in-up">
                    <h1 className="text-5xl md:text-6xl font-bold tracking-tight font-tagesschrift">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-slate-100 dark:via-slate-300 dark:to-slate-100">
                            Let's Connect
                        </span>
                        <span className="inline-block ml-2 animate-pulse">
                            🔐
                        </span>
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-source-code">
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
                            className="group relative p-8 flex flex-col items-center justify-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl animate-fade-in-up"
                            style={{ 
                                animationDelay: `${index * 0.1}s`
                            }}
                            onMouseEnter={() => setHoveredCard(link.id)}
                            onMouseLeave={() => setHoveredCard(null)}
                        >
                            <div className={`relative group-hover:animate-bounce p-4 rounded-full bg-gradient-to-br ${link.gradient} text-white dark:text-slate-900 shadow-lg`}>
                                {link.icon}
                            </div>
                            <h3 className="mt-6 text-xl font-semibold text-slate-900 dark:text-slate-100 font-tagesschrift">
                                {link.name}
                            </h3>
                            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 opacity-75 font-source-code">
                                {link.description}
                            </p>
                            <span className="text-2xl mt-4 animate-pulse transform group-hover:scale-125 transition-transform">
                                {link.emoji}
                            </span>
                            
                            {/* Hover Effect Overlay */}
                            <div className="absolute inset-0 -z-10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="absolute inset-0 bg-gradient-to-br from-slate-900/5 to-slate-700/5 dark:from-slate-100/5 dark:to-slate-300/5"></div>
                            </div>
                        </a>
                    ))}
                </div>

                {/* Footer Message */}
                <div className="text-center mt-20 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                    <p className="text-lg text-slate-600 dark:text-slate-400 font-medium font-source-code">
                        Looking forward to hearing from you! 
                        <span className="inline-block ml-2 animate-bounce">
                            👋
                        </span>
                    </p>
                </div>
            </div>

            {/* Footer Component */}
            <Footer />
        </div>
    );
};

export default Contact;