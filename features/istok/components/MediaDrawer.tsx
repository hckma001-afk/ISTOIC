
import React, { useMemo } from 'react';
import { X, Image as ImageIcon, FileText, Download, Grid } from 'lucide-react';

interface MediaDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    messages: any[]; // Raw message array
    onViewImage: (src: string) => void;
}

export const MediaDrawer: React.FC<MediaDrawerProps> = ({ isOpen, onClose, messages, onViewImage }) => {
    
    const media = useMemo(() => {
        return {
            images: messages.filter(m => m.type === 'IMAGE'),
            files: messages.filter(m => m.type === 'FILE')
        };
    }, [messages]);

    return (
        <div className={`
            fixed inset-y-0 right-0 w-full max-w-xs md:w-80 
            bg-[#09090b]/95 backdrop-blur-xl border-l border-white/10 z-[2020]
            transform transition-transform duration-300 ease-out shadow-2xl flex flex-col
            ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}>
            {/* Header with Safe Area */}
            <div className="pt-safe px-5 pb-5 border-b border-white/10 flex items-center justify-between bg-white/[0.02] shrink-0">
                <div className="flex items-center gap-2 text-emerald-500">
                    <Grid size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">EVIDENCE_LOCKER</span>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-neutral-400 hover:text-white transition-all">
                    <X size={16} />
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto custom-scroll p-4 space-y-6 pb-safe">
                
                {/* Images Section */}
                <div className="space-y-3">
                    <h4 className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-2">
                        <ImageIcon size={12} /> IMAGERY ({media.images.length})
                    </h4>
                    {media.images.length === 0 ? (
                        <div className="p-4 border border-dashed border-white/10 rounded-xl text-center">
                            <p className="text-[9px] text-neutral-600 font-mono">NO_VISUAL_DATA</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-2">
                            {media.images.map(img => (
                                <button 
                                    key={img.id}
                                    onClick={() => onViewImage(img.content)}
                                    className="aspect-square rounded-xl border border-white/10 overflow-hidden relative group hover:border-emerald-500/50 transition-all bg-black/20"
                                >
                                    <img src={img.content} className="w-full h-full object-cover" loading="lazy" />
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                        <Download size={16} className="text-white" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="h-[1px] bg-white/5 w-full"></div>

                {/* Files Section */}
                <div className="space-y-3">
                    <h4 className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-2">
                        <FileText size={12} /> DOCUMENTS ({media.files.length})
                    </h4>
                    {media.files.length === 0 ? (
                        <div className="p-4 border border-dashed border-white/10 rounded-xl text-center">
                            <p className="text-[9px] text-neutral-600 font-mono">NO_FILES_SECURED</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {media.files.map(file => (
                                <a 
                                    key={file.id}
                                    href={`data:${file.mimeType || 'application/octet-stream'};base64,${file.content}`}
                                    download={file.fileName || 'secure_file'}
                                    className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-emerald-500/30 transition-all group"
                                >
                                    <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-lg group-hover:bg-blue-500/20">
                                        <FileText size={16} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[10px] font-bold text-white truncate">{file.fileName}</p>
                                        <p className="text-[8px] font-mono text-neutral-500">{(file.size / 1024).toFixed(1)} KB</p>
                                    </div>
                                    <Download size={14} className="text-neutral-500 group-hover:text-emerald-500" />
                                </a>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
