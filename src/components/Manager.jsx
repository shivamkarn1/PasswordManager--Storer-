import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { useTheme } from './ThemeContext';

const Manager = () => {
    const ref = useRef();
    const passwordRef = useRef();
    const fileInputRef = useRef();
    const [form, setForm] = useState({ id: '', site: "", username: "", password: "" });
    const [passwordArray, setPasswordArray] = useState([]);
    const [editIndex, setEditIndex] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const { currentTheme } = useTheme();
    const [visibilitySettings, setVisibilitySettings] = useState({
        site: true,
        username: true,
        password: false
    });
    const [isMobile, setIsMobile] = useState(false);
    const [iconsLoaded, setIconsLoaded] = useState(false);
    const [copyIconsLoaded, setCopyIconsLoaded] = useState(false);

    useEffect(() => {
        const passwords = localStorage.getItem("passwords");
        if (passwords) {
            setPasswordArray(JSON.parse(passwords));
        }
    }, []);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        // Check if lord-icon element is defined
        if (customElements.get('lord-icon')) {
            setIconsLoaded(true);
        } else {
            // Wait for custom element to be defined
            customElements.whenDefined('lord-icon').then(() => {
                setIconsLoaded(true);
            });
        }
    }, []);

    useEffect(() => {
        const checkCopyIcon = async () => {
            try {
                const response = await fetch('https://cdn.lordicon.com/wmwqvixp.json');
                if (response.ok) {
                    setCopyIconsLoaded(true);
                }
            } catch (error) {
                console.warn('Copy icon failed to load:', error);
            }
        };
        checkCopyIcon();
    }, []);

    const exportPasswords = () => {
        if (passwordArray.length === 0) {
            toast.warning('No passwords to export!', {
                description: 'Add some passwords first',
                duration: 3000
            });
            return;
        }

        try {
            const date = new Date();
            const timestamp = date.toISOString().split('T')[0];
            const dataStr = JSON.stringify(passwordArray, null, 2);
            const blob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const downloadLink = document.createElement('a');
            downloadLink.href = url;
            downloadLink.download = `passwords_backup_${timestamp}.json`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            URL.revokeObjectURL(url);
            toast.success('Backup downloaded successfully!', {
                description: 'Your passwords have been exported',
                icon: '💾',
                duration: 3000
            });
        } catch (error) {
            console.error('Export failed:', error);
            toast.error('Failed to export passwords. Please try again.', {
                position: "top-center",
                autoClose: 3000
            });
        }
    };

    const importPasswords = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target.result;
                const importedData = JSON.parse(content);
                if (!Array.isArray(importedData)) {
                    throw new Error('Invalid data format: Expected an array');
                }
                const isValid = importedData.every(item =>
                    typeof item === 'object' &&
                    'site' in item &&
                    'username' in item &&
                    'password' in item
                );
                if (!isValid) {
                    throw new Error('Invalid data structure: Missing required fields');
                }
                const validatedData = importedData.map(item => {
                    if (!item.id) {
                        return { ...item, id: uuidv4() };
                    }
                    return item;
                });
                const updatedArray = [...passwordArray, ...validatedData];
                setPasswordArray(updatedArray);
                localStorage.setItem("passwords", JSON.stringify(updatedArray));
                toast.success('Passwords imported successfully!', {
                    description: `${validatedData.length} passwords have been imported`,
                    icon: '🎉',
                    duration: 3000
                });
            } catch (error) {
                console.error('Import failed:', error);
                toast.error(`Import failed: ${error.message}. Please check your file format.`, {
                    position: "top-center",
                    autoClose: 5000
                });
            }
        };
        reader.onerror = () => {
            toast.error('Error reading file. Please try again.', {
                position: "top-center",
                autoClose: 3000
            });
        };
        reader.readAsText(file);
        event.target.value = null;
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    const showPassword = () => {
        if (ref.current.src.includes("icons/hide.png")) {
            ref.current.src = "icons/show.jpg";
            passwordRef.current.type = "password";
        } else {
            ref.current.src = "icons/hide.png";
            passwordRef.current.type = "text";
        }
    };

    const copyToClipboard = async (text) => {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
                toast.success('Copied to clipboard!', {
                    description: 'Content has been copied',
                    icon: '📋',
                    duration: 2000
                });
                return;
            }
            const textArea = document.createElement("textarea");
            textArea.value = text;
            textArea.style.position = "fixed";
            textArea.style.left = "-999999px";
            textArea.style.top = "-999999px";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                document.execCommand('copy');
                textArea.remove();
                toast.success('Copied to clipboard!', {
                    description: 'Content has been copied',
                    icon: '📋',
                    duration: 2000
                });
            } catch (error) {
                console.error('Fallback copy failed:', error);
                textArea.remove();
                throw error;
            }
        } catch (err) {
            console.error('Copy failed:', err);
            toast.error('Failed to copy. Please try again.', {
                position: "top-center",
                autoClose: 3000
            });
        }
    };

    const savePassword = () => {
        if (!form.site || !form.username || !form.password) {
            toast.warning('Please fill all fields!', {
                description: 'All fields are required',
                icon: '🤨',
                duration: 3000
            });
            return;
        }

        if (isEditing && editIndex !== null) {
            const updatedArray = [...passwordArray];
            updatedArray[editIndex] = form;
            setPasswordArray(updatedArray);
            localStorage.setItem("passwords", JSON.stringify(updatedArray));
            setIsEditing(false);
            setEditIndex(null);
            toast.success('Password updated successfully!', {
                description: 'Your changes have been saved',
                icon: '✨',
                duration: 1500
            });
        } else {
            const newPasswordEntry = { ...form, id: uuidv4() };
            const updatedArray = [...passwordArray, newPasswordEntry];
            setPasswordArray(updatedArray);
            localStorage.setItem("passwords", JSON.stringify(updatedArray));
            toast.success('Password saved successfully!', {
                description: 'New password has been added',
                icon: '🔒',
                duration: 1500
            });
        }
        setForm({ id: '', site: "", username: "", password: "" });
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleEdit = (index) => {
        setIsEditing(true);
        setEditIndex(index);
        setForm(passwordArray[index]);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        toast.info('Editing password', {
            description: 'Make your changes and save',
            icon: '✏️',
            duration: 3000
        });
    };

    const handleDelete = (index, site) => {
        toast.warning('Confirm deletion', {
            description: `Are you sure you want to delete ${site}?`,
            icon: '🗑️',
            action: {
                label: 'Delete',
                onClick: () => {
                    const newPasswordArray = passwordArray.filter((_, i) => i !== index);
                    setPasswordArray(newPasswordArray);
                    localStorage.setItem("passwords", JSON.stringify(newPasswordArray));
                    toast.success('Password deleted!', {
                        description: 'The password has been removed',
                        icon: '🗑️',
                        duration: 2000
                    });
                }
            },
            cancel: {
                label: 'Cancel',
                onClick: () => {}
            }
        });
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            savePassword();
        }
    };

    const toggleVisibility = (field) => {
        setVisibilitySettings(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const maskText = (text) => '•'.repeat(text.length);

    const getVisibilityIcon = (isVisible) => isVisible ? 
        "https://cdn.lordicon.com/vfczflna.json" : // Eye open icon
        "https://cdn.lordicon.com/xqgancly.json";  // Eye closed icon

    const handleIconError = (e) => {
        console.warn('Icon failed to load:', e);
        // Optionally replace with a fallback icon
        e.target.innerHTML = '👁️'; // Or any other fallback content
    };

    return (
        <div className={`min-h-screen flex flex-col ${currentTheme.colors.background} px-4 sm:px-6`}>
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme={currentTheme.id === 'cyberNight' ? 'dark' : 'colored'}
            />
            
            {currentTheme.id === 'default' && (
                <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
                    <div className={`absolute left-0 right-0 top-0 -z-10 m-auto h-64 w-64 rounded-full bg-${currentTheme.colors.secondary} opacity-20 blur-lg`}></div>
                </div>
            )}
            
            {currentTheme.id === 'frostbyte' && (
                <div className="absolute inset-0 -z-10 h-full w-full bg-slate-100 overflow-hidden">
                    <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-96 w-96 rounded-full bg-blue-400 opacity-10 blur-3xl"></div>
                    
                    {/* Snowflakes */}
                    {[...Array(20)].map((_, i) => (
                        <div 
                            key={`snowflake-${i}`} 
                            className="absolute text-blue-200 animate-snowfall"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `-20px`,
                                fontSize: `${Math.random() * 15 + 10}px`,
                                opacity: Math.random() * 0.5 + 0.5,
                                '--delay': `${Math.random() * 8}s`
                            }}
                        >
                            ❄️
                        </div>
                    ))}
                    
                    {/* Floating snow emoji */}
                    {[...Array(5)].map((_, i) => (
                        <div 
                            key={`snow-${i}`}
                            className="absolute text-white animate-snow-float"
                            style={{
                                left: `${Math.random() * 80 + 10}%`,
                                top: `${Math.random() * 80 + 10}%`,
                                fontSize: `${Math.random() * 15 + 20}px`,
                                opacity: 0.6,
                                '--delay': `${Math.random() * 5}s`
                            }}
                        >
                            {['☃️', '❄️', '⛄'][Math.floor(Math.random() * 3)]}
                        </div>
                    ))}
                </div>
            )}

            {currentTheme.id === 'raining' && (
                <div className="absolute inset-0 -z-10 h-full w-full bg-slate-200 overflow-hidden">
                    <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-96 w-96 rounded-full bg-blue-300 opacity-10 blur-3xl"></div>
                    
                    {/* Thunder flash effect */}
                    <div 
                        className="absolute inset-0 bg-yellow-400 opacity-0 animate-thunder"
                        style={{ '--delay': '3s' }}
                    ></div>
                    <div 
                        className="absolute inset-0 bg-yellow-400 opacity-0 animate-thunder"
                        style={{ '--delay': '9s' }}
                    ></div>
                    
                    {/* Clouds */}
                    {[...Array(6)].map((_, i) => (
                        <div 
                            key={`cloud-${i}`}
                            className="absolute text-gray-400 animate-float"
                            style={{
                                left: `${Math.random() * 80 + 10}%`,
                                top: `${Math.random() * 30 + 5}%`,
                                fontSize: `${Math.random() * 20 + 25}px`,
                                opacity: 0.7,
                                '--delay': `${Math.random() * 5}s`
                            }}
                        >
                            ☁️
                        </div>
                    ))}
                    
                    {/* Rain drops */}
                    {[...Array(20)].map((_, i) => (
                        <div 
                            key={`rain-${i}`}
                            className="absolute animate-rain-fall"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `-20px`,
                                fontSize: `${Math.random() * 10 + 10}px`,
                                opacity: Math.random() * 0.3 + 0.4,
                                '--delay': `${Math.random() * 5}s`
                            }}
                        >
                            {['🌧️', '💧', '💦'][Math.floor(Math.random() * 3)]}
                        </div>
                    ))}
                    
                    {/* Thunder cloud */}
                    <div 
                        className="absolute text-gray-600 top-[15%] left-[20%]"
                        style={{ fontSize: '30px' }}
                    >
                        ⛈️
                    </div>
                </div>
            )}

            {currentTheme.id === 'redRoses' && (
                <div className="absolute inset-0 -z-10 h-full w-full bg-red-50 overflow-hidden">
                    <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-96 w-96 rounded-full bg-red-300 opacity-20 blur-3xl"></div>
                    
                    {/* Animated hearts */}
                    {[...Array(15)].map((_, i) => (
                        <div 
                            key={`heart-${i}`}
                            className="absolute animate-heart-float"
                            style={{
                                left: `${Math.random() * 90 + 5}%`,
                                top: `${Math.random() * 80 + 10}%`,
                                fontSize: `${Math.random() * 15 + 15}px`,
                                opacity: 0.7,
                                '--delay': `${Math.random() * 6}s`
                            }}
                        >
                            {['❤️', '🤍', '💖', '💕', '💓'][Math.floor(Math.random() * 5)]}
                        </div>
                    ))}
                    
                    {/* Rose petals */}
                    {[...Array(10)].map((_, i) => (
                        <div 
                            key={`rose-${i}`}
                            className="absolute animate-petal-float"
                            style={{
                                left: `${Math.random() * 90 + 5}%`,
                                top: `${Math.random() * 80 + 10}%`,
                                fontSize: `${Math.random() * 12 + 14}px`,
                                opacity: 0.6,
                                '--delay': `${Math.random() * 8}s`
                            }}
                        >
                            🌹
                        </div>
                    ))}
                </div>
            )}

            {currentTheme.id === 'redGold' && (
                <div className="absolute inset-0 -z-10 h-full w-full bg-gradient-to-br from-red-900/5 to-yellow-700/10 overflow-hidden">
                    <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-96 w-96 rounded-full bg-yellow-500 opacity-10 blur-3xl"></div>
                    
                    {/* Gold shimmer overlay */}
                    <div className="absolute inset-0 gold-shimmer"></div>
                    
                    {/* Bouncing crown icons */}
                    {[...Array(6)].map((_, i) => (
                        <div 
                            key={`crown-${i}`}
                            className="absolute text-yellow-500 animate-crown-bounce"
                            style={{
                                top: `${10 + (Math.random() * 80)}%`,
                                left: `${10 + (Math.random() * 80)}%`,
                                fontSize: `${Math.random() * 20 + 20}px`,
                                opacity: 0.7,
                                animationDelay: `${Math.random() * 3}s`
                            }}
                        >
                            👑
                        </div>
                    ))}
                    
                    {/* Royal symbols */}
                    {[...Array(5)].map((_, i) => (
                        <div 
                            key={`royal-${i}`}
                            className="absolute animate-float"
                            style={{
                                top: `${10 + (Math.random() * 80)}%`,
                                left: `${10 + (Math.random() * 80)}%`,
                                fontSize: `${Math.random() * 15 + 15}px`,
                                opacity: 0.6,
                                '--delay': `${Math.random() * 5}s`
                            }}
                        >
                            {['💎', '🏆', '⚜️', '🔮', '💰'][Math.floor(Math.random() * 5)]}
                        </div>
                    ))}
                </div>
            )}
            
            {currentTheme.id === 'sunsetBliss' && (
                <div className="absolute inset-0 -z-10 h-full w-full bg-amber-50 overflow-hidden">
                    <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-96 w-96 rounded-full bg-gradient-to-r from-orange-400 to-pink-400 opacity-20 blur-3xl"></div>
                    
                    {/* Sun */}
                    <div className="absolute top-[10%] right-[15%] text-4xl animate-float" style={{ '--delay': '1s' }}>
                        🌞
                    </div>
                    
                    {/* Birds */}
                    {[...Array(6)].map((_, i) => (
                        <div 
                            key={`bird-${i}`}
                            className="absolute animate-float"
                            style={{
                                top: `${Math.random() * 30 + 5}%`,
                                left: `${Math.random() * 80 + 10}%`,
                                fontSize: `${Math.random() * 10 + 16}px`,
                                opacity: 0.8,
                                '--delay': `${Math.random() * 5}s`
                            }}
                        >
                            🦅
                        </div>
                    ))}
                    
                    {/* Sunset-colored clouds */}
                    {[...Array(4)].map((_, i) => (
                        <div 
                            key={`sunset-cloud-${i}`}
                            className="absolute animate-float"
                            style={{
                                top: `${Math.random() * 40 + 10}%`,
                                left: `${Math.random() * 80 + 10}%`,
                                fontSize: `${Math.random() * 20 + 25}px`,
                                opacity: 0.7,
                                '--delay': `${Math.random() * 6}s`,
                                filter: 'hue-rotate(340deg) saturate(1.5)'
                            }}
                        >
                            ☁️
                        </div>
                    ))}
                    
                    {/* Palm trees at the bottom */}
                    {[...Array(3)].map((_, i) => (
                        <div 
                            key={`palm-${i}`}
                            className="absolute bottom-[5%] animate-float"
                            style={{
                                left: `${i * 30 + 15}%`,
                                fontSize: '32px',
                                '--delay': `${i * 0.8}s`
                            }}
                        >
                            🌴
                        </div>
                    ))}

                    <div className="absolute left-0 bottom-0 -z-10 w-full h-48 bg-gradient-to-t from-orange-200/30 to-transparent"></div>
                </div>
            )}
            
            {currentTheme.id === 'cyberNight' && (
                <>
                <div className="absolute inset-0 -z-10 h-full w-full bg-gray-900">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
                    <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-96 w-96 rounded-full bg-teal-900 opacity-20 blur-3xl"></div>
                    
                    {/* Digital symbols floating around */}
                    {[...Array(15)].map((_, i) => (
                        <div 
                            key={`cyber-${i}`}
                            className="absolute text-teal-500/60 animate-float"
                            style={{
                                top: `${Math.random() * 90 + 5}%`,
                                left: `${Math.random() * 90 + 5}%`,
                                fontSize: `${Math.random() * 14 + 12}px`,
                                '--delay': `${Math.random() * 10}s`
                            }}
                        >
                            {['🔒', '🔐', '💻', '⚡', '📱', '🔍', '📊', '🌐'][Math.floor(Math.random() * 8)]}
                        </div>
                    ))}
                    
                    <div className="absolute inset-0 overflow-hidden opacity-10">
                        {[...Array(10)].map((_, i) => (
                            <div 
                                key={i} 
                                className="absolute w-px h-full bg-teal-400 animate-pulse"
                                style={{
                                    left: `${i * 10}%`,
                                    animationDelay: `${i * 0.2}s`,
                                    opacity: 0.3 + (Math.random() * 0.7)
                                }}
                            ></div>
                        ))}
                    </div>
                </div>
                </>
            )}

            <main className={`flex-1 max-w-7xl mx-auto w-full px-4 py-16 ${currentTheme.colors.text}`}>
                <header className={`text-center mb-4 sm:mb-8 ${currentTheme.animation.enter} relative pt-8 sm:pt-12`}>
                    {/* Add floating emojis based on theme */}
                    {currentTheme.id === 'default' && (
                        <>
                            <span className="absolute -top-10 left-1/4 text-2xl animate-float" style={{ '--delay': '0s' }}>🔐</span>
                            <span className="absolute -top-8 right-1/4 text-2xl animate-float" style={{ '--delay': '1.5s' }}>🗝️</span>
                        </>
                    )}
                    
                    {currentTheme.id === 'frostbyte' && (
                        <>
                            <span className="absolute -top-12 left-1/3 text-3xl animate-snow-float" style={{ '--delay': '0s' }}>❄️</span>
                            <span className="absolute -top-10 right-1/3 text-2xl animate-snow-float" style={{ '--delay': '1s' }}>⛄</span>
                        </>
                    )}
                    
                    {currentTheme.id === 'redRoses' && (
                        <>
                            <span className="absolute -top-10 left-1/4 text-2xl animate-heart-float" style={{ '--delay': '0s' }}>🌹</span>
                            <span className="absolute -top-12 right-1/4 text-2xl animate-heart-float" style={{ '--delay': '1.2s' }}>❤️</span>
                        </>
                    )}
                    
                    {currentTheme.id === 'raining' && (
                        <>
                            <span className="absolute -top-16 left-1/3 text-3xl animate-float" style={{ '--delay': '0s' }}>⛈️</span>
                            <span className="absolute -top-10 right-1/3 text-2xl animate-float" style={{ '--delay': '1s' }}>☔</span>
                        </>
                    )}

                    <h1 className={`text-2xl sm:text-3xl md:text-4xl font-bold text-${currentTheme.colors.headerText} mb-2 
                        ${currentTheme.id === 'cyberNight' ? 'typewriter' : ''}`}>
                        YOUR PASSWORD's
                        {/* Add theme-specific emoji */}
                        <span className={`inline-block ml-2 ${currentTheme.animation.button}`}>
                            {currentTheme.id === 'default' && '🔐'}
                            {currentTheme.id === 'frostbyte' && '🧊'}
                            {currentTheme.id === 'redRoses' && '🌹'}
                            {currentTheme.id === 'raining' && '🌧️'}
                            {currentTheme.id === 'redGold' && '👑'}
                            {currentTheme.id === 'cyberNight' && '🔒'}
                            {currentTheme.id === 'sunsetBliss' && '🌅'}
                        </span>
                    </h1>

                    {/* Update the subheading with theme-specific emojis */}
                    <p className={`text-lg text-${currentTheme.colors.secondaryText}`}>
                        Your Secure Password Vault 
                        <span className={`inline-block mx-1 ${currentTheme.animation.button}`}>
                            {currentTheme.id === 'default' && '💼'}
                            {currentTheme.id === 'frostbyte' && '❄️'}
                            {currentTheme.id === 'redRoses' && '💝'}
                            {currentTheme.id === 'raining' && '☔'}
                            {currentTheme.id === 'redGold' && '💎'}
                            {currentTheme.id === 'cyberNight' && '💻'}
                            {currentTheme.id === 'sunsetBliss' && '🌴'}
                        </span>
                        Forget to Remember Now
                        <span className="inline-block animate-bounce ml-1">
                            {currentTheme.id === 'default' && '😎'}
                            {currentTheme.id === 'frostbyte' && '🥶'}
                            {currentTheme.id === 'redRoses' && '💖'}
                            {currentTheme.id === 'raining' && '💦'}
                            {currentTheme.id === 'redGold' && '✨'}
                            {currentTheme.id === 'cyberNight' && '🤖'}
                            {currentTheme.id === 'sunsetBliss' && '😎'}
                        </span>
                    </p>
                    
                    <div className={`flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 mt-4 ${currentTheme.animation.enter}`}>
                        <button
                            onClick={exportPasswords}
                            className={`flex items-center gap-2 px-5 py-2 ${currentTheme.colors.buttonBg} text-white 
                                rounded-lg ${currentTheme.colors.buttonHover} ${currentTheme.animation.transition} 
                                ${currentTheme.animation.button} shadow-md`}
                        >
                            <span>⬇️ Download Backup</span>
                        </button>
                        
                        <button
                            onClick={triggerFileInput}
                            className={`flex items-center gap-2 px-5 py-2 bg-${currentTheme.colors.secondary} text-white 
                                rounded-lg hover:bg-${currentTheme.colors.secondary}/90 ${currentTheme.animation.transition} 
                                ${currentTheme.animation.button} shadow-md`}
                        >
                            <span>⬆️ Import Passwords</span>
                        </button>
                        
                        <input 
                            ref={fileInputRef}
                            type="file" 
                            accept=".json"
                            className="hidden"
                            onChange={importPasswords}
                        />
                    </div>
                </header>

                <div className={`${currentTheme.colors.cardBg} rounded-xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-8 ${currentTheme.animation.enter} relative`}>
                    {/* Add floating theme-specific emojis */}
                    {currentTheme.id === 'redRoses' && (
                        <>
                            <span className="absolute -top-6 right-10 text-xl animate-heart-float" style={{ '--delay': '0.5s' }}>💖</span>
                            <span className="absolute -bottom-4 left-10 text-xl animate-heart-float" style={{ '--delay': '1.2s' }}>💝</span>
                        </>
                    )}
                    
                    {currentTheme.id === 'cyberNight' && (
                        <>
                            <span className="absolute -top-6 right-10 text-xl animate-float" style={{ '--delay': '0.8s' }}>⚡</span>
                            <span className="absolute -bottom-4 left-10 text-xl animate-float" style={{ '--delay': '1.5s' }}>💻</span>
                        </>
                    )}

                    <div className="flex flex-col gap-4">
                        <input
                            value={form.site}
                            onChange={handleChange}
                            onKeyDown={handleKeyPress}
                            name="site"
                            type="text"
                            placeholder="Platform (e.g.Platform / Website Name 🔑)"
                            className={`w-full p-2 sm:p-3 text-sm sm:text-base border rounded-lg ${currentTheme.colors.borderHover} focus:outline-none`}
                        />
                        
                        <div className="flex flex-col sm:flex-row gap-4">
                            <input
                                value={form.username}
                                onChange={handleChange}
                                onKeyDown={handleKeyPress}
                                name="username"
                                type="text"
                                placeholder="Enter Username or Email 👤"
                                className={`w-full sm:w-1/2 p-2 sm:p-3 text-sm sm:text-base border rounded-lg ${currentTheme.colors.borderHover} focus:outline-none`}
                            />
                            <div className="relative w-full sm:w-1/2">
                                <input
                                    ref={passwordRef}
                                    value={form.password}
                                    onChange={handleChange}
                                    onKeyDown={handleKeyPress}
                                    name="password"
                                    type="password"
                                    placeholder="Password Here..🍨❄️"
                                    className={`w-full p-2 sm:p-3 text-sm sm:text-base border rounded-lg ${currentTheme.colors.borderHover} focus:outline-none`}
                                />
                                <button 
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                    onClick={showPassword}
                                >
                                    <img ref={ref} width={30} src="icons/show.jpg" alt="toggle password" className="opacity-60 hover:opacity-100" />
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <button
                                onClick={savePassword}
                                className={`flex items-center px-6 py-2 ${currentTheme.colors.buttonBg} text-white 
                                    rounded-lg ${currentTheme.colors.buttonHover} ${currentTheme.animation.transition}`}
                            >
                                {isEditing ? 'Update Password' : '➕ADD Password'}
                            </button>
                            
                            {isEditing && (
                                <button
                                    onClick={() => {
                                        setIsEditing(false);
                                        setEditIndex(null);
                                        setForm({ id: '', site: "", username: "", password: "" });
                                    }}
                                    className={`px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 ${currentTheme.animation.transition}`}
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className={`${currentTheme.colors.cardBg} rounded-xl shadow-lg p-4 sm:p-6 ${currentTheme.animation.enter} relative`}>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                        <h2 className={`text-xl sm:text-2xl font-bold text-${currentTheme.colors.headerText} flex items-center gap-2`}>
                            Stored Passwords
                            <span className={`inline-block ${currentTheme.animation.button}`}>
                                {currentTheme.id === 'default' && '🗄️'}
                                {currentTheme.id === 'frostbyte' && '🔒'}
                                {currentTheme.id === 'redRoses' && '💝'}
                                {currentTheme.id === 'raining' && '📁'}
                                {currentTheme.id === 'redGold' && '📜'}
                                {currentTheme.id === 'cyberNight' && '💾'}
                                {currentTheme.id === 'sunsetBliss' && '📂'}
                            </span>
                        </h2>

                        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                            {Object.entries(visibilitySettings).map(([field, isVisible]) => (
                                <button
                                    key={field}
                                    onClick={() => toggleVisibility(field)}
                                    className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm
                                        ${currentTheme.animation.button}
                                        ${isVisible ? 
                                            `bg-${currentTheme.colors.accent}/10 text-${currentTheme.colors.accent}` : 
                                            'bg-gray-100 text-gray-500'}`}
                                >
                                    {iconsLoaded ? (
                                        <lord-icon
                                            src={getVisibilityIcon(isVisible)}
                                            trigger="hover"
                                            style={{ width: '20px', height: '20px' }}
                                            onError={handleIconError}
                                        />
                                    ) : (
                                        <span className="animate-pulse">👁️</span> // Loading fallback
                                    )}
                                    <span className="capitalize text-sm">
                                        {field}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {passwordArray.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">
                            No passwords stored yet 
                            <span className={`inline-block ml-2 ${currentTheme.animation.button}`}>
                                {currentTheme.id === 'default' && '📭'}
                                {currentTheme.id === 'frostbyte' && '❄️'}
                                {currentTheme.id === 'redRoses' && '🌹'}
                                {currentTheme.id === 'raining' && '💧'}
                                {currentTheme.id === 'redGold' && '👑'}
                                {currentTheme.id === 'cyberNight' && '🤖'}
                                {currentTheme.id === 'sunsetBliss' && '🌅'}
                            </span>
                        </p>
                    ) : (
                        <div className="overflow-x-auto -mx-4 sm:mx-0">
                            <table className="w-full table-auto min-w-[640px]">
                                <thead className={`${currentTheme.colors.tableBg} text-white text-sm sm:text-base`}>
                                    <tr>
                                        <th className="py-3 px-4 text-left">Site</th>
                                        <th className="py-3 px-4 text-left">Username</th>
                                        <th className="py-3 px-4 text-left">Password</th>
                                        <th className="py-3 px-4 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm sm:text-base">
                                    {passwordArray.map((item, index) => (
                                        <tr 
                                            key={item.id} 
                                            className={`border-t ${editIndex === index ? 
                                                `bg-${currentTheme.colors.secondary}/10` : 
                                                'hover:bg-gray-50/30'}`}
                                        >
                                            <td className="py-2 sm:py-3 px-3 sm:px-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="truncate">
                                                        {visibilitySettings.site ? item.site : maskText(item.site)}
                                                    </span>
                                                    <button 
                                                        onClick={() => copyToClipboard(item.site)}
                                                        className="text-gray-400 hover:text-gray-600 relative group"
                                                    >
                                                        <lord-icon
                                                            src="https://cdn.lordicon.com/rfbqeber.json"
                                                            trigger="hover"
                                                            colors="primary:#16c72e,secondary:#16c72e"
                                                            style={{ 
                                                                width: '32px', 
                                                                height: '32px',
                                                                transform: 'scale(1)',
                                                                transition: 'all 0.2s ease'
                                                            }}
                                                            className="group-hover:scale-110"
                                                        />
                                                        <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 
                                                            bg-gray-700 text-white text-xs px-2 py-1 rounded-md opacity-0 
                                                            group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                                            Copy to clipboard
                                                        </span>
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="py-2 sm:py-3 px-3 sm:px-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="truncate">
                                                        {visibilitySettings.username ? item.username : maskText(item.username)}
                                                    </span>
                                                    <button 
                                                        onClick={() => copyToClipboard(item.username)}
                                                        className="text-gray-400 hover:text-gray-600 relative group"
                                                    >
                                                        <lord-icon
                                                            src="https://cdn.lordicon.com/rfbqeber.json"
                                                            trigger="hover"
                                                            colors="primary:#16c72e,secondary:#16c72e"
                                                            style={{ 
                                                                width: '32px', 
                                                                height: '32px',
                                                                transform: 'scale(1)',
                                                                transition: 'all 0.2s ease'
                                                            }}
                                                            className="group-hover:scale-110"
                                                        />
                                                        <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 
                                                            bg-gray-700 text-white text-xs px-2 py-1 rounded-md opacity-0 
                                                            group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                                            Copy to clipboard
                                                        </span>
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="py-2 sm:py-3 px-3 sm:px-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="truncate">
                                                        {visibilitySettings.password ? item.password : maskText(item.password)}
                                                    </span>
                                                    <button 
                                                        onClick={() => copyToClipboard(item.password)}
                                                        className="text-gray-400 hover:text-gray-600 relative group"
                                                    >
                                                        <lord-icon
                                                            src="https://cdn.lordicon.com/rfbqeber.json"
                                                            trigger="hover"
                                                            colors="primary:#16c72e,secondary:#16c72e"
                                                            style={{ 
                                                                width: '32px', 
                                                                height: '32px',
                                                                transform: 'scale(1)',
                                                                transition: 'all 0.2s ease'
                                                            }}
                                                            className="group-hover:scale-110"
                                                        />
                                                        <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 
                                                            bg-gray-700 text-white text-xs px-2 py-1 rounded-md opacity-0 
                                                            group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                                            Copy to clipboard
                                                        </span>
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="py-2 sm:py-3 px-3 sm:px-4">
                                                <div className="flex justify-center gap-3">
                                                    <button 
                                                        onClick={() => handleEdit(index)}
                                                        className="text-blue-600 hover:text-blue-800"
                                                    >
                                                        <lord-icon
                                                            src="https://cdn.lordicon.com/puvaffet.json"
                                                            trigger="hover"
                                                            style={{ width: '40px', height: '40px' }}
                                                        />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(index, item.site)}
                                                        className="text-red-600 hover:text-red-800 relative group"
                                                    >
                                                        <lord-icon
                                                            src="https://cdn.lordicon.com/gsqxdxog.json"
                                                            trigger="hover"
                                                            colors="primary:#e53e3e,secondary:#ff6666"
                                                            style={{ 
                                                                width: '32px', 
                                                                height: '32px',
                                                                transform: 'scale(1)',
                                                                transition: 'all 0.2s ease'
                                                            }}
                                                            className="group-hover:scale-110"
                                                        />
                                                        <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 
                                                            bg-red-100 text-red-800 text-xs px-2 py-1 rounded-md opacity-0 
                                                            group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                            Delete
                                                        </span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>

            <footer className={`${currentTheme.colors.footerBg} ${currentTheme.colors.footerText} text-center py-3 sm:py-4 mt-6 sm:mt-8 text-xs sm:text-sm md:text-base`}>
                <p className="text-sm md:text-base">
                    Created with 
                    <span className={`inline-block mx-1 ${currentTheme.animation.button}`}>❤️</span>
                    <span className={`inline-block mx-1 ${currentTheme.animation.button}`}>🤍</span>
                    by Shivam Karn__FOR_YOU
                    <span className={`inline-block ml-1 ${currentTheme.animation.button}`}>
                        {currentTheme.id === 'default' && '👻'}
                        {currentTheme.id === 'frostbyte' && '🧊'}
                        {currentTheme.id === 'redRoses' && '🌹'}
                        {currentTheme.id === 'raining' && '☔'}
                        {currentTheme.id === 'redGold' && '👑'}
                        {currentTheme.id === 'cyberNight' && '🤖'}
                        {currentTheme.id === 'sunsetBliss' && '🌅'}
                    </span>
                </p>
            </footer>
        </div>
    );
};

export default Manager;