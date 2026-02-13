import React from 'react';
import {
    PieChart, Pie, Cell,
    BarChart, Bar, XAxis, YAxis,
    Tooltip, Legend, ResponsiveContainer,
    CartesianGrid
} from 'recharts';

const COLORS = {
    error: '#ef4444', // red-500
    warn: '#eab308',  // yellow-500
    info: '#3b82f6',  // blue-500
    debug: '#a855f7', // purple-500
    trace: '#71717a'  // zinc-500
};

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-zinc-900/90 backdrop-blur-md border border-white/10 p-3 rounded-lg shadow-xl">
                <p className="text-zinc-300 text-xs mb-1 capitalize">{payload[0].name}</p>
                <p className="text-white font-bold font-mono">
                    {payload[0].value.toLocaleString()} <span className="text-zinc-500 text-xs font-normal">logs</span>
                </p>
            </div>
        );
    }
    return null;
};

export const LevelPieChart = ({ data }) => {
    // Transform object { error: 10, info: 20 } to array [{ name: 'error', value: 10 }, ...]
    const chartData = Object.entries(data || {})
        .map(([name, value]) => ({ name, value }))
        .filter(item => item.value > 0);

    if (chartData.length === 0) {
        return (
            <div className="flex items-center justify-center h-full text-zinc-500 text-sm">
                No data available
            </div>
        );
    }

    return (
        <div className="bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-xl p-6 h-full relative overflow-hidden flex flex-col">
            <h3 className="text-lg font-semibold text-white mb-4">Log Levels</h3>
            <div className="flex-1 min-h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[entry.name] || COLORS.trace} stroke="rgba(0,0,0,0)" />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                            verticalAlign="bottom"
                            align="center"
                            iconType="circle"
                            formatter={(value) => <span className="text-zinc-400 capitalize text-xs ml-1">{value}</span>}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export const ServiceBarChart = ({ data }) => {
    // Expects data to be array of objects: [{ service: 'auth', count: 100 }, ...]
    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-full text-zinc-500 text-sm">
                No service data available
            </div>
        );
    }

    // Ensure count is a number
    const chartData = data.map(item => ({
        ...item,
        count: typeof item.count === 'string' ? parseInt(item.count, 10) : item.count
    }));

    return (
        <div className="bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-xl p-6 h-full relative overflow-hidden flex flex-col">
            <h3 className="text-lg font-semibold text-white mb-4">Top Services</h3>
            <div className="flex-1 min-h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={chartData}
                        layout="vertical"
                        margin={{ top: 20, right: 40, left: 40, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#27272a" />
                        <XAxis type="number" hide padding={{ right: 20 }} />
                        <YAxis
                            dataKey="service"
                            type="category"
                            width={100}
                            tick={{ fill: '#a1a1aa', fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip
                            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                            content={({ active, payload, label }) => {
                                if (active && payload && payload.length) {
                                    return (
                                        <div className="bg-zinc-900/90 backdrop-blur-md border border-white/10 p-3 rounded-lg shadow-xl">
                                            <p className="text-zinc-300 text-xs mb-1">{label}</p>
                                            <p className="text-indigo-400 font-bold font-mono">
                                                {payload[0].value.toLocaleString()} <span className="text-zinc-500 text-xs font-normal">logs</span>
                                            </p>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={20}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill="url(#colorService)" />
                            ))}
                        </Bar>
                        <defs>
                            <linearGradient id="colorService" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#6366f1" />
                                <stop offset="100%" stopColor="#a855f7" />
                            </linearGradient>
                        </defs>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
