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
        <div className="p-4 bg-[var(--card-bg)] rounded-xl border border-[var(--card-border)]">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-[var(--text-primary)] font-medium">
                    <Cloud size={20} className="text-[var(--accent-primary)]" />
                    <span>Cloud Sync</span>
                </div>
                <div className="text-xs text-[var(--text-secondary)]">
                    {lastSynced ? `Last synced: ${lastSynced}` : 'Not synced yet'}
                </div>
            </div>

            <p className="text-sm text-[var(--text-muted)] mb-4">
                Sync your notes across devices safely with end-to-end encryption.
            </p>

            <button
                onClick={handleSync}
                disabled={status === 'syncing' || status === 'synced'}
                className={`w-full py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all ${status === 'synced'
                    ? 'bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] border border-[var(--accent-primary)]/50'
                    : 'bg-[var(--bg-primary)] border border-[var(--card-border)] hover:bg-[var(--card-border)]/50 text-[var(--text-primary)]'
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
