import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Server, Activity, AlertCircle, CheckCircle, Clock } from 'lucide-react';

const Services = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchServices = async () => {
        setLoading(true);
        try {
            const res = await api.get('/services');
            setServices(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
        const interval = setInterval(fetchServices, 10000); // 10s poll
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="p-6">
            <header className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Server className="text-blue-400" /> Service Health Monitor
                    </h1>
                    <p className="text-zinc-400 text-sm mt-1">Real-time operational status of all microservices</p>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {services.map((svc) => (
                    <div key={svc.name} className="bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-xl p-6 hover:bg-zinc-800/40 transition-all group relative overflow-hidden">
                        <div className={`absolute top-0 right-0 w-24 h-24 blur-3xl rounded-full -mr-10 -mt-10 opacity-20 pointer-events-none ${svc.status === 'healthy' ? 'bg-emerald-500' : 'bg-red-500'
                            }`} />

                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-semibold text-white tracking-tight">{svc.name}</h3>
                                <div className="flex items-center gap-1.5 mt-1">
                                    <div className={`h-2 w-2 rounded-full ${svc.status === 'healthy' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500 animate-bounce'}`} />
                                    <span className={`text-xs font-medium uppercase ${svc.status === 'healthy' ? 'text-emerald-400' : 'text-red-400'}`}>
                                        {svc.status.toUpperCase()}
                                    </span>
                                </div>
                            </div>
                            <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                                {svc.status === 'healthy' ? <CheckCircle size={20} className="text-emerald-400" /> : <AlertCircle size={20} className="text-red-400" />}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-xs text-zinc-400 mb-1">
                                    <span>Error Rate</span>
                                    <span className={svc.errorRate > 0 ? 'text-red-400' : 'text-emerald-400'}>{svc.errorRate}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-500 ${svc.errorRate > 5 ? 'bg-red-500' : 'bg-emerald-500'}`}
                                        style={{ width: `${Math.min(svc.errorRate, 100)}%` }}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-center">
                                <div className="bg-black/20 rounded-lg p-2 border border-white/5">
                                    <p className="text-zinc-500 text-[10px] uppercase">Total Logs</p>
                                    <p className="text-zinc-200 font-mono font-semibold">{svc.totalLogs}</p>
                                </div>
                                <div className="bg-black/20 rounded-lg p-2 border border-white/5">
                                    <p className="text-zinc-500 text-[10px] uppercase">Errors</p>
                                    <p className="text-red-400 font-mono font-semibold">{svc.errorCount}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-1.5 text-[10px] text-zinc-600 pt-2 border-t border-white/5">
                                <Clock size={10} />
                                Last seen: {new Date(svc.lastSeen).toLocaleTimeString()}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Services;
