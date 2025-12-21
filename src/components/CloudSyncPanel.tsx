import { useState } from 'react';
import { Cloud, Check, Loader2, RefreshCw } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';

export function CloudSyncPanel() {
    const [status, setStatus] = useState<'idle' | 'syncing' | 'synced' | 'error'>('idle');
    const [lastSynced, setLastSynced] = useState<string | null>(localStorage.getItem('last-synced'));

    const handleSync = async () => {
        setStatus('syncing');
        // Simulate network request
        setTimeout(() => {
            const now = new Date().toLocaleString();
            localStorage.setItem('last-synced', now);
            setLastSynced(now);
            setStatus('synced');

            // Reset to idle after 3 seconds
            setTimeout(() => setStatus('idle'), 3000);
        }, 2000);
    };

    return (
        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
                    <Cloud size={20} className="text-gta-purple" />
                    <span>Cloud Sync</span>
                </div>
                <div className="text-xs text-gray-500">
                    {lastSynced ? `Last synced: ${lastSynced}` : 'Not synced yet'}
                </div>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Sync your notes across devices safely with end-to-end encryption.
            </p>

            <button
                onClick={handleSync}
                disabled={status === 'syncing' || status === 'synced'}
                className={`w-full py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all ${status === 'synced'
                    ? 'bg-green-100 text-green-700 border border-green-200'
                    : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200'
                    }`}
            >
                {status === 'idle' && (
                    <>
                        <RefreshCw size={16} />
                        Sync Now
                    </>
                )}
                {status === 'syncing' && (
                    <>
                        <Loader2 size={16} className="animate-spin" />
                        Syncing...
                    </>
                )}
                {status === 'synced' && (
                    <>
                        <Check size={16} />
                        Synced Successfully
                    </>
                )}
            </button>
        </div>
    );
}
