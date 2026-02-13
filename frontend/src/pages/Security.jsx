import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import StatsCard from '../components/StatsCard';
import { Shield, AlertTriangle, Lock, UserCheck, Key, FileWarning, RefreshCw } from 'lucide-react';

const Security = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchSecurityLogs = async () => {
        setLoading(true);
        try {
            const res = await api.get('/security');
            setLogs(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSecurityLogs();
    }, []);

    const getIcon = (msg) => {
        if (msg.toLowerCase().includes('database')) return <FileWarning className="text-orange-400" size={16} />;
        if (msg.toLowerCase().includes('api key')) return <Key className="text-yellow-400" size={16} />;
        if (msg.toLowerCase().includes('user')) return <UserCheck className="text-blue-400" size={16} />;
        return <Lock className="text-purple-400" size={16} />;
    };

    return (
        <div className="p-6">
            <header className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Shield className="text-purple-400" /> Security Events
                    </h1>
                    <p className="text-zinc-400 text-sm mt-1">Audit trail of security-related system events</p>
                </div>
                <button
                    onClick={fetchSecurityLogs}
                    className="p-2 hover:bg-white/5 rounded-lg transition-colors text-zinc-400 hover:text-white"
                >
                    <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
                </button>
            </header>

            <div className="bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-white/5 text-zinc-400 text-xs uppercase font-medium">
                        <tr>
                            <th className="px-6 py-4">Timestamp</th>
                            <th className="px-6 py-4">Event Type</th>
                            <th className="px-6 py-4">Service</th>
                            <th className="px-6 py-4">Details</th>
                            <th className="px-6 py-4 text-right">Severity</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-sm text-zinc-300">
                        {loading && logs.length === 0 ? (
                            <tr><td colSpan={5} className="p-8 text-center text-zinc-500">Loading security events...</td></tr>
                        ) : logs.map(log => (
                            <tr key={log.id} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap font-mono text-zinc-500 text-xs">
                                    {new Date(log.timestamp).toLocaleString()}
                                </td>
                                <td className="px-6 py-4 flex items-center gap-2 font-medium">
                                    {getIcon(log.message)}
                                    {log.message.split(':')[0]}
                                </td>
                                <td className="px-6 py-4 text-zinc-400">{log.service}</td>
                                <td className="px-6 py-4 text-zinc-400 truncate max-w-md">{log.message}</td>
                                <td className="px-6 py-4 text-right">
                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${log.level === 'error' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                                            log.level === 'warn' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' :
                                                'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                                        }`}>
                                        {log.level}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Security;
