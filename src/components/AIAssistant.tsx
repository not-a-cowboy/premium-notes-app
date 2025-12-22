import { useState } from 'react';
import { Sparkles, Loader2, FileText, Tag, Wand2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { summarizeNote, generateTags, fixGrammar } from '../services/ai';

interface AIAssistantProps {
    content: string;
    onSummarize: (summary: string) => void;
    onTags: (tags: string[]) => void;
    onGrammar: (fixed: string) => void;
}

export function AIAssistant({ content, onSummarize, onTags, onGrammar }: AIAssistantProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [activeAction, setActiveAction] = useState<string | null>(null);

    const handleAction = async (action: 'summary' | 'tags' | 'grammar') => {
        const apiKey = localStorage.getItem('premium-notes-ai-key');
        if (!apiKey) {
            alert("ERR: API_KEY_MISSING. CHECK_CONFIG.");
            return;
        }

        setIsLoading(true);
        setActiveAction(action);

        try {
            if (action === 'summary') {
                const result = await summarizeNote(content, apiKey);
                onSummarize(result);
            } else if (action === 'tags') {
                const result = await generateTags(content, apiKey);
                onTags(result);
            } else if (action === 'grammar') {
                const result = await fixGrammar(content, apiKey);
                onGrammar(result);
            }
        } catch (error) {
            console.error(error);
            alert("AI_PROCESS_FAILED: " + (error as Error).message);
        } finally {
            setIsLoading(false);
            setActiveAction(null);
            setIsOpen(false);
        }
    };

    return (
        <div className="relative z-50 font-mono">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all border ${isOpen || isLoading
                    ? 'bg-m-yellow text-black border-m-yellow shadow-[0_0_10px_rgba(204,255,0,0.5)]'
                    : 'bg-transparent text-m-yellow border-m-yellow hover:bg-m-yellow hover:text-black'
                    }`}
                disabled={isLoading}
            >
                {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                {isLoading ? (activeAction === 'summary' ? 'PROCESSING...' : activeAction === 'tags' ? 'ANALYZING...' : 'CORRECTING...') : 'AI_CORE'}
            </button>

            <AnimatePresence>
                {isOpen && !isLoading && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute right-0 top-full mt-2 w-56 bg-m-black border-2 border-m-gray shadow-xl p-0 z-50 overflow-hidden"
                        >
                            <div className="bg-m-gray px-2 py-1 text-[10px] text-gray-400 font-bold uppercase tracking-widest border-b border-black">
                                Select Protocol
                            </div>
                            <button
                                onClick={() => handleAction('summary')}
                                className="w-full text-left px-4 py-3 hover:bg-m-white hover:text-black text-m-white text-xs uppercase font-bold flex items-center gap-3 border-b border-m-gray/20 transition-colors group"
                            >
                                <FileText size={14} className="text-m-blue group-hover:text-black" />
                                Summarize_Log
                            </button>
                            <button
                                onClick={() => handleAction('tags')}
                                className="w-full text-left px-4 py-3 hover:bg-m-white hover:text-black text-m-white text-xs uppercase font-bold flex items-center gap-3 border-b border-m-gray/20 transition-colors group"
                            >
                                <Tag size={14} className="text-m-yellow group-hover:text-black" />
                                Generate_Meta
                            </button>
                            <button
                                onClick={() => handleAction('grammar')}
                                className="w-full text-left px-4 py-3 hover:bg-m-white hover:text-black text-m-white text-xs uppercase font-bold flex items-center gap-3 transition-colors group"
                            >
                                <Wand2 size={14} className="text-m-red group-hover:text-black" />
                                Syntax_Check
                            </button>

                            <div className="bg-black p-1 text-[8px] text-right text-gray-600 font-mono">
                                V.2.0.4 ACTIVE
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
