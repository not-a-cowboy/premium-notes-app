import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export function ThemePicker({ compact = false }) {
    const { theme, setTheme } = useTheme();

    const themes = [
        { id: 'default', name: 'Sakura', emoji: '🌸', color: 'linear-gradient(135deg, #FFB6C1, #E0FFFF)' },
        { id: 'midnight', name: 'Midnight', emoji: '🌌', color: '#1E1B4B' },
        { id: 'soft-paper', name: 'Journal', emoji: '📜', color: '#F5F5F4' },
    ];

    return (
        <div className={`grid ${compact ? 'grid-cols-1 gap-2' : 'grid-cols-3 gap-3'}`}>
            {themes.map((t) => (
                <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={`
                        relative group flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-200 border
                        ${theme === t.id
                            ? 'bg-white shadow-md border-gta-purple scale-105'
                            : 'bg-white/40 border-white/50 hover:bg-white/60 hover:scale-102'
                        }
                    `}
                >
                    <div
                        className="w-10 h-10 rounded-full mb-2 flex items-center justify-center text-xl shadow-sm"
                        style={{ background: t.color.includes('gradient') ? t.color : t.color }}
                    >
                        {t.emoji}
                    </div>
                    <span className={`text-xs font-medium ${theme === t.id ? 'text-gray-900' : 'text-gray-600'}`}>
                        {t.name}
                    </span>

                    {theme === t.id && (
                        <div className="absolute top-2 right-2 text-gta-purple">
                            <Check size={14} />
                        </div>
                    )}
                </button>
            ))}
        </div>
    );
}
