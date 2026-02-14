import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar } from 'recharts';
import { Activity, TrendingUp, Calendar, Zap, AlertTriangle, Users } from 'lucide-react';

const Analytics = () => {
    const [stats, setStats] = useState({ trend: [], services: [], activeUsers: 0 });

    // In a real app we would call a dedicated analytics endpoint, for now simulate with stats
    const fetchAnalytics = async () => {
        const res = await api.get('/stats');
        setStats(res.data);
    };

    useEffect(() => {
        fetchAnalytics();
    }, []);

    return (
        <div className="flex-1 overflow-y-auto p-6 relative scroll-smooth">
            {/* Background ambient glow */}
            <div className="absolute top-0 left-0 w-full h-96 bg-emerald-900/10 blur-[100px] pointer-events-none"></div>
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
                {/* Live Active Users */}
                <div className="bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-xl p-6 h-[400px] flex flex-col items-center justify-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4">
                        <span className="flex h-3 w-3 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                        </span>
                    </div>

                    <div className="relative z-10 text-center">
                        <div className="mb-4 relative inline-block">
                            <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full animate-pulse"></div>
                            <Users size={64} className="text-indigo-400 relative z-10" />
                        </div>
                        <h3 className="text-zinc-400 text-lg font-medium mb-2">Active Users Now</h3>
                        <div className="text-6xl font-bold text-white tracking-tighter tabular-nums">
                            {stats.activeUsers || 0}
                        </div>
                        <p className="text-emerald-400 text-sm mt-2 flex items-center justify-center gap-1">
                            <TrendingUp size={14} /> +12% from last hour
                        </p>
                    </div>

                    {/* Decorative wave or particle effect could go here */}
                    <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-indigo-500/10 to-transparent pointer-events-none"></div>
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
