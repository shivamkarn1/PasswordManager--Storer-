import React, { createContext, useState, useEffect, useContext } from 'react';
import { themes } from './themes'; 
// Create context
const ThemeContext = createContext();

// Context provider component
export const ThemeProvider = ({ children }) => {
    const [currentTheme, setCurrentTheme] = useState(themes.default);

    // Load theme from localStorage on initial render
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme && themes[savedTheme]) {
            setCurrentTheme(themes[savedTheme]);
        }
    }, []);

    // Update theme and save to localStorage
    const changeTheme = (themeId) => {
        if (themes[themeId]) {
            setCurrentTheme(themes[themeId]);
            localStorage.setItem('theme', themeId);
        }
    };

    return (
        <ThemeContext.Provider value={{ currentTheme, changeTheme, themes }}>
            {children}
        </ThemeContext.Provider>
    );
};

// Custom hook to use theme context
export const useTheme = () => useContext(ThemeContext);