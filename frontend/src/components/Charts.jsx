import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-zinc-900/90 backdrop-blur-md border border-white/10 p-3 rounded-lg shadow-xl">
                <p className="text-zinc-400 text-xs mb-1">{new Date(label).toLocaleTimeString()}</p>
                <p className="text-indigo-400 font-bold font-mono">
                    {payload[0].value} <span className="text-zinc-500 text-xs font-normal">logs</span>
                </p>
            </div>
        );
    }
    return null;
};

const Charts = ({ data }) => {
    if (!data || data.length === 0) return null;

    return (
        <div className="bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-xl p-6 h-[400px] relative overflow-hidden group">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-white">Traffic Volume</h3>
                    <p className="text-zinc-500 text-sm">Real-time log ingestion rate per minute</p>
                </div>
                <div className="flex gap-2">
                    <span className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-medium border border-indigo-500/20">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                        </span>
                        Live
                    </span>
                </div>
            </div>

            <ResponsiveContainer width="100%" height="85%">
                <AreaChart data={data} margin={{ top: 30, right: 30, left: 10, bottom: 5 }}>
                    <defs>
                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                    <XAxis
                        dataKey="time"
                        tickFormatter={(time) => new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        stroke="#52525b"
                        tick={{ fontSize: 11, fill: '#71717a' }}
                        tickLine={false}
                        axisLine={false}
                        dy={10}
                        minTickGap={30}
                    />
                    <YAxis
                        stroke="#52525b"
                        tick={{ fontSize: 11, fill: '#71717a' }}
                        tickLine={false}
                        axisLine={false}
                        dx={-10}
                        padding={{ top: 30 }}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#6366f1', strokeWidth: 1, strokeDasharray: '4 4' }} />
                    <Area
                        type="monotoneX"
                        dataKey="count"
                        stroke="#6366f1"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorCount)"
                        isAnimationActive={false}
                        connectNulls={true}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default Charts;
