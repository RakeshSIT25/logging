import React, { useEffect } from 'react';
import { X, Copy } from 'lucide-react';

const LogModal = ({ log, onClose }) => {
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    if (!log) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl w-full max-w-3xl max-h-[80vh] flex flex-col animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-6 border-b border-gray-700">
                    <div>
                        <h2 className="text-xl font-bold text-gray-100">Log Details</h2>
                        <p className="text-sm text-gray-400 mt-1">ID: {log.id} • {new Date(log.timestamp).toLocaleString()}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                        <X size={20} className="text-gray-400" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto flex-1 font-mono text-sm">
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-700/50">
                            <span className="text-gray-500 uppercase text-xs tracking-wider block mb-1">Service</span>
                            <span className="text-blue-400 font-semibold">{log.service}</span>
                        </div>
                        <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-700/50">
                            <span className="text-gray-500 uppercase text-xs tracking-wider block mb-1">Level</span>
                            <span className={log.level === 'error' ? 'text-red-400 font-semibold' : 'text-green-400 font-semibold'} >{log.level.toUpperCase()}</span>
                        </div>
                    </div>

                    <div className="mb-6">
                        <span className="text-gray-500 uppercase text-xs tracking-wider block mb-2">Message</span>
                        <div className="bg-gray-950 p-4 rounded-lg border border-gray-800 text-gray-200 whitespace-pre-wrap">
                            {log.message}
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-500 uppercase text-xs tracking-wider">Metadata</span>
                            <button
                                className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                                onClick={() => navigator.clipboard.writeText(JSON.stringify(log.meta, null, 2))}
                            >
                                <Copy size={12} /> Copy JSON
                            </button>
                        </div>
                        <pre className="bg-gray-950 p-4 rounded-lg border border-gray-800 text-green-400 overflow-x-auto">
                            {JSON.stringify(log.meta, null, 2)}
                        </pre>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LogModal;
