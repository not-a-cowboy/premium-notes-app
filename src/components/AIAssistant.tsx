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
            alert("Please set your API Key in the Home Settings first.");
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
            alert("AI Request Failed: " + (error as Error).message);
        } finally {
            setIsLoading(false);
            setActiveAction(null);
            setIsOpen(false);
        }
    };

    return (
        <div className="relative z-50">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${isOpen || isLoading
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md'
                        : 'bg-white/50 text-gray-600 hover:bg-white/80 hover:text-indigo-600'
                    }`}
                disabled={isLoading}
            >
                {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                {isLoading ? (activeAction === 'summary' ? 'Summarizing...' : activeAction === 'tags' ? 'Tagging...' : 'Fixing...') : 'AI Assistant'}
            </button>

            <AnimatePresence>
                {isOpen && !isLoading && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute right-0 top-full mt-2 w-48 bg-white/90 backdrop-blur-xl border border-white/50 rounded-xl shadow-xl p-1 z-50 overflow-hidden"
                        >
                            <button
                                onClick={() => handleAction('summary')}
                                className="w-full text-left px-3 py-2 rounded-lg hover:bg-indigo-50 text-gray-700 text-sm flex items-center gap-2"
                            >
                                <FileText size={14} className="text-indigo-500" /> Summarize
                            </button>
                            <button
                                onClick={() => handleAction('tags')}
                                className="w-full text-left px-3 py-2 rounded-lg hover:bg-purple-50 text-gray-700 text-sm flex items-center gap-2"
                            >
                                <Tag size={14} className="text-purple-500" /> Auto-Tag
                            </button>
                            <button
                                onClick={() => handleAction('grammar')}
                                className="w-full text-left px-3 py-2 rounded-lg hover:bg-pink-50 text-gray-700 text-sm flex items-center gap-2"
                            >
                                <Wand2 size={14} className="text-pink-500" /> Fix Grammar
                            </button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
