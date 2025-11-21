import { motion } from 'framer-motion';
import logo from '../assets/logo.svg';

export function SplashScreen({ onComplete }) {
    return (
        <motion.div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.8, delay: 2.5, ease: "easeInOut" }}
            onAnimationComplete={onComplete}
        >
            <motion.img
                src={logo}
                alt="Logo"
                className="w-24 h-24 mb-4"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            />
            <motion.h1
                className="text-3xl font-bold text-text tracking-tight"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            >
                Premium Notes
            </motion.h1>
        </motion.div>
    );
}
