import { useEffect, useState } from "react";
import api from '../api/axios';
import { Cpu, HardDrive, Database, Activity, Server as ServerIcon } from 'lucide-react';
import clsx from 'clsx';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const getColor = (value) => {
    if (value < 60) return "text-emerald-400";
    if (value < 80) return "text-orange-400";
    return "text-red-400";
};

const getBgColor = (value) => {
    if (value < 60) return "bg-emerald-500";
    if (value < 80) return "bg-orange-500";
    return "bg-red-500";
};

function ServerHealth() {
    const [data, setData] = useState(null);
    const [cpuHistory, setCpuHistory] = useState([]);

    useEffect(() => {
        const fetchHealth = async () => {
            try {
                const res = await api.get("/server-health-live");
                setData(res.data);

                setCpuHistory(prev => {
                    const newPoint = {
                        time: new Date().toISOString(),
                        value: res.data.cpu.load
                    };
                    const newHistory = [...prev, newPoint];
                    if (newHistory.length > 30) newHistory.shift(); // Keep last 30 points (60 seconds)
                    return newHistory;
                });
            } catch (err) {
                console.error(err);
            }
        };

        fetchHealth();
        const interval = setInterval(fetchHealth, 2000); // Update every 2 seconds
        return () => clearInterval(interval);
    }, []);

    if (!data) return (
        <div className="flex items-center justify-center h-full text-zinc-500 gap-2">
            <Activity className="animate-spin" /> Fetching real-time telemetry...
        </div>
    );

    const formatBytes = (bytes) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (

        <div className="flex-1 overflow-y-auto p-8 relative scroll-smooth h-full">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-white tracking-tight">System Telemetry</h2>
                        <p className="text-zinc-400 mt-1">Real-time server performance metrics</p>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm font-medium">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        Live Connection
                    </div>
                </div>

                {/* CPU Usage History Chart */}
                <div className="bg-zinc-900/50 border border-white/5 p-6 rounded-2xl relative overflow-hidden">
                    <h3 className="text-lg font-medium text-white mb-6 flex items-center gap-2">
                        <Activity size={20} className="text-indigo-400" /> CPU Usage History
                    </h3>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={cpuHistory}>
                                <defs>
                                    <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                                <XAxis
                                    dataKey="time"
                                    tickFormatter={(time) => new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                    stroke="#52525b"
                                    tick={{ fontSize: 11, fill: '#71717a' }}
                                    tickLine={false}
                                    axisLine={false}
                                    minTickGap={30}
                                />
                                <YAxis
                                    stroke="#52525b"
                                    tick={{ fontSize: 11, fill: '#71717a' }}
                                    tickLine={false}
                                    axisLine={false}
                                    domain={[0, 100]}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a' }}
                                    itemStyle={{ color: '#818cf8' }}
                                    labelFormatter={(label) => new Date(label).toLocaleTimeString()}
                                    formatter={(value) => [`${value.toFixed(1)}%`, 'CPU Load']}
                                />
                                <Area
                                    type="monotoneX"
                                    dataKey="value"
                                    stroke="#6366f1"
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#colorCpu)"
                                    isAnimationActive={false}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Primary Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* CPU Summary */}
                    <div className="bg-zinc-900/50 border border-white/5 p-6 rounded-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Cpu size={64} />
                        </div>
                        <h3 className="text-zinc-400 text-sm font-medium mb-1 flex items-center gap-2"><Cpu size={16} /> CPU Load</h3>
                        <p className={clsx("text-4xl font-bold tracking-tight mt-2", getColor(data.cpu.load))}>
                            {data.cpu.load.toFixed(1)}%
                        </p>
                        <div className="w-full bg-zinc-800 h-1.5 mt-4 rounded-full overflow-hidden">
                            <div className={clsx("h-full transition-all duration-500 ease-out", getBgColor(data.cpu.load))} style={{ width: `${data.cpu.load}%` }}></div>
                        </div>
                    </div>

                    {/* Memory Summary */}
                    <div className="bg-zinc-900/50 border border-white/5 p-6 rounded-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <HardDrive size={64} />
                        </div>
                        <h3 className="text-zinc-400 text-sm font-medium mb-1 flex items-center gap-2"><HardDrive size={16} /> Memory</h3>
                        <p className={clsx("text-4xl font-bold tracking-tight mt-2", getColor(data.memory.percentage))}>
                            {data.memory.percentage.toFixed(1)}%
                        </p>
                        <p className="text-xs text-zinc-500 mt-1">
                            {formatBytes(data.memory.used)} / {formatBytes(data.memory.total)}
                        </p>
                        <div className="w-full bg-zinc-800 h-1.5 mt-4 rounded-full overflow-hidden">
                            <div className={clsx("h-full transition-all duration-500 ease-out", getBgColor(data.memory.percentage))} style={{ width: `${data.memory.percentage}%` }}></div>
                        </div>
                    </div>

                    {/* System Uptime */}
                    <div className="bg-zinc-900/50 border border-white/5 p-6 rounded-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Activity size={64} />
                        </div>
                        <h3 className="text-zinc-400 text-sm font-medium mb-1 flex items-center gap-2"><Activity size={16} /> System Uptime</h3>
                        <p className="text-4xl font-bold text-white tracking-tight mt-2">
                            {(data.uptime / 3600).toFixed(1)}<span className="text-lg text-zinc-500 font-normal ml-1">hrs</span>
                        </p>
                        <p className="text-xs text-zinc-500 mt-1">Since last reboot</p>
                    </div>

                    {/* Process Count / General Info (Mocked if needed or extra info) */}
                    <div className="bg-zinc-900/50 border border-white/5 p-6 rounded-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <ServerIcon size={64} />
                        </div>
                        <h3 className="text-zinc-400 text-sm font-medium mb-1 flex items-center gap-2"><ServerIcon size={16} /> Server Status</h3>
                        <p className="text-4xl font-bold text-emerald-400 tracking-tight mt-2">OK</p>
                        <p className="text-xs text-zinc-500 mt-1">All systems nominal</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* CPU Cores Detail */}
                    <div className="lg:col-span-2 bg-zinc-900/50 border border-white/5 rounded-2xl p-6 backdrop-blur-sm">
                        <h3 className="text-lg font-medium text-white mb-6 flex items-center gap-2">
                            <Cpu size={20} className="text-indigo-400" /> Processor Cores Breakdown
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {data.cpu.cores.map((coreLoad, idx) => (
                                <div key={idx} className="bg-zinc-950/50 p-4 rounded-xl border border-white/5">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs font-mono text-zinc-500">Core {idx}</span>
                                        <span className={clsx("text-sm font-bold", getColor(coreLoad))}>{coreLoad.toFixed(0)}%</span>
                                    </div>
                                    <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                                        <div className={clsx("h-full transition-all duration-300", getBgColor(coreLoad))} style={{ width: `${coreLoad}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Disk Details */}
                    <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 backdrop-blur-sm">
                        <h3 className="text-lg font-medium text-white mb-6 flex items-center gap-2">
                            <Database size={20} className="text-purple-400" /> Storage Devices
                        </h3>
                        <div className="space-y-6">
                            {data.disk.map((d, idx) => (
                                <div key={idx} className="space-y-2">
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-sm font-medium text-zinc-300">{d.mount} <span className="text-zinc-600 text-xs ml-1">({d.fs})</span></span>
                                        <span className={clsx("text-sm font-bold", getColor(d.use))}>{d.use.toFixed(1)}%</span>
                                    </div>
                                    <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                                        <div className={clsx("h-full transition-all duration-500", getBgColor(d.use))} style={{ width: `${d.use}%` }}></div>
                                    </div>
                                    <div className="flex justify-between text-xs text-zinc-500">
                                        <span>{formatBytes(d.used)} Used</span>
                                        <span>{formatBytes(d.size)} Total</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ServerHealth;
