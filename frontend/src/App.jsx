import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import api from './api/axios';
import StatsCard from './components/StatsCard';
import Charts from './components/Charts';
import { LevelPieChart, ServiceBarChart } from './components/MetricCharts';
import LogsTable from './components/LogsTable';
import LogModal from './components/LogModal';
import Dashboard from './pages/Dashboard';
import Services from './pages/Services';
import Security from './pages/Security';
import Analytics from './pages/Analytics';
import ServerHealth from './pages/ServerHealth';
import { RefreshCw, LayoutDashboard, Terminal, Activity, Server, Shield, ArrowUpRight, Menu, ChevronLeft, Cpu } from 'lucide-react';
import clsx from 'clsx';

function Layout() {
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // Common refresh logic could go here
    const handleRefresh = () => {
        setLoading(true);
        setTimeout(() => setLoading(false), 1000); // Simulate
        window.dispatchEvent(new Event('refresh-data')); // Or use Context
    };

    const isActive = (path) => location.pathname === path;

    return (
        <div className="flex min-h-screen bg-[#09090b] font-sans antialiased text-zinc-100 overflow-hidden relative">

            {/* Sidebar */}
            <aside
                className={clsx(
                    "border-r border-white/5 bg-zinc-950/50 flex flex-col backdrop-blur-xl z-20 transition-all duration-300 ease-in-out absolute lg:relative h-full",
                    isSidebarOpen ? "w-64 translate-x-0" : "w-0 -translate-x-full lg:w-20 lg:translate-x-0"
                )}
            >
                <div className="p-6 border-b border-white/5 flex items-center gap-3 overflow-hidden whitespace-nowrap h-20">
                    <div className="bg-indigo-500/20 p-2 rounded-lg border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)] shrink-0">
                        <Terminal className="text-indigo-400" size={24} />
                    </div>
                    <h1 className={clsx("text-lg font-bold tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 transition-opacity duration-200", !isSidebarOpen && "lg:opacity-0 hidden")}>
                        LogNexus
                    </h1>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-hidden">
                    <Link to="/" className={clsx("flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group font-medium whitespace-nowrap",
                        isActive('/') ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-lg shadow-indigo-500/10" : "text-zinc-400 hover:bg-white/5 hover:text-white",
                        !isSidebarOpen && "justify-center px-0"
                    )} title="Dashboard">
                        <LayoutDashboard size={18} className="shrink-0" />
                        <span className={clsx("transition-opacity duration-200", !isSidebarOpen && "lg:hidden")}>Dashboard</span>
                    </Link>
                    <Link to="/analytics" className={clsx("flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group font-medium whitespace-nowrap",
                        isActive('/analytics') ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-lg shadow-emerald-500/10" : "text-zinc-400 hover:bg-white/5 hover:text-white",
                        !isSidebarOpen && "justify-center px-0"
                    )} title="Analytics">
                        <Activity size={18} className="shrink-0" />
                        <span className={clsx("transition-opacity duration-200", !isSidebarOpen && "lg:hidden")}>Analytics</span>
                    </Link>
                    <Link to="/services" className={clsx("flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group font-medium whitespace-nowrap",
                        isActive('/services') ? "bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-lg shadow-blue-500/10" : "text-zinc-400 hover:bg-white/5 hover:text-white",
                        !isSidebarOpen && "justify-center px-0"
                    )} title="Services">
                        <Server size={18} className="shrink-0" />
                        <span className={clsx("transition-opacity duration-200", !isSidebarOpen && "lg:hidden")}>Services</span>
                    </Link>
                    <Link to="/security" className={clsx("flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group font-medium whitespace-nowrap",
                        isActive('/security') ? "bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-lg shadow-purple-500/10" : "text-zinc-400 hover:bg-white/5 hover:text-white",
                        !isSidebarOpen && "justify-center px-0"
                    )} title="Security">
                        <Shield size={18} className="shrink-0" />
                        <span className={clsx("transition-opacity duration-200", !isSidebarOpen && "lg:hidden")}>Security</span>
                    </Link>
                    <Link to="/server-health" className={clsx("flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group font-medium whitespace-nowrap",
                        isActive('/server-health') ? "bg-orange-500/10 text-orange-400 border border-orange-500/20 shadow-lg shadow-orange-500/10" : "text-zinc-400 hover:bg-white/5 hover:text-white",
                        !isSidebarOpen && "justify-center px-0"
                    )} title="Server Health">
                        <Cpu size={18} className="shrink-0" />
                        <span className={clsx("transition-opacity duration-200", !isSidebarOpen && "lg:hidden")}>Server Health</span>
                    </Link>
                </nav>

                {/* Collapse Toggle (Desktop) */}
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="absolute -right-3 top-24 bg-zinc-900 border border-white/10 rounded-full p-1 text-zinc-400 hover:text-white hidden lg:flex shadow-xl z-30"
                >
                    <ChevronLeft size={14} className={clsx("transition-transform duration-300", !isSidebarOpen && "rotate-180")} />
                </button>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden relative">

                {/* Header */}
                <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-zinc-950/30 backdrop-blur-md z-10 sticky top-0">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 -ml-2 hover:bg-white/5 rounded-lg text-zinc-400 lg:hidden"
                        >
                            <Menu size={20} />
                        </button>

                        <h2 className="text-sm font-medium text-zinc-500">Platform / <span className="text-zinc-200 font-semibold">{location.pathname === '/' ? 'Overview' : location.pathname.slice(1).charAt(0).toUpperCase() + location.pathname.slice(2)}</span></h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900/50 rounded-full border border-white/5 text-xs text-zinc-400 shadow-inner">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            System Operational
                        </div>

                        <button onClick={handleRefresh} className="p-2 hover:bg-white/5 rounded-lg transition-colors text-zinc-400 hover:text-white">
                            <RefreshCw size={16} className={clsx({ "animate-spin": loading })} />
                        </button>

                        <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 ring-2 ring-white/10 flex items-center justify-center font-bold text-xs shadow-lg shadow-indigo-500/20 text-white cursor-pointer hover:shadow-indigo-500/40 transition-shadow">
                            AD
                        </div>
                    </div>
                </header>

                <Routes>
                    <Route path="/" element={<DashboardPage />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/security" element={<Security />} />
                    <Route path="/server-health" element={<ServerHealth />} />
                </Routes>
            </main>
        </div>
    );
}

// Extracted from original App.jsx
function DashboardPage() {
    const [logs, setLogs] = useState([]);
    const [stats, setStats] = useState({
        total: 0,
        levels: { error: 0, warn: 0, info: 0 },
        errorRate: 0,
        trend: []
    });
    const [loading, setLoading] = useState(true);
    const [selectedLog, setSelectedLog] = useState(null);
    const [filters, setFilters] = useState({ search: '', level: '', dateRange: 'all' });
    const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 1 });

    const fetchData = async () => {
        try {
            const logsRes = await api.get('/logs', {
                params: {
                    page: pagination.page,
                    limit: pagination.limit,
                    level: filters.level,
                    search: filters.search
                }
            });

            const statsRes = await api.get('/stats');

            setLogs(logsRes.data.logs);
            setPagination(logsRes.data.pagination);
            setStats(statsRes.data);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch data", error);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 5000); // Poll every 5s
        return () => clearInterval(interval);
    }, [pagination.page, filters]);

    // Listen for manual refresh
    useEffect(() => {
        const handler = () => fetchData();
        window.addEventListener('refresh-data', handler);
        return () => window.removeEventListener('refresh-data', handler);
    }, []);

    return (
        <>
            <div className="flex-1 overflow-y-auto p-8 relative scroll-smooth">
                {/* Background ambient glow */}
                <div className="absolute top-0 left-0 w-full h-96 bg-indigo-900/10 blur-[100px] pointer-events-none"></div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 relative z-0">
                    <StatsCard title="Total Logs (All Time)" value={stats.total.toLocaleString()} type="total" />
                    <StatsCard title="Error Rate" value={`${stats.errorRate}%`} type="rate" />
                    <StatsCard title="Errors (24h)" value={stats.levels.error?.toLocaleString() || 0} type="error" />
                    <StatsCard title="Warnings (24h)" value={stats.levels.warn?.toLocaleString() || 0} type="warning" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 h-[400px]">
                    {/* Chart Section */}
                    <div className="lg:col-span-2 h-full">
                        <Charts data={stats.trend} />
                    </div>

                    {/* Log Level Distribution */}
                    <div className="h-full">
                        <LevelPieChart data={stats.levels} />
                    </div>
                </div>

                {/* Service Distribution */}
                <div className="h-[300px] mb-8">
                    <ServiceBarChart data={stats.services} />
                </div>

                {/* Logs Table */}
                <div className="min-h-[500px] relative z-0 mb-8">
                    <LogsTable
                        logs={logs}
                        loading={loading}
                        onLogClick={setSelectedLog}
                        filters={filters}
                        setFilters={setFilters}
                        pagination={pagination}
                        setPage={(page) => setPagination(prev => ({ ...prev, page }))}
                    />
                </div>
            </div>
            {selectedLog && (
                <LogModal log={selectedLog} onClose={() => setSelectedLog(null)} />
            )}
        </>
    );
}

function App() {
    return (
        <Router>
            <Layout />
        </Router>
    );
}

export default App;
