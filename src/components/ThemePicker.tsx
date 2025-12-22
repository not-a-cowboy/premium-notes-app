import { useTheme } from '../context/ThemeContext';
import { Power } from 'lucide-react';

export function ThemePicker({ compact = false }) {
    const { theme, setTheme } = useTheme();

    const themes: { id: import('../types').Theme; name: string; code: string; color: string }[] = [
        { id: 'default', name: 'MARATHON_MAIN', code: 'SYS_01', color: '#CCFF00' },
        { id: 'sakura', name: 'NEON_PINK_OVR', code: 'P_VIBE', color: '#FF1493' },
        { id: 'toxic', name: 'TOXIC_MODE', code: 'HAZARD', color: '#39FF14' },
        { id: 'nuclear', name: 'NUCLEAR_MATTER', code: 'FUSION', color: '#D00000' },
        { id: 'entropy', name: 'ENTROPY_DEIMOS', code: 'CHAOS', color: '#A7C957' },
    ];

    return (
        <div className={`grid ${compact ? 'grid-cols-1 gap-2' : 'grid-cols-2 gap-2'}`}>
            {themes.map((t) => (
                <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={`
                        relative flex items-center gap-3 p-3 transition-all duration-200 border group
                        ${theme === t.id
                            ? 'bg-m-gray/30 border-m-yellow text-m-white'
                            : 'bg-transparent border-gray-800 text-gray-500 hover:border-gray-600 hover:text-gray-300'
                        }
                    `}
                >
                    <div className="relative">
                        <div
                            className={`w-3 h-3 ${theme === t.id ? 'animate-pulse' : ''}`}
                            style={{ backgroundColor: t.color }}
                        />
                        {/* Selection Marker */}
                        {theme === t.id && (
                            <div className="absolute -inset-1 border border-white opacity-50" />
                        )}
                    </div>

                    <div className="flex flex-col items-start text-left">
                        <span className={`text-[10px] font-black uppercase tracking-wider leading-none mb-1 ${theme === t.id ? 'text-m-yellow' : 'text-gray-500 group-hover:text-gray-400'}`}>
                            {t.code}
                        </span>
                        <span className="text-[9px] font-mono leading-none">
                            {t.name}
                        </span>
                    </div>

                    {theme === t.id && (
                        <div className="ml-auto text-m-yellow">
                            <Power size={14} />
                        </div>
                    )}
                </button>
            ))}
        </div>
    );
}
