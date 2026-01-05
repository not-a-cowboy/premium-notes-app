import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, X } from 'lucide-react';

interface PinPromptProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (pin: string) => void;
    mode: 'setup' | 'unlock';
    title?: string;
}

export function PinPrompt({ isOpen, onClose, onSuccess, mode, title }: PinPromptProps) {
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setPin('');
            setError('');
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (pin.length < 4) {
            setError('PIN must be at least 4 digits');
            return;
        }
        onSuccess(pin);
        setPin(''); // Clear after success (parent might keep it open if verifying, but usually closes)
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative bg-m-dark border-2 border-m-gray w-full max-w-sm overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)]"
                    >
                        {/* Header */}
                        <div className="h-1 bg-m-yellow w-full" />
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <div className="p-8 flex flex-col items-center text-center">
                            <div className={`mb-6 p-4 rounded-full border-2 ${mode === 'setup' ? 'border-m-yellow bg-m-yellow/10 text-m-yellow' : 'border-m-blue bg-m-blue/10 text-m-blue'}`}>
                                {mode === 'setup' ? <Lock size={32} /> : <Unlock size={32} />}
                            </div>

                            <h2 className="text-xl font-black uppercase text-white mb-2 tracking-tight">
                                {title || (mode === 'setup' ? 'Secure Node' : 'Authenticate')}
                            </h2>
                            <p className="text-xs font-technical text-gray-400 mb-6 uppercase tracking-wider">
                                {mode === 'setup' ? 'Set a PIN to encrypt this data.' : 'Enter PIN to decrypt content.'}
                            </p>

                            <form onSubmit={handleSubmit} className="w-full">
                                <div className="relative mb-2">
                                    <input
                                        ref={inputRef}
                                        type="password"
                                        value={pin}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/[^0-9]/g, '');
                                            setPin(val);
                                            setError('');
                                        }}
                                        maxLength={6}
                                        className="w-full bg-black border-2 border-m-gray py-4 text-center text-2xl font-mono text-white tracking-[0.5em] focus:border-m-yellow focus:outline-none transition-colors placeholder-gray-800"
                                        placeholder="••••••"
                                    />
                                </div>

                                {error && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-m-red text-[10px] font-bold uppercase tracking-wider mb-4 h-4"
                                    >
                                        {error}
                                    </motion.p>
                                )}

                                <button
                                    type="submit"
                                    className="w-full bg-m-gray hover:bg-white hover:text-black text-white font-bold uppercase py-3 text-xs tracking-widest transition-all mt-2 border border-transparent hover:border-black"
                                >
                                    {mode === 'setup' ? 'Encrypt & Save' : 'Unlock'}
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
