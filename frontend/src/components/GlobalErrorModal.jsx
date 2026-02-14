import React, { useEffect, useState } from 'react';
import { X, AlertTriangle, ServerCrash } from 'lucide-react';

const GlobalErrorModal = () => {
    const [error, setError] = useState(null);

    useEffect(() => {
        const handleError = (event) => {
            setError(event.detail);
        };

        window.addEventListener('global-server-error', handleError);
        return () => window.removeEventListener('global-server-error', handleError);
    }, []);

    const onClose = () => setError(null);

    if (!error) return null;

    const isLogError = error.type === 'log-error';

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-zinc-900 border border-red-500/30 rounded-xl shadow-2xl w-full max-w-lg flex flex-col animate-in zoom-in-95 duration-200 relative overflow-hidden">
                {/* Red warning glow */}
                <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-red-600 via-orange-500 to-red-600"></div>
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-red-500/10 rounded-full blur-3xl pointer-events-none"></div>

                <div className="flex items-center justify-between p-6 border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg border ${isLogError ? 'bg-orange-500/10 border-orange-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                            {isLogError ? (
                                <AlertTriangle size={24} className="text-orange-500" />
                            ) : (
                                <ServerCrash size={24} className="text-red-500" />
                            )}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">
                                {error.type === 'log-error' ? 'Critical Application Error' : 'Server Error'}
                            </h2>
                            <p className="text-xs text-red-400 font-mono mt-0.5">
                                {error.type === 'log-error' ? (error.service ? `SERVICE: ${error.service.toUpperCase()}` : 'CRITICAL ALERT') : '500 INTERNAL SERVER ERROR'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-zinc-400 hover:text-white"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    <div className="flex items-start gap-4 mb-6">
                        <AlertTriangle className="text-orange-400 shrink-0 mt-1" size={20} />
                        <div className="space-y-2">
                            <p className="text-zinc-300 text-sm leading-relaxed">
                                {error.type === 'log-error'
                                    ? "A critical error log was detected in the system stream."
                                    : "An unexpected error occurred on the server. The system has logged this incident."}
                            </p>
                            {error.timestamp && (
                                <p className="text-zinc-500 text-xs">Encoded Time: {new Date(error.timestamp).toLocaleString()}</p>
                            )}
                        </div>
                    </div>

                    <div className="bg-zinc-950/50 rounded-lg border border-white/5 p-4">
                        <span className="text-zinc-500 text-xs uppercase tracking-wider font-semibold block mb-2">Error Details</span>
                        <div className="font-mono text-sm text-red-300 break-words whitespace-pre-wrap max-h-48 overflow-y-auto custom-scrollbar">
                            {error.message || "Unknown error occurred."}
                        </div>
                        {error.stack && (
                            <div className="mt-4 pt-4 border-t border-white/5">
                                <span className="text-zinc-600 text-xs uppercase tracking-wider font-semibold block mb-2">Stack Trace Preview</span>
                                <div className="text-xs text-zinc-500 font-mono whitespace-pre-wrap overflow-x-auto">
                                    {error.stack}
                                </div>
                            </div>
                        )}
                        {error.meta && (
                            <div className="mt-4 pt-4 border-t border-white/5">
                                <span className="text-zinc-600 text-xs uppercase tracking-wider font-semibold block mb-2">Metadata</span>
                                <pre className="text-xs text-zinc-500 font-mono whitespace-pre-wrap overflow-x-auto">
                                    {JSON.stringify(error.meta, null, 2)}
                                </pre>
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-6 border-t border-white/5 bg-zinc-900/50 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-lg border border-white/5 transition-colors"
                    >
                        Dismiss
                    </button>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg shadow-lg shadow-red-500/20 transition-all hover:scale-105"
                    >
                        Reload Page
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GlobalErrorModal;
