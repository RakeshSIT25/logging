import React, { useEffect, useState } from "react";
import api from '../api/axios';
import { Box, Cpu, Activity, RefreshCw } from "lucide-react";

function Containers() {
    const [containers, setContainers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchContainers = async () => {
        try {
            const res = await api.get("/containers");
            setContainers(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch containers", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContainers();
        const interval = setInterval(fetchContainers, 5000); // Poll every 5s
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex-1 overflow-y-auto p-8 relative scroll-smooth text-zinc-100">
            {/* Background ambient glow */}
            <div className="absolute top-0 left-0 w-full h-96 bg-blue-900/10 blur-[100px] pointer-events-none"></div>

            <div className="flex items-center justify-between mb-8 relative z-10">
                <div>
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
                        Container Monitoring
                    </h1>
                    <p className="text-zinc-400 mt-1">Real-time Docker container statistics</p>
                </div>
                <button
                    onClick={fetchContainers}
                    className="p-2 bg-zinc-900/50 border border-white/5 rounded-lg hover:bg-white/5 transition-colors text-zinc-400 hover:text-white"
                >
                    <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
                </button>
            </div>

            <div className="bg-zinc-900/40 border border-white/5 rounded-xl overflow-hidden backdrop-blur-sm relative z-10">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-white/5 text-zinc-400 font-medium uppercase text-xs">
                            <tr>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Image</th>
                                <th className="px-6 py-4">State</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">CPU %</th>
                                <th className="px-6 py-4">Memory (MB)</th>
                                <th className="px-6 py-4">Restarts</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {containers.map((c) => (
                                <tr key={c.name} className="hover:bg-white/5 transition-colors group">
                                    <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                                        <Box size={16} className="text-blue-400 group-hover:scale-110 transition-transform" />
                                        {c.name}
                                    </td>
                                    <td className="px-6 py-4 text-zinc-400 font-mono text-xs">{c.image}</td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${c.state === 'running'
                                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]'
                                                : 'bg-red-500/10 text-red-400 border-red-500/20'
                                                }`}
                                        >
                                            {c.state === 'running' && <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-1.5 animate-pulse"></span>}
                                            {c.state}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-zinc-400">{c.status}</td>
                                    <td className="px-6 py-4 font-mono text-zinc-300">
                                        <div className="flex items-center gap-2">
                                            <div className="w-16 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${paramsToColor(c.cpuPercent || 0)}`}
                                                    style={{ width: `${Math.min(c.cpuPercent || 0, 100)}%` }}
                                                ></div>
                                            </div>
                                            {(c.cpuPercent || 0).toFixed(2)}%
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-zinc-300">
                                        <span className={parseFloat(c.memoryUsageMB) > parseFloat(c.memoryLimitMB) * 0.8 ? "text-orange-400" : "text-zinc-300"}>
                                            {c.memoryUsageMB}
                                        </span>
                                        <span className="text-zinc-600 ml-1">/ {c.memoryLimitMB}</span>
                                    </td>
                                    <td className="px-6 py-4 text-zinc-400">{c.restartCount}</td>
                                </tr>
                            ))}
                            {containers.length === 0 && !loading && (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center text-zinc-500">
                                        No containers found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function paramsToColor(val) {
    if (val < 50) return 'bg-emerald-500';
    if (val < 80) return 'bg-orange-500';
    return 'bg-red-500';
}

export default Containers;
