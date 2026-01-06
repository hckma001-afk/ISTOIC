import React, { useEffect, useState } from 'react';
import { 
    Check, X, Shield, Radio, User, 
    Smartphone, Globe, Lock, Activity, Loader2 
} from 'lucide-react';

interface ConnectionNotificationProps {
    identity: string;
    peerId: string;
    onAccept: () => void;
    onDecline: () => void;
    isProcessing?: boolean; // Prop baru untuk loading state
}

// Helper Haptic
const triggerHaptic = (pattern: number[]) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(pattern);
    }
};

export const ConnectionNotification: React.FC<ConnectionNotificationProps> = ({ 
    identity, 
    peerId, 
    onAccept, 
    onDecline,
    isProcessing = false
}) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Mount Animation & Haptic
        setIsVisible(true);
        triggerHaptic([100, 50, 100]); // Brr-brr pattern

        return () => setIsVisible(false);
    }, []);

    const handleAccept = () => {
        triggerHaptic([50]);
        onAccept();
    };

    const handleDecline = () => {
        triggerHaptic([50, 50]);
        setIsVisible(false);
        setTimeout(onDecline, 300); // Allow animation out
    };

    return (
        <div 
            className={`
                fixed top-0 left-0 right-0 z-[100000] 
                flex justify-center items-start pt-safe-top px-4 pb-4
                transition-all duration-500 ease-out transform
                ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}
            `}
        >
            {/* Main Card Container */}
            <div className="
                w-full max-w-sm md:max-w-md mt-4
                bg-[#09090b]/95 backdrop-blur-2xl 
                border border-emerald-500/50 
                rounded-3xl shadow-[0_10px_50px_rgba(16,185,129,0.3)] 
                overflow-hidden relative
                ring-1 ring-white/10
            ">
                
                {/* 1. Cyberpunk Scanning Effect (Background Animation) */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none"></div>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-scan-line shadow-[0_0_15px_#34d399]"></div>
                
                <div className="p-5 relative z-10">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-20"></div>
                                <div className="p-1.5 bg-emerald-500/20 rounded-full border border-emerald-500/50">
                                    <Radio size={14} className="text-emerald-400 animate-pulse" />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xs font-black text-white tracking-[0.2em] uppercase">INCOMING UPLINK</h3>
                                <p className="text-[9px] text-emerald-500/80 font-mono flex items-center gap-1">
                                    <Lock size={8} /> E2EE ENCRYPTED
                                </p>
                            </div>
                        </div>
                        <div className="px-2 py-1 bg-white/5 rounded text-[9px] font-bold text-neutral-400 border border-white/5">
                            P2P
                        </div>
                    </div>

                    {/* Identity Card */}
                    <div className="flex items-start gap-4 mb-5">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-neutral-800 to-black border border-white/10 flex items-center justify-center shrink-0 shadow-inner relative overflow-hidden group">
                            <div className="absolute inset-0 bg-emerald-500/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                            <User className="text-neutral-400 relative z-10" size={20} />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                            <h4 className="text-white font-bold text-sm truncate flex items-center gap-2">
                                {identity || 'Anonymous User'} 
                                <Activity size={12} className="text-emerald-500"/>
                            </h4>
                            <div className="mt-1 flex items-center gap-1.5 p-1.5 bg-black/50 rounded-lg border border-white/5 w-fit max-w-full">
                                <Globe size={10} className="text-blue-400" />
                                <code className="text-[10px] text-neutral-400 font-mono truncate select-all">
                                    {peerId}
                                </code>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-5 gap-3">
                        <button 
                            onClick={handleDecline}
                            disabled={isProcessing}
                            className="col-span-2 py-3.5 bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 rounded-2xl text-xs font-bold text-neutral-400 hover:text-red-400 transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                            <X size={16} /> BLOCK
                        </button>
                        
                        <button 
                            onClick={handleAccept}
                            disabled={isProcessing}
                            className={`
                                col-span-3 py-3.5 rounded-2xl text-xs font-black tracking-wider text-white shadow-lg 
                                flex items-center justify-center gap-2 transition-all active:scale-95
                                ${isProcessing 
                                    ? 'bg-neutral-800 cursor-wait opacity-80' 
                                    : 'bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 shadow-emerald-500/20'
                                }
                            `}
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" /> ESTABLISHING...
                                </>
                            ) : (
                                <>
                                    <Shield size={16} className="fill-current" /> ACCEPT SECURE
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Bottom Progress Bar (Visual Timer Hint) */}
                <div className="h-0.5 w-full bg-neutral-800">
                    <div className="h-full bg-emerald-500 w-full animate-[shrink_30s_linear_forwards] origin-left"></div>
                </div>
            </div>
        </div>
    );
};