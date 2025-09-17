import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from './ThemeContext';
import { UserButton } from "@clerk/clerk-react";


const Navbar = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
    const { currentTheme, changeTheme, themes } = useTheme();

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 300);
        
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        
        window.addEventListener('scroll', handleScroll);
        return () => {
            clearTimeout(timer);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const toggleThemeMenu = () => {
        setIsThemeMenuOpen(!isThemeMenuOpen);
    };

    const handleThemeChange = (themeId) => {
        changeTheme(themeId);
        setIsThemeMenuOpen(false);
    };

    return (
        <div className="fixed w-full top-0 z-50">
        
            {/* Backdrop Blur Effect */}
            <div className={`absolute inset-0 transition-all duration-500 
                ${scrolled ? `bg-gradient-to-r ${currentTheme.colors.navbarBg} backdrop-blur-md` : 'bg-transparent'}`} />

            {/* Navbar */}
            <nav className={`relative transition-all duration-500 bg-gradient-to-r ${currentTheme.colors.navbarBg}
                ${scrolled ? 'py-2' : 'py-4'}`}>
                <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8">
                    {/* Logo Section */}
                    <div className="flex items-center gap-3 group">
                        <span className={`text-3xl sm:text-4xl transform group-hover:scale-110 ${currentTheme.animation.transition} cursor-pointer`}>
                            🔐
                            <UserButton/>
                        </span>
                        <div className="flex flex-col">
                            <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-bold 
                                text-transparent bg-clip-text bg-gradient-to-r ${currentTheme.colors.primary}
                                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'} 
                                ${currentTheme.animation.transition} typing-animation`}>
                                Shivam's Vault
                                <span className={`inline-block ml-2 transform hover:scale-110 ${currentTheme.animation.transition}`}>🛅</span>
                            </h1>
                            <p className={`text-sm sm:text-base text-${currentTheme.colors.accent}
                                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}
                                ${currentTheme.animation.transition} delay-200 animate-blink`}>
                                By Shivam Karn's Creations
                                <span className="inline-block ml-1 animate-bounce">🐧🍫</span>
                            </p>
                        </div>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8">
                        {/* Theme selector */}
                        <div className="relative">
                            <button 
                                onClick={toggleThemeMenu}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full 
                                    bg-${currentTheme.colors.buttonBg} text-white
                                    ${currentTheme.animation.transition} ${currentTheme.animation.button}`}
                            >
                                <span>{currentTheme.icon}</span>
                                <span>{currentTheme.name}</span>
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"></path>
                                </svg>
                            </button>

                            {/* Theme dropdown */}
                            {isThemeMenuOpen && (
                                <div className={`absolute right-0 mt-2 w-48 py-2 ${currentTheme.colors.cardBg} 
                                    rounded-lg shadow-xl z-20 border border-${currentTheme.colors.accent}/20`}>
                                    {Object.values(themes).map((theme) => (
                                        <button
                                            key={theme.id}
                                            onClick={() => handleThemeChange(theme.id)}
                                            className={`block w-full text-left px-4 py-2 ${currentTheme.animation.transition}
                                                ${currentTheme.id === theme.id ? `bg-${currentTheme.colors.accent}/20` : 'hover:bg-gray-100/20'}
                                                ${currentTheme.colors.text}`}
                                        >
                                            <span className="flex items-center gap-2">
                                                <span>{theme.icon}</span>
                                                <span>{theme.name}</span>
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {[ 
                            { to: "/", label: "Home" },
                            { to: "/about", label: "About" }
                        ].map((link) => (
                            <Link
                                key={link.label}
                                to={link.to}
                                className={`relative text-${currentTheme.colors.accent} hover:text-${currentTheme.colors.secondary} text-lg ${currentTheme.animation.transition}
                                    after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-${currentTheme.colors.accent}
                                    after:left-0 after:-bottom-1 after:transition-all after:duration-300
                                    hover:after:w-full`}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <Link
                            to="/contact"
                            className={`bg-gradient-to-r ${currentTheme.colors.primary} text-white 
                                px-6 py-2 rounded-full ${currentTheme.animation.transition}
                                hover:shadow-lg hover:shadow-${currentTheme.colors.secondary}/25 ${currentTheme.animation.button}
                                active:scale-95`}
                        >
                            Contact
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden relative z-50 w-10 h-10 focus:outline-none bg-opacity-90 
                            hover:bg-opacity-100 rounded-lg backdrop-blur-sm"
                        aria-label="Toggle Menu"
                    >
                        <div className="absolute inset-0 bg-gray-900/10 rounded-lg backdrop-blur-sm"></div>
                        <span className={`block absolute left-1/2 -translate-x-1/2 h-0.5 w-6 
                            bg-current transform ${currentTheme.animation.transition} 
                            ${isMenuOpen ? 'rotate-45 translate-y-0 top-5' : 'top-3'}`}>
                        </span>
                        <span className={`block absolute left-1/2 -translate-x-1/2 top-5 h-0.5 w-6 
                            bg-current transform ${currentTheme.animation.transition} 
                            ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}>
                        </span>
                        <span className={`block absolute left-1/2 -translate-x-1/2 h-0.5 w-6 
                            bg-current transform ${currentTheme.animation.transition} 
                            ${isMenuOpen ? '-rotate-45 translate-y-0 top-5' : 'top-7'}`}>
                        </span>
                    </button>
                </div>
            </nav>

            {/* Mobile Menu */}
            <div 
                className={`fixed inset-0 bg-gradient-to-b ${currentTheme.colors.navbarBg} backdrop-blur-lg
                    transform ${currentTheme.animation.transition} md:hidden
                    ${isMenuOpen ? 'menu-enter-active' : 'menu-exit-active'}`}
                style={{
                    transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
            >
                <div className={`flex flex-col items-center justify-center h-full gap-8 pb-20
                    ${isMenuOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
                    transition-all duration-500 delay-100 transform`}
                >
                    {/* Mobile theme selector */}
                    <div className="flex flex-col items-center gap-4">
                        <h3 className={`text-${currentTheme.colors.accent} text-lg font-medium`}>Choose Theme</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {Object.values(themes).map((theme) => (
                                <button
                                    key={theme.id}
                                    onClick={() => handleThemeChange(theme.id)}
                                    className={`flex flex-col items-center px-6 py-4 rounded-lg ${currentTheme.animation.transition}
                                        ${currentTheme.id === theme.id ? `bg-${currentTheme.colors.accent}/20 ring-2 ring-${currentTheme.colors.accent}` : `bg-${currentTheme.colors.cardBg} opacity-80`}
                                        ${currentTheme.colors.text}`}
                                >
                                    <span className="text-3xl mb-2">{theme.icon}</span>
                                    <span>{theme.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {[ 
                        { to: "/", label: "Home", icon: "🏠", delay: 0 },
                        { to: "/about", label: "About", icon: "ℹ️", delay: 100 },
                        { to: "/contact", label: "Contact", icon: "📧", delay: 200 }
                    ].map((link) => (
                        <Link
                            key={link.label}
                            to={link.to}
                            onClick={() => setIsMenuOpen(false)}
                            className={`flex items-center gap-3 px-6 py-3 rounded-lg w-64
                                ${currentTheme.animation.transition} ${currentTheme.animation.button}
                                bg-${currentTheme.colors.cardBg}/80 backdrop-blur-sm
                                hover:bg-${currentTheme.colors.accent}/20
                                hover:scale-105 active:scale-95
                                border border-${currentTheme.colors.accent}/30
                                shadow-lg shadow-${currentTheme.colors.accent}/10
                                transform transition-all duration-500
                                ${isMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}
                            style={{ 
                                transitionDelay: isMenuOpen ? `${link.delay}ms` : '0ms'
                            }}
                        >
                            <span className="text-2xl filter drop-shadow-md">{link.icon}</span>
                            <span className={`text-xl font-medium text-${currentTheme.colors.headerText}
                                drop-shadow-sm`}>
                                {link.label}
                            </span>
                            <span className="ml-auto text-lg opacity-75 group-hover:opacity-100 
                                transform group-hover:translate-x-1 transition-all">
                                →
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Navbar;
