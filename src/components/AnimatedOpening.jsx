import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from './ThemeContext';
import { useSpring, animated } from '@react-spring/web';
import gsap from 'gsap';

const AnimatedOpening = ({ onAnimationComplete }) => {
    const { currentTheme } = useTheme();
    const grassRef = useRef(null);
    const cloudsRef = useRef(null);

    // Rain animation (unchanged)
    const raindrops = [...Array(50)].map(() => ({
        left: `${Math.random() * 100}%`,
        animationDuration: `${Math.random() * 1 + 0.5}s`,
        animationDelay: `${Math.random() * 2}s`
    }));

    // Cloud animation (slower for a calmer effect)
    const cloudAnimation = useSpring({
        from: { transform: 'translateX(-100%)' },
        to: { transform: 'translateX(100%)' },
        config: { duration: 30000 },
        loop: true
    });

    // Birds animation (subtler, fewer birds)
    const birdPath = "M 0,0 C 10,-10 20,-10 30,0 C 40,-10 50,-10 60,0";
    const birds = [...Array(3)].map((_, i) => ({
        delay: i * 0.3,
        y: Math.random() * 150 + 50
    }));

    useEffect(() => {
        // Animate grass (subtler scale)
        if (grassRef.current) {
            gsap.to(grassRef.current.children, {
                scaleY: 1.05,
                stagger: 0.1,
                duration: 1.5,
                repeat: -1,
                yoyo: true,
                ease: "power1.inOut"
            });
        }

        const timer = setTimeout(() => {
            if (onAnimationComplete) onAnimationComplete();
        }, 4000);
        return () => clearTimeout(timer);
    }, [onAnimationComplete]);

    return (
        <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 overflow-hidden"
            style={{
                background: 'linear-gradient(to bottom, #0d1117 0%, #1c2526 100%)',
                boxShadow: 'inset 0 0 80px rgba(0,0,0,0.5)'
            }}
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 3.5 }}
        >
            {/* Clouds (darker, more subtle) */}
            <animated.div
                ref={cloudsRef}
                style={{
                    ...cloudAnimation,
                    position: 'absolute',
                    top: '10%',
                    width: '100%',
                    height: '20%'
                }}
            >
                {[...Array(5)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute"
                        style={{
                            left: `${i * 25}%`,
                            width: '120px',
                            height: '50px',
                            background: 'rgba(40, 44, 52, 0.7)',
                            borderRadius: '25px',
                            filter: 'blur(6px)'
                        }}
                    />
                ))}
            </animated.div>

            {/* Birds (darker stroke, subtler motion) */}
            {birds.map((bird, i) => (
                <motion.path
                    key={i}
                    d={birdPath}
                    stroke="#6b7280"
                    fill="none"
                    strokeWidth="1.5"
                    initial={{ x: -100, y: bird.y }}
                    animate={{ x: window.innerWidth + 100 }}
                    transition={{
                        duration: 12,
                        delay: bird.delay,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />
            ))}

            {/* Rain (unchanged) */}
            {raindrops.map((drop, i) => (
                <motion.div
                    key={i}
                    className="absolute w-0.5 h-4 bg-blue-200 opacity-50"
                    style={{
                        left: drop.left,
                        top: '-10px',
                        animation: `falling ${drop.animationDuration} linear ${drop.animationDelay} infinite`
                    }}
                />
            ))}

            {/* Grass field (darker, more subtle) */}
            <div
                ref={grassRef}
                className="absolute bottom-0 w-full h-24 overflow-hidden"
                style={{ perspective: '1200px' }}
            >
                {[...Array(100)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute bottom-0"
                        style={{
                            left: `${i}%`,
                            width: '1.5px',
                            height: '25px',
                            background: 'linear-gradient(to top, #1a2e05, #2d4a0e)',
                            transformOrigin: 'bottom',
                            transform: 'rotateX(-15deg)'
                        }}
                    />
                ))}
            </div>

            {/* Main content */}
            <motion.div className="text-center space-y-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <motion.p 
                        className="text-xl md:text-2xl text-gray-400 font-light mb-2"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        Created By...
                    </motion.p>
                     <motion.h2
      className="text-3xl md:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 tracking-tight"
      style={{
        fontFamily: "'Inter', sans-serif",
        textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
      whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
    >
      Shivam Karn
    </motion.h2>
                </motion.div>

            <div className="relative inline-block">
      <div className="absolute inset-0 bg-gradient-to-r from-gray-700/10 via-blue-900/10 to-teal-900/10 blur-3xl rounded-full opacity-60" />
      <motion.h1
        className="relative text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-900 via-gray-300 to-teal-700 tracking-tight"
        style={{
          fontFamily: "'Inter', sans-serif",
          textShadow: '2px 2px 4px rgba(0,0,0,0.3), 0 0 8px rgba(255,255,255,0.1)',
          letterSpacing: '-0.005em',
        }}
        initial={{ scale: 0.7, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{
          delay: 0.8,
          type: 'spring',
          stiffness: 220,
          damping: 12,
          mass: 0.8,
        }}
        whileHover={{
          scale: 1.02,
          textShadow: '2px 2px 4px rgba(0,0,0,0.3), 0 0 10px rgba(255,255,255,0.2)',
          transition: { duration: 0.2 },
        }}
      >
        Welcome to Shivam's Vault 💼
      </motion.h1>
    </div>

                <motion.div
                    className="h-1 bg-gray-400 mx-auto rounded-full"
                    style={{ boxShadow: '0 0 8px rgba(75, 85, 99, 0.5)' }}
                    initial={{ width: 0 }}
                    animate={{ width: '150px' }}
                    transition={{ delay: 1.2, duration: 0.8 }}
                />

                <div className="flex justify-center mt-4 space-x-2">
                    {[...Array(3)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="w-2.5 h-2.5 bg-gray-300 rounded-full"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                                delay: 1.6 + i * 0.2,
                                type: "spring",
                                stiffness: 300
                            }}
                        />
                    ))}
                </div>
            </motion.div>
        </motion.div>
    );
};

// Add keyframes for rain animation (unchanged)
const style = document.createElement('style');
style.textContent = `
    @keyframes falling {
        0% { transform: translateY(-10px) }
        100% { transform: translateY(100vh) }
    }
`;
document.head.appendChild(style);

export default AnimatedOpening;