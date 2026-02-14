import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar, Legend, PieChart, Pie, Cell } from 'recharts';
import { Activity, TrendingUp, Calendar, Zap, AlertTriangle } from 'lucide-react';

const Analytics = () => {
    const [stats, setStats] = useState({ trend: [], services: [] });

    // In a real app we would call a dedicated analytics endpoint, for now simulate with stats
    const fetchAnalytics = async () => {
        const res = await api.get('/stats');
        setStats(res.data);
    };

    useEffect(() => {
        fetchAnalytics();
    }, []);

    return (
        <div className="p-6 overflow-y-auto h-full">
            <header className="mb-8">
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Activity className="text-emerald-400" /> Deep Analytics
                </h1>
                <p className="text-zinc-400 text-sm mt-1">Historical trends and pattern recognition</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Traffic Trend */}
                <div className="bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-xl p-6 h-[400px]">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <TrendingUp size={18} className="text-blue-400" /> Log Ingestion Volume
                    </h3>
                    <ResponsiveContainer width="100%" height="90%">
                        <AreaChart data={stats.trend} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorCountBlue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                            <XAxis dataKey="time" tickFormatter={t => new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} stroke="#52525b" />
                            <YAxis stroke="#52525b" padding={{ top: 30 }} />
                            <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a' }} />
                            <Area type="monotone" dataKey="count" stroke="#3b82f6" fillOpacity={1} fill="url(#colorCountBlue)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Service Distribution Bar Chart */}
                <div className="bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-xl p-6 h-[400px]">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Zap size={18} className="text-yellow-400" /> Top Active Services
                    </h3>
                    <ResponsiveContainer width="100%" height="90%">
                        <BarChart data={stats.services} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false} />
                            <XAxis type="number" stroke="#52525b" />
                            <YAxis dataKey="service" type="category" stroke="#a1a1aa" width={100} tick={{ fontSize: 12 }} />
                            <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a' }} />
                            <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Log Level Distribution */}
                <div className="bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-xl p-6 h-[400px]">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Activity size={18} className="text-purple-400" /> Log Level Distribution
                    </h3>
                    <ResponsiveContainer width="100%" height="90%">
                        <PieChart>
                            <Pie
                                data={[
                                    { name: 'Info', value: parseInt(stats.levels?.info) || 0 },
                                    { name: 'Warning', value: parseInt(stats.levels?.warn) || 0 },
                                    { name: 'Error', value: parseInt(stats.levels?.error) || 0 },
                                ].filter(d => d.value > 0)}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {[
                                    { name: 'Info', color: '#3b82f6' },
                                    { name: 'Warning', color: '#eab308' },
                                    { name: 'Error', color: '#ef4444' },
                                ].map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a' }} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Recent Critical Alerts */}
                <div className="bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-xl p-6 h-[400px] overflow-y-auto">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <AlertTriangle size={18} className="text-red-400" /> Recent Critical Alerts
                    </h3>
                    <div className="space-y-3">
                        {stats.recentErrors && stats.recentErrors.length > 0 ? (
                            stats.recentErrors.map((log, i) => (
                                <div key={i} className="bg-red-500/10 border border-red-500/20 p-3 rounded-lg">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="text-red-400 font-medium text-sm">{log.service}</span>
                                        <span className="text-zinc-500 text-xs">{new Date(log.timestamp).toLocaleString()}</span>
                                    </div>
                                    <p className="text-zinc-300 text-sm line-clamp-2">{log.message}</p>
                                </div>
                            ))
                        ) : (
                            <div className="text-zinc-500 text-center py-8">No recent critical alerts</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
