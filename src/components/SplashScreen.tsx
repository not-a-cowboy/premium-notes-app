import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface SplashScreenProps {
    onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + 2; // Fast boot
            });
        }, 30);
        return () => clearInterval(interval);
    }, []);

    return (
        <motion.div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-m-black overflow-hidden"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 3.5, ease: "easeInOut" }}
            onAnimationComplete={onComplete}
        >
            {/* Background Grid */}
            <div className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                    backgroundImage: "linear-gradient(to right, #2a2a2a 1px, transparent 1px), linear-gradient(to bottom, #2a2a2a 1px, transparent 1px)",
                    backgroundSize: "40px 40px"
                }}
            />

            <div className="relative z-10 flex flex-col items-center w-full max-w-md px-8">
                {/* Logo / Symbol */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-24 h-24 border-4 border-m-white mb-8 relative flex items-center justify-center transform rotate-45"
                >
                    <div className="w-16 h-16 border-2 border-m-yellow transform -rotate-45" />
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-m-red" />
                    <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-m-blue" />
                </motion.div>

                {/* Text Logo */}
                <motion.h1
                    className="text-6xl font-black tracking-tighter text-m-white mb-2 uppercase font-display"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    Jot<span className="text-m-yellow">.</span>IX
                </motion.h1>

                <motion.p
                    className="text-m-yellow font-technical text-sm tracking-widest mb-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    SYSTEM_BOOT_SEQUENCE // v4.2.0
                </motion.p>

                {/* Loading Bar */}
                <div className="w-full h-2 bg-m-gray relative overflow-hidden">
                    <motion.div
                        className="h-full bg-m-yellow"
                        initial={{ width: "0%" }}
                        animate={{ width: `${progress}%` }}
                    />
                </div>

                <div className="flex justify-between w-full mt-2 font-technical text-xs text-gray-500">
                    <span>LOADING_ASSETS...</span>
                    <span>{progress}%</span>
                </div>
            </div>
        </motion.div>
    );
}
