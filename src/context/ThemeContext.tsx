import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Theme } from '../types';

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}

interface ThemeProviderProps {
    children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
    const [theme, setTheme] = useState<Theme>(() => {
        return (localStorage.getItem('premium-notes-theme') as Theme) || 'default';
    });

    useEffect(() => {
        const root = document.body;
        // Remove all previous theme classes
        root.classList.forEach(cls => {
            if (cls.startsWith('theme-')) {
                root.classList.remove(cls);
            }
        });

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
