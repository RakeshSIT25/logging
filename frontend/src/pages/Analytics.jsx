import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar, Legend } from 'recharts';
import { Activity, TrendingUp, Calendar, Zap } from 'lucide-react';

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

            {/* Simulated Heatmap / Grid */}
            <div className="bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                    <Calendar size={18} className="text-zinc-400" /> Activity Heatmap (Simulated)
                </h3>
                <div className="grid grid-cols-12 gap-2">
                    {Array.from({ length: 48 }).map((_, i) => {
                        const intensity = Math.random();
                        return (
                            <div
                                key={i}
                                className={`h-8 rounded-md transition-all hover:scale-110 cursor-pointer ${intensity > 0.8 ? 'bg-emerald-500' :
                                    intensity > 0.6 ? 'bg-emerald-600/60' :
                                        intensity > 0.4 ? 'bg-emerald-700/40' :
                                            'bg-zinc-800'
                                    }`}
                                title={`Activity Level: ${Math.floor(intensity * 100)}%`}
                            ></div>
                        )
                    })}
                </div>
                <div className="flex justify-between mt-2 text-xs text-zinc-500">
                    <span>00:00</span>
                    <span>12:00</span>
                    <span>23:59</span>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
