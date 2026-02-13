import { useEffect, useState } from "react";
import api from '../api/axios';

const getColor = (value) => {
    if (value < 60) return "text-emerald-400";
    if (value < 80) return "text-orange-400";
    return "text-red-400";
};

function ServerHealth() {
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchHealth = async () => {
            try {
                const res = await api.get("/server-health-live");
                setData(res.data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchHealth();
        const interval = setInterval(fetchHealth, 2000); // Update every 2 seconds
        return () => clearInterval(interval);
    }, []);

    if (!data) return <div className="p-8 text-zinc-400">Loading metrics...</div>;

    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Server Health</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* CPU Usage */}
                <div className="bg-zinc-900/50 border border-white/5 p-6 rounded-xl backdrop-blur-sm">
                    <h3 className="text-zinc-400 text-sm font-medium mb-2">CPU Usage</h3>
                    <p className={`text-3xl font-bold ${getColor(data.cpu_usage)}`}>
                        {data.cpu_usage?.toFixed(2)}%
                    </p>
                </div>

                {/* Memory Usage */}
                <div className="bg-zinc-900/50 border border-white/5 p-6 rounded-xl backdrop-blur-sm">
                    <h3 className="text-zinc-400 text-sm font-medium mb-2">Memory Usage</h3>
                    <p className={`text-3xl font-bold ${getColor(data.memory_usage)}`}>
                        {data.memory_usage?.toFixed(2)}%
                    </p>
                </div>

                {/* Disk Usage */}
                <div className="bg-zinc-900/50 border border-white/5 p-6 rounded-xl backdrop-blur-sm">
                    <h3 className="text-zinc-400 text-sm font-medium mb-2">Disk Usage</h3>
                    <p className={`text-3xl font-bold ${getColor(data.disk_usage)}`}>
                        {data.disk_usage?.toFixed(2)}%
                    </p>
                </div>

                {/* Uptime */}
                <div className="bg-zinc-900/50 border border-white/5 p-6 rounded-xl backdrop-blur-sm">
                    <h3 className="text-zinc-400 text-sm font-medium mb-2">Uptime</h3>
                    <p className="text-3xl font-bold text-blue-400">
                        {(data.uptime / 3600).toFixed(2)}h
                    </p>
                </div>
            </div>
        </div>
    );
}

export default ServerHealth;
