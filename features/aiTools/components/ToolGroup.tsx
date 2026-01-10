
import React, { memo } from 'react';
import { Loader2, ChevronDown, ArrowUpRight } from 'lucide-react';

interface ToolGroupProps {
    title: string;
    icon: React.ReactNode;
    subtitle: string;
    isOpen: boolean;
    onToggle: () => void;
    children: React.ReactNode;
    isLoading?: boolean;
    loadingText?: string;
}

export const ToolGroup: React.FC<ToolGroupProps> = memo(({ 
    title, icon, subtitle, isOpen, onToggle, children, isLoading, loadingText 
}) => (
    <div className={`
        relative overflow-hidden rounded-[32px] md:rounded-[40px] border transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group transform-gpu will-change-[height,border-color,box-shadow]
        ${isOpen 
            ? 'bg-skin-card/95 border-accent/30 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] ring-1 ring-accent/20' 
            : 'bg-skin-card/40 border-skin-border hover:border-accent/20 hover:bg-skin-card/60 hover:shadow-xl' 
        }
        backdrop-blur-2xl
    `}>
        {/* Background Texture & Glow */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] mix-blend-overlay pointer-events-none"></div>
        <div className={`absolute top-0 right-0 w-[400px] h-[400px] bg-accent/5 blur-[100px] rounded-full pointer-events-none transition-opacity duration-1000 will-change-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`}></div>

        {/* Loading Progress Line */}
        <div className={`absolute top-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent shadow-[0_0_15px_var(--accent-color)] transition-all duration-1000 ease-in-out z-20 ${isLoading ? 'w-full opacity-100' : 'w-0 opacity-0'}`}></div>
        
        <button 
            onClick={onToggle} 
            className="w-full p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between cursor-pointer text-left focus:outline-none relative z-10 gap-6 md:gap-0"
        >
            <div className="flex items-start md:items-center gap-5 md:gap-8">
                <div className={`
                    w-14 h-14 md:w-20 md:h-20 rounded-[20px] flex items-center justify-center text-skin-muted shadow-sm border border-skin-border transition-all duration-500 shrink-0 relative overflow-hidden transform-gpu
                    ${isOpen ? 'bg-accent/10 text-accent border-accent/20' : 'bg-skin-surface group-hover:text-accent group-hover:scale-105 group-hover:rotate-3'}
                    ${isLoading ? 'text-accent' : ''}
                `}>
                    {isLoading && <div className="absolute inset-0 bg-accent/20 animate-pulse"></div>}
                    {isLoading 
                        ? <Loader2 size={28} className="animate-spin relative z-10" /> 
                        : React.cloneElement(icon as React.ReactElement<any>, { size: 32, strokeWidth: 1.5, className: "relative z-10" })
                    }
                </div>
                
                <div className="space-y-1">
                    <h3 className={`text-xl md:text-3xl font-black uppercase tracking-tighter italic leading-none transition-transform duration-300 ${isOpen ? 'text-skin-text translate-x-1' : 'text-skin-text group-hover:translate-x-1'}`}>
                        {title}
                    </h3>
                    <div className="flex flex-col gap-1">
                        <p className={`text-[9px] md:text-[10px] tech-mono font-black uppercase tracking-[0.25em] flex items-center gap-2 transition-all duration-500 ${isLoading ? 'text-accent animate-pulse' : 'text-skin-muted group-hover:text-skin-text'}`}>
                             {isLoading ? (loadingText || 'PROCESSING_DATA_STREAM...') : subtitle}
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4 md:gap-6 absolute top-6 right-6 md:static">
                {!isOpen && (
                    <div className="hidden md:flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-4 group-hover:translate-x-0 duration-300">
                        <span className="text-[9px] font-black uppercase tracking-widest text-skin-muted">Expand</span>
                        <ArrowUpRight size={18} className="text-accent" />
                    </div>
                )}
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full bg-skin-surface flex items-center justify-center transition-all duration-500 border border-skin-border ${isOpen ? 'rotate-180 bg-accent text-skin-card shadow-[0_0_20px_var(--accent-glow)] border-transparent' : 'text-skin-muted group-hover:text-skin-text'}`}>
                    <ChevronDown size={20} />
                </div>
            </div>
        </button>

        {/* Content Expansion Area - Optimized for Paint Flashing & Layout Thrashing */}
        <div 
            className={`transition-[max-height,opacity] duration-700 ease-[cubic-bezier(0.2,0,0,1)] overflow-hidden will-change-[max-height,opacity] ${isOpen ? 'max-h-[3000px] opacity-100' : 'max-h-0 opacity-0'}`}
        >
            <div className="px-4 pb-6 md:px-8 md:pb-8 pt-0 relative transform-gpu">
                {isLoading && (
                    <div className="absolute inset-0 bg-skin-card/80 backdrop-blur-sm z-20 flex items-center justify-center animate-fade-in rounded-b-[32px] border-t border-skin-border/50">
                        <div className="flex flex-col items-center gap-6 p-8 rounded-[32px] bg-skin-card border border-accent/20 shadow-[0_0_50px_rgba(var(--accent-rgb),0.2)] aspect-square justify-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-accent/5 animate-pulse"></div>
                            <div className="w-16 h-16 rounded-full border-4 border-accent/20 border-t-accent animate-spin shadow-[0_0_40px_var(--accent-glow)] relative z-10"></div>
                            <span className="text-[10px] tech-mono font-black text-accent animate-pulse tracking-[0.3em] uppercase relative z-10 text-center">NEURAL<br/>PROCESSING</span>
                        </div>
                    </div>
                )}
                <div className="bg-skin-surface rounded-[24px] border border-skin-border p-1 shadow-inner relative overflow-hidden">
                    {/* Render children only if open or previously opened to save memory if needed, but for smooth animation keep mounted. */}
                    {children}
                </div>
            </div>
        </div>
    </div>
));
