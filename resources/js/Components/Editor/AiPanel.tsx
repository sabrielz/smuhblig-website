import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, CornerDownLeft, RefreshCw, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { slideFromRight } from '@/lib/motion';

/* ─────────────────────────────────────────────
   Types
   ───────────────────────────────────────────── */
export type AiPanelMode = 'generate' | 'correct' | 'translate';

export interface AiPanelProps {
    /** Whether to show the panel */
    open: boolean;
    /** Panel mode drives header copy */
    mode: AiPanelMode;
    /** Loading state */
    isLoading: boolean;
    /** HTML result from AI */
    result: string | null;
    /** Error message if AI failed */
    error: string | null;
    /** Called when user accepts the result */
    onAccept: (result: string) => void;
    /** Called when user dismisses / rejects */
    onClose: () => void;
    /** Called to retry after error */
    onRetry?: () => void;
    /** Summary info, e.g. "X koreksi ditemukan" */
    summary?: string;
}

/* ─────────────────────────────────────────────
   Helpers
   ───────────────────────────────────────────── */
const PANEL_TITLES: Record<AiPanelMode, string> = {
    generate: 'Draft Artikel AI',
    correct: 'Koreksi Grammar',
    translate: 'Terjemahan AI',
};

const PANEL_SUBTITLES: Record<AiPanelMode, string> = {
    generate: 'Preview draft sebelum dipakai',
    correct: 'Review perubahan yang disarankan',
    translate: 'Preview terjemahan sebelum dipakai',
};

const ACCEPT_LABELS: Record<AiPanelMode, string> = {
    generate: 'Gunakan Draft Ini',
    correct: 'Terapkan Koreksi',
    translate: 'Gunakan Terjemahan Ini',
};

/* ─────────────────────────────────────────────
   AiPanel
   ───────────────────────────────────────────── */
export function AiPanel({
    open,
    mode,
    isLoading,
    result,
    error,
    onAccept,
    onClose,
    onRetry,
    summary,
}: AiPanelProps) {
    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Semi-transparent backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px]"
                        onClick={onClose}
                    />

                    {/* Panel */}
                    <motion.aside
                        variants={slideFromRight}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="fixed top-0 right-0 h-screen z-50 w-[400px] bg-white shadow-2xl border-l border-neutral-100 flex flex-col overflow-hidden"
                    >
                        {/* ── Header ── */}
                        <div className="bg-gradient-to-r from-[#001f4d] to-[#003f87] px-5 py-4 flex-shrink-0">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center">
                                        <Sparkles className="w-3.5 h-3.5 text-[#c9a84c]" strokeWidth={1.5} />
                                    </div>
                                    <div>
                                        <h2 className="text-white font-semibold text-sm leading-tight">
                                            {PANEL_TITLES[mode]}
                                        </h2>
                                        <p className="text-white/50 text-[11px] leading-tight mt-0.5">
                                            {PANEL_SUBTITLES[mode]}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="text-white/50 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10"
                                >
                                    <X className="w-4 h-4" strokeWidth={1.5} />
                                </button>
                            </div>

                            {/* Summary badge */}
                            {summary && (
                                <div className="mt-3 px-3 py-1.5 bg-[#c9a84c]/15 rounded-lg border border-[#c9a84c]/20">
                                    <p className="text-[#c9a84c] text-xs font-semibold">{summary}</p>
                                </div>
                            )}
                        </div>

                        {/* ── Body ── */}
                        <div className="flex-1 overflow-y-auto">
                            {/* Loading */}
                            {isLoading && (
                                <div className="flex flex-col items-center justify-center h-full gap-4 p-8">
                                    <div className="relative">
                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#001f4d] to-[#003f87] flex items-center justify-center shadow-lg shadow-[#003f87]/30">
                                            <Sparkles className="w-6 h-6 text-[#c9a84c]" strokeWidth={1.5} />
                                        </div>
                                        <Loader2
                                            className="absolute -top-1 -right-1 w-5 h-5 text-[#003f87] animate-spin"
                                            strokeWidth={2}
                                        />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-neutral-800 font-semibold text-sm">
                                            AI sedang memproses...
                                        </p>
                                        <p className="text-neutral-500 text-xs mt-1">
                                            Biasanya memerlukan 5–15 detik
                                        </p>
                                    </div>

                                    {/* Animated dots */}
                                    <div className="flex gap-1.5">
                                        {[0, 1, 2].map((i) => (
                                            <motion.div
                                                key={i}
                                                animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
                                                transition={{
                                                    duration: 1.4,
                                                    repeat: Infinity,
                                                    delay: i * 0.2,
                                                    ease: 'easeInOut',
                                                }}
                                                className="w-2 h-2 rounded-full bg-[#003f87]"
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Error */}
                            {!isLoading && error && (
                                <div className="flex flex-col items-center justify-center h-full gap-4 p-8 text-center">
                                    <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center border border-red-100">
                                        <AlertCircle className="w-6 h-6 text-red-500" strokeWidth={1.5} />
                                    </div>
                                    <div>
                                        <p className="text-neutral-800 font-semibold text-sm">AI Gagal Memproses</p>
                                        <p className="text-neutral-500 text-xs mt-1.5 max-w-xs mx-auto leading-relaxed">
                                            {error}
                                        </p>
                                    </div>
                                    {onRetry && (
                                        <button
                                            type="button"
                                            onClick={onRetry}
                                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#003f87] text-white text-sm font-semibold hover:bg-[#002a6b] transition-colors"
                                        >
                                            <RefreshCw className="w-3.5 h-3.5" strokeWidth={1.5} />
                                            Coba Lagi
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* Result Preview */}
                            {!isLoading && result && (
                                <div className="p-5">
                                    <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest mb-3">
                                        Preview Hasil AI
                                    </p>
                                    <div
                                        className={cn(
                                            'rounded-xl border border-neutral-100 bg-neutral-50 p-5 text-sm text-neutral-700 leading-relaxed overflow-auto',
                                            'prose prose-sm prose-neutral max-w-none',
                                            '[&_h2]:text-[#003f87] [&_h2]:font-bold [&_h2]:text-base [&_h2]:mt-4 [&_h2]:mb-2',
                                            '[&_h3]:text-[#003f87] [&_h3]:font-semibold [&_h3]:mt-3 [&_h3]:mb-1.5',
                                            '[&_p]:mb-2.5 [&_p]:leading-relaxed',
                                            '[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3',
                                            '[&_li]:mb-1',
                                        )}
                                        // eslint-disable-next-line react/no-danger
                                        dangerouslySetInnerHTML={{ __html: result }}
                                    />
                                </div>
                            )}
                        </div>

                        {/* ── Footer Actions ── */}
                        {!isLoading && result && (
                            <div className="flex-shrink-0 p-5 border-t border-neutral-100 bg-white flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => onAccept(result)}
                                    className={cn(
                                        'flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-white transition-all',
                                        'bg-gradient-to-r from-[#001f4d] to-[#003f87]',
                                        'hover:from-[#002a6b] hover:to-[#0050b0]',
                                        'shadow-md shadow-[#003f87]/20 hover:shadow-lg hover:shadow-[#003f87]/30',
                                        'active:scale-[0.98]',
                                    )}
                                >
                                    <CornerDownLeft className="w-4 h-4 shrink-0" strokeWidth={1.5} />
                                    {ACCEPT_LABELS[mode]}
                                </button>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-5 py-3 rounded-xl border border-neutral-200 text-sm font-semibold text-neutral-600 hover:bg-neutral-50 hover:border-neutral-300 transition-all active:scale-[0.98]"
                                >
                                    Tolak
                                </button>
                            </div>
                        )}
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    );
}

export default AiPanel;
