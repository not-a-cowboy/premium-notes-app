import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('premium-notes-theme') || 'default';
    });

    useEffect(() => {
        const root = document.body;
        // Remove all known theme classes
        root.classList.remove('theme-midnight', 'theme-soft-paper');

        // Add current theme class (unless default, which corresponds to :root vars)
        if (theme !== 'default') {
            root.classList.add(`theme-${theme}`);
        }

        localStorage.setItem('premium-notes-theme', theme);
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}
