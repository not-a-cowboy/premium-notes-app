import { motion } from 'framer-motion';
import { Type, List, Image, AlignLeft, MoreHorizontal } from 'lucide-react';

export function Sidebar() {
    return (
        <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="w-80 bg-white h-full border-l border-gray-100 shadow-subtle p-6 flex flex-col gap-6"
        >
            <h3 className="text-lg font-bold text-gray-900">Formatting</h3>

            <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-600 hover:text-text cursor-pointer transition-colors">
                    <Type size={20} />
                    <span>Typography</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600 hover:text-text cursor-pointer transition-colors">
                    <List size={20} />
                    <span>Lists</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600 hover:text-text cursor-pointer transition-colors">
                    <Image size={20} />
                    <span>Media</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600 hover:text-text cursor-pointer transition-colors">
                    <AlignLeft size={20} />
                    <span>Alignment</span>
                </div>
            </div>

            <div className="mt-auto pt-6 border-t border-gray-100">
                <div className="flex items-center gap-3 text-gray-600 hover:text-text cursor-pointer transition-colors">
                    <MoreHorizontal size={20} />
                    <span>More Options</span>
                </div>
            </div>
        </motion.div>
    );
}
