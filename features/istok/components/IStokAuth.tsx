
import React, { useState } from 'react';
import { 
    Shield, Server, Copy, Check, ArrowRight, 
    ScanLine, Activity, Info, QrCode, Zap, Lock, X
} from 'lucide-react';

interface IStokAuthProps {
    identity: string;
    onRegenerateIdentity: () => void;
    onHost: () => void; // Legacy trigger kept for compatibility
    onJoin: (targetId: string, pin: string) => void;
    errorMsg?: string;
    onErrorClear: () => void;
    isRelayActive: boolean;
}

export const IStokAuth: React.FC<IStokAuthProps> = ({ 
    identity, 
    onRegenerateIdentity, 
    onHost, 
    onJoin,
    errorMsg,
    onErrorClear,
    isRelayActive
}) => {
    const [targetId, setTargetId] = useState('');
    const [pin, setPin] = useState('');
    const [copied, setCopied] = useState(false);
    const [showQr, setShowQr] = useState(false);

    const handleCopyID = () => {
        navigator.clipboard.writeText(identity);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        // Trigger host logic silently to ensure peer is ready when copying ID
        onHost();
    };

    const handleConnect = (e: React.FormEvent) => {
        e.preventDefault();
        if (!targetId || pin.length < 4) return;
        onJoin(targetId, pin);
    };

    return (
        <div className="flex flex-col items-center justify-center w-full min-h-[80vh] px-4 z-10 relative">
            
            {/* 1. BRAND HEADER - Minimalist */}
            <div className="text-center space-y-3 mb-10 animate-slide-down">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-bold uppercase tracking-[0.2em] text-emerald-500">
                    <Shield size={12} fill="currentColor" /> Encrypted P2P Layer
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight">
                    IStok <span className="text-emerald-500 italic">Secure</span>
                </h1>
                <p className="text-neutral-500 text-xs md:text-sm max-w-md mx-auto leading-relaxed">
                    Direct device-to-device communication. No servers reading your messages. 
                    {isRelayActive && <span className="text-emerald-600 font-medium ml-1">● Relay Active</span>}
                </p>
            </div>

            {/* 2. MAIN CARD - Unified Interface */}
            <div className="w-full max-w-5xl bg-[#09090b] rounded-[32px] border border-white/10 shadow-2xl overflow-hidden flex flex-col md:flex-row relative group ring-1 ring-white/5 animate-slide-up">
                
                {/* LEFT: MY IDENTITY (Host) */}
                <div className="w-full md:w-1/2 p-8 md:p-10 border-b md:border-b-0 md:border-r border-white/5 bg-gradient-to-br from-emerald-900/10 to-transparent relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-20 text-emerald-500">
                        <Server size={120} strokeWidth={0.5} />
                    </div>

                    <div className="relative z-10 h-full flex flex-col justify-between gap-8">
                        <div>
                            <h3 className="text-xs font-black text-neutral-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                <ScanLine size={14}/> My Frequency
                            </h3>
                            
                            <div className="space-y-4">
                                <div className="bg-black/40 border border-white/10 rounded-2xl p-4 group/id hover:border-emerald-500/30 transition-all">
                                    <label className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider block mb-1.5">Secure ID</label>
                                    <div className="flex items-center justify-between gap-3">
                                        <code className="text-lg md:text-xl font-mono text-emerald-400 truncate tracking-tight select-all">
                                            {identity}
                                        </code>
                                        <button 
                                            onClick={handleCopyID}
                                            className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all active:scale-95 shrink-0"
                                            title="Copy ID"
                                        >
                                            {copied ? <Check size={16} /> : <Copy size={16} />}
                                        </button>
                                    </div>
                                </div>
                                
                                <button 
                                    onClick={onHost} // Explicitly show QR
                                    className="w-full py-3 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-bold transition-all flex items-center justify-center gap-2"
                                >
                                    <QrCode size={14} /> Show QR Code
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 text-[10px] text-neutral-500 font-mono bg-black/20 p-3 rounded-xl border border-white/5">
                            <Activity size={12} className="text-emerald-500 animate-pulse" />
                            <span>AES-256-GCM Waiting for handshake...</span>
                        </div>
                    </div>
                </div>

                {/* RIGHT: CONNECT (Join) */}
                <div className="w-full md:w-1/2 p-8 md:p-10 bg-[#0c0c0e]">
                    <h3 className="text-xs font-black text-neutral-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                        <Zap size={14} /> Connect to Peer
                    </h3>

                    <form onSubmit={handleConnect} className="flex flex-col gap-5 h-full">
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider pl-1">Target ID</label>
                            <input 
                                value={targetId}
                                onChange={(e) => setTargetId(e.target.value)}
                                placeholder="Paste Peer ID here..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm font-mono text-white placeholder:text-neutral-700 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider pl-1">Access PIN</label>
                            <div className="flex gap-3">
                                <input 
                                    value={pin}
                                    onChange={(e) => setPin(e.target.value)}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={6}
                                    placeholder="000000"
                                    className="w-32 bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm font-mono text-center tracking-[0.3em] text-white placeholder:text-neutral-700 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all"
                                />
                                <div className="flex-1 flex items-center text-[10px] text-neutral-600 leading-tight">
                                    <Info size={12} className="mr-2 shrink-0"/> Ask host for their 6-digit PIN.
                                </div>
                            </div>
                        </div>

                        <div className="mt-auto pt-4">
                            <button 
                                type="submit"
                                disabled={!targetId || pin.length < 4}
                                className="w-full group relative overflow-hidden rounded-xl bg-white text-black py-4 font-black uppercase text-xs tracking-[0.2em] hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 shadow-lg hover:shadow-emerald-500/20"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    Initialize Link <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                </span>
                                <div className="absolute inset-0 bg-emerald-400 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0"></div>
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Error Toast */}
            {errorMsg && (
                <div className="absolute bottom-4 animate-slide-up bg-red-500/10 border border-red-500/20 text-red-500 px-6 py-3 rounded-full text-xs font-bold flex items-center gap-3 backdrop-blur-md shadow-xl">
                    <Lock size={14} />
                    {errorMsg}
                    <button onClick={onErrorClear} className="ml-2 hover:text-white"><X size={14}/></button>
                </div>
            )}
        </div>
    );
};
