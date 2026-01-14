import React, { useState, useEffect, useRef } from 'react';
import { Shield, Lock, Unlock, AlertCircle, Fingerprint, Settings } from 'lucide-react';
import { verifyVaultAccess, isSystemPinConfigured } from '../utils/crypto';
import { Dialog } from './ui/Dialog';

interface VaultPinModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export const VaultPinModal: React.FC<VaultPinModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const [pin, setPin] = useState('');
    const [error, setError] = useState(false);
    const [shake, setShake] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [isConfigured, setIsConfigured] = useState(true);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setPin('');
            setError(false);
            const configured = isSystemPinConfigured();
            setIsConfigured(configured);
            
            if (configured) {
                setTimeout(() => inputRef.current?.focus(), 100);
            }
        }
    }, [isOpen]);

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        setVerifying(true);
        
        if (!isConfigured) {
            onSuccess();
            onClose();
            return;
        }

        const isValid = await verifyVaultAccess(pin);

        if (isValid) {
            onSuccess();
            onClose();
        } else {
            setError(true);
            setShake(true);
            setPin('');
            setTimeout(() => setShake(false), 500);
        }
        setVerifying(false);
    };

    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            title="Unlock Vault"
            size="sm"
            footer={
                <button 
                    onClick={() => handleSubmit()}
                    disabled={verifying}
                    className="px-4 py-2 rounded-lg bg-accent text-black font-semibold text-sm tracking-wide hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2"
                    type="button"
                >
                    {isConfigured ? (error ? <Lock size={14} /> : <Unlock size={14} />) : <Settings size={14} />} 
                    {isConfigured ? (verifying ? 'Verifying...' : (error ? 'Retry' : 'Unlock')) : 'Proceed'}
                </button>
            }
        >
            <div className="flex flex-col items-center gap-4">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 ${error ? 'bg-danger/10 text-danger shadow-[0_0_30px_rgba(255,0,30,0.15)]' : 'bg-accent/10 text-accent shadow-[0_0_30px_var(--accent-glow)]'}`}>
                    {isConfigured ? (error ? <AlertCircle size={28} /> : <Shield size={28} />) : <Settings size={28} />}
                </div>

                <div className="text-center space-y-1">
                    <h3 className="heading-3 text-text">
                        {isConfigured ? (error ? 'Authentication failed' : 'Enter vault PIN') : 'Vault not configured'}
                    </h3>
                    <p className="caption text-text-muted">
                        {isConfigured ? 'Keep your data secure with your PIN.' : 'Set up a PIN in Settings to secure your data.'}
                    </p>
                </div>

                {isConfigured ? (
                    <form onSubmit={handleSubmit} className="w-full relative">
                        <input 
                            ref={inputRef}
                            type="password" 
                            value={pin}
                            onChange={(e) => { setPin(e.target.value); setError(false); }}
                            className={`w-full bg-skin-surface border border-skin-border rounded-xl px-4 py-4 text-center text-2xl font-black text-text tracking-[0.5em] focus:outline-none focus:border-accent transition-all placeholder:text-text-muted ${shake ? 'animate-[shake_0.5s_cubic-bezier(.36,.07,.19,.97)_both]' : ''}`}
                            placeholder="******"
                            maxLength={10}
                            autoComplete="off"
                            disabled={verifying}
                        />
                        <Fingerprint className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted/50 pointer-events-none" size={20} />
                    </form>
                ) : (
                    <div className="text-center text-sm text-text-muted px-2">
                        Security is disabled. Configure a PIN in Settings to protect your vault.
                    </div>
                )}
            </div>
            <style>{`
                @keyframes shake {
                    10%, 90% { transform: translate3d(-1px, 0, 0); }
                    20%, 80% { transform: translate3d(2px, 0, 0); }
                    30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
                    40%, 60% { transform: translate3d(4px, 0, 0); }
                }
            `}</style>
        </Dialog>
    );
};
