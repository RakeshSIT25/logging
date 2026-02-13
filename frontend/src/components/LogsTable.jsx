import React, { useState } from 'react';
import clsx from 'clsx';
import { Search, ChevronLeft, ChevronRight, Filter, MoreHorizontal, Clock, ArrowDown } from 'lucide-react';

const levelStyles = {
    info: 'bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.1)]',
    error: 'bg-red-500/10 text-red-500 border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.1)]',
    warn: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20 shadow-[0_0_10px_rgba(234,179,8,0.1)]',
    debug: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
};

const LogsTable = ({ logs, onLogClick, filters, setFilters, pagination, setPage, loading }) => {
    const handleSearch = (e) => {
        setFilters(prev => ({ ...prev, search: e.target.value }));
    };

    const handleLevelChange = (e) => {
        setFilters(prev => ({ ...prev, level: e.target.value || undefined }));
    };

    return (
        <div className="flex flex-col h-full bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-xl overflow-hidden shadow-2xl">
            {/* Header & Filters */}
            <div className="p-4 border-b border-white/5 flex flex-wrap gap-4 items-center justify-between bg-white/5">
                <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <h3 className="text-sm font-semibold text-zinc-200 tracking-wide uppercase">Live Logs</h3>
                </div>

                <div className="flex gap-3">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" size={14} />
                        <input
                            type="text"
                            placeholder="Search logs..."
                            className="bg-black/20 border border-white/10 text-zinc-300 text-xs rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 w-64 transition-all placeholder:text-zinc-600 font-mono"
                            value={filters.search || ''}
                            onChange={handleSearch}
                        />
                    </div>

                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
                        <select
                            className="bg-black/20 border border-white/10 text-zinc-300 text-xs rounded-lg pl-9 pr-8 py-2 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 appearance-none cursor-pointer hover:bg-white/5 transition-colors font-medium"
                            onChange={handleLevelChange}
                            value={filters.level || ''}
                        >
                            <option value="">All Levels</option>
                            <option value="info">Info</option>
                            <option value="warn">Warn</option>
                            <option value="error">Error</option>
                            <option value="debug">Debug</option>
                        </select>
                        <ArrowDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-auto flex-1 custom-scrollbar">
                <table className="w-full text-left border-collapse">
                    <thead className="text-[11px] uppercase tracking-wider bg-zinc-950/50 text-zinc-500 font-medium sticky top-0 z-10 backdrop-blur-sm shadow-sm">
                        <tr>
                            <th className="px-6 py-3 font-semibold border-b border-white/5 w-48">Timestamp</th>
                            <th className="px-6 py-3 font-semibold border-b border-white/5 w-24">Level</th>
                            <th className="px-6 py-3 font-semibold border-b border-white/5 w-32">Service</th>
                            <th className="px-6 py-3 font-semibold border-b border-white/5">Message</th>
                            <th className="px-6 py-3 font-semibold border-b border-white/5 w-10"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-mono text-xs">
                        {loading && logs.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-20 text-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <i className="animate-spin h-6 w-6 border-b-2 border-indigo-500 rounded-full"></i>
                                        <span className="text-zinc-600">Loading stream...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : logs.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-zinc-600">
                                    No logs found matching your criteria.
                                </td>
                            </tr>
                        ) : (
                            logs.map((log) => (
                                <tr
                                    key={log.id}
                                    onClick={() => onLogClick(log)}
                                    className="group hover:bg-white/[0.02] cursor-pointer transition-all duration-75"
                                >
                                    <td className="px-6 py-3 whitespace-nowrap text-zinc-500 group-hover:text-zinc-400">
                                        <div className="flex items-center gap-2">
                                            <Clock size={12} className="opacity-50" />
                                            {new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                            <span className="text-[10px] text-zinc-700">.{new Date(log.timestamp).getMilliseconds()}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-3 whitespace-nowrap">
                                        <span className={clsx("px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border", levelStyles[log.level] || levelStyles.info)}>
                                            {log.level}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3 whitespace-nowrap text-zinc-400 font-medium group-hover:text-zinc-200">
                                        {log.service}
                                    </td>
                                    <td className="px-6 py-3 text-zinc-300 truncate max-w-xl group-hover:text-white">
                                        {log.message}
                                    </td>
                                    <td className="px-6 py-3 text-right">
                                        <MoreHorizontal size={14} className="text-zinc-700 group-hover:text-zinc-400 transition-colors" />
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="p-3 border-t border-white/5 flex items-center justify-between bg-zinc-950/30 text-xs">
                <span className="text-zinc-500">
                    Page <span className="font-semibold text-zinc-300">{pagination.page}</span> of {pagination.totalPages}
                </span>
                <div className="flex gap-1">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={pagination.page === 1}
                        className="p-1.5 rounded-md hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-zinc-400 hover:text-white"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <button
                        onClick={() => setPage(p => p + 1)}
                        disabled={pagination.page >= pagination.totalPages}
                        className="p-1.5 rounded-md hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-zinc-400 hover:text-white"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LogsTable;
