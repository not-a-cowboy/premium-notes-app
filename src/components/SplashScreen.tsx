import { motion } from 'framer-motion';
import logo from '../assets/new_icon.png';

interface SplashScreenProps {
    onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
    return (
        <motion.div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center"
            style={{
                background: 'var(--bg-primary)',
                backgroundSize: '400% 400%',
                // Keep animation only if keyframes are globally defined and desired
                animation: 'gradient-xy 15s ease infinite'
            }}
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.8, delay: 3, ease: "easeInOut" }}
            onAnimationComplete={onComplete}
        >
            <motion.div
                className="relative"
                initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
            >
                <motion.img
                    src={logo}
                    alt="Jot It Down Logo"
                    className="w-32 h-32 drop-shadow-2xl"
                    animate={{
                        y: [0, -10, 0],
                        filter: ["brightness(1)", "brightness(1.2)", "brightness(1)"]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            </motion.div>

            <motion.h1
                className="text-4xl font-bold mt-8 tracking-tight drop-shadow-lg"
                style={{ color: 'var(--text-primary)' }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            >
                Jot It Down
            </motion.h1>
        </motion.div>
    );
}
