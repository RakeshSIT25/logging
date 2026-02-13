import React from 'react';
import clsx from 'clsx';
import { Activity, AlertTriangle, CheckCircle, AlertOctagon, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const icons = {
    total: Activity,
    error: AlertOctagon,
    warning: AlertTriangle,
    rate: CheckCircle
};

const styles = {
    total: {
        gradient: 'from-blue-500/20 to-cyan-500/20',
        text: 'text-blue-400',
        icon: 'text-blue-400',
        border: 'border-blue-500/20'
    },
    error: {
        gradient: 'from-red-500/20 to-orange-500/20',
        text: 'text-red-400',
        icon: 'text-red-400',
        border: 'border-red-500/20'
    },
    warning: {
        gradient: 'from-yellow-500/20 to-orange-500/20',
        text: 'text-yellow-400',
        icon: 'text-yellow-400',
        border: 'border-yellow-500/20'
    },
    rate: {
        gradient: 'from-emerald-500/20 to-teal-500/20',
        text: 'text-emerald-400',
        icon: 'text-emerald-400',
        border: 'border-emerald-500/20'
    }
};

const StatsCard = ({ title, value, type, trend }) => {
    const Icon = icons[type] || Activity;
    const style = styles[type] || styles.total;

    return (
        <div className="relative group overflow-hidden rounded-xl bg-zinc-900/40 backdrop-blur-sm border border-white/5 p-6 transition-all hover:bg-zinc-800/40">
            <div className={`absolute inset-0 bg-gradient-to-br ${style.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

            <div className="relative flex justify-between items-start">
                <div>
                    <p className="text-zinc-500 text-xs font-medium uppercase tracking-wider mb-1">{title}</p>
                    <h3 className="text-3xl font-bold text-white font-mono tracking-tight">{value}</h3>
                </div>
                <div className={clsx("p-2.5 rounded-xl bg-white/5 border border-white/5", style.text)}>
                    <Icon size={20} strokeWidth={2.5} />
                </div>
            </div>

            {/* Decorative glow */}
            <div className={clsx("absolute -bottom-4 -right-4 w-24 h-24 bg-current opacity-5 blur-2xl rounded-full", style.text)} />
        </div>
    );
};

export default StatsCard;
