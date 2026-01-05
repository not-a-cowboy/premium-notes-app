import { useMemo } from 'react';
import { useNotes } from '../hooks/useNotes';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';
import { format, subDays, isSameDay } from 'date-fns';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

const COLORS = ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];

export function AnalyticsDashboard({ onClose }: { onClose: () => void }) {
    const { notes } = useNotes();

    const stats = useMemo(() => {
        const totalNotes = notes.length;
        const totalWords = notes.reduce((acc, note) => acc + (note.content?.split(' ').length || 0), 0);

        // Calculate category distribution
        const categoryData = notes.reduce((acc: Record<string, number>, note) => {
            const cat = note.category || 'Uncategorized';
            acc[cat] = (acc[cat] || 0) + 1;
            return acc;
        }, {});

        const pieData = Object.entries(categoryData).map(([name, value]) => ({ name, value }));

        // Calculate activity (last 7 days)
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const d = subDays(new Date(), 6 - i);
            return {
                date: format(d, 'MMM dd'),
                fullDate: d,
                count: 0
            };
        });

        notes.forEach(note => {
            // Handle potentially undefined or string dates
            const dateStr = note.updatedAt || note.date;
            if (!dateStr) return;

            const noteDate = new Date(dateStr);
            if (isNaN(noteDate.getTime())) return;

            const dayStat = last7Days.find(d => isSameDay(d.fullDate, noteDate));
            if (dayStat) {
                dayStat.count++;
            }
        });

        // Calculate Streak (Current Streak)
        // Sort periods of activity
        // This is a simplified streak calculation based on activity dates

        return {
            totalNotes,
            totalWords,
            pieData,
            activityData: last7Days
        };
    }, [notes]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute inset-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl p-8 overflow-y-auto"
        >
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                        Productivity Insights
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Top Stat Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
                        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-2">Total Words Written</h3>
                        <p className="text-4xl font-bold text-gray-900 dark:text-white">
                            {stats.totalWords.toLocaleString()}
                        </p>
                    </div>
                    <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
                        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-2">Total Notes</h3>
                        <p className="text-4xl font-bold text-gray-900 dark:text-white">
                            {stats.totalNotes}
                        </p>
                    </div>
                    <div className="p-6 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-xl text-white">
                        <h3 className="text-white/80 text-sm font-medium mb-2">Creative Energy</h3>
                        <p className="text-4xl font-bold">High ⚡️</p>
                    </div>
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Activity Chart */}
                    <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 h-96">
                        <h3 className="text-xl font-semibold mb-6">Weekly Activity</h3>
                        <ResponsiveContainer width="100%" height="85%">
                            <BarChart data={stats.activityData}>
                                <XAxis
                                    dataKey="date"
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    allowDecimals={false}
                                />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Categories Chart */}
                    <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 h-96">
                        <h3 className="text-xl font-semibold mb-6">Explore by Category</h3>
                        <ResponsiveContainer width="100%" height="85%">
                            <PieChart>
                                <Pie
                                    data={stats.pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {stats.pieData.map((_entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
