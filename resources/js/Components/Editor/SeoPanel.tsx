import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Loader2, AlertCircle, CheckCircle2, Info, TriangleAlert } from 'lucide-react';
import { cn } from '@/lib/utils';
import { scaleIn } from '@/lib/motion';
import type { AiJobStatus } from '@/hooks/useAiJob';

/* ─────────────────────────────────────────────
   Types
   ───────────────────────────────────────────── */
export interface SeoAnalysisResult {
    skor: number;
    meta_description_saran: string;
    kata_kunci_utama: string[];
    saran: Array<{
        tipe: 'warning' | 'success' | 'info';
        pesan: string;
    }>;
    keterbacaan: string;
    estimasi_baca: string;
}

export interface SeoPanelProps {
    /** Current meta title value */
    metaTitle: string;
    /** Current meta description */
    metaDescription: string;
    /** Setter for meta title */
    onMetaTitleChange: (val: string) => void;
    /** Setter for meta description */
    onMetaDescriptionChange: (val: string) => void;
    /** Validation errors */
    errors?: { meta_title?: string; meta_description?: string };
    /** Trigger SEO analysis */
    onAnalyze: () => void;
    /** Whether analysis is running */
    isAnalyzing: boolean;
    /** Job status */
    jobStatus: AiJobStatus | null;
    /** Analysis result */
    analysisResult: SeoAnalysisResult | null;
    /** Error from job */
    jobError: string | null;
}

/* ─────────────────────────────────────────────
   Gauge / Donut Chart
   ───────────────────────────────────────────── */
function SeoGauge({ score }: { score: number }) {
    const clampedScore = Math.max(0, Math.min(100, score));
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const dashOffset = circumference - (clampedScore / 100) * circumference;

    const colorClass =
        clampedScore >= 75
            ? '#22c55e'  // green
            : clampedScore >= 50
              ? '#f59e0b' // amber
              : '#ef4444'; // red

    const label =
        clampedScore >= 75 ? 'Baik' : clampedScore >= 50 ? 'Cukup' : 'Perlu Perbaikan';

    return (
        <div className="flex flex-col items-center gap-1">
            <svg viewBox="0 0 100 100" className="w-24 h-24 -rotate-90">
                {/* Track */}
                <circle
                    cx="50" cy="50" r={radius}
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="10"
                />
                {/* Progress */}
                <motion.circle
                    cx="50" cy="50" r={radius}
                    fill="none"
                    stroke={colorClass}
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: dashOffset }}
                    transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
                />
                {/* Center text */}
                <text
                    x="50" y="50"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="rotate-90 origin-center"
                    style={{
                        transform: 'rotate(90deg)',
                        transformOrigin: '50% 50%',
                        fill: colorClass,
                        fontSize: '20px',
                        fontWeight: '700',
                    }}
                >
                    {clampedScore}
                </text>
            </svg>
            <span className="text-xs font-semibold" style={{ color: colorClass }}>
                {label}
            </span>
        </div>
    );
}

/* ─────────────────────────────────────────────
   Saran Item
   ───────────────────────────────────────────── */
function SaranItem({ tipe, pesan }: { tipe: 'warning' | 'success' | 'info'; pesan: string }) {
    const config = {
        warning: { icon: TriangleAlert, color: 'text-amber-500', bg: 'bg-amber-50 border-amber-100' },
        success: { icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100' },
        info:    { icon: Info,         color: 'text-blue-500',   bg: 'bg-blue-50 border-blue-100' },
    }[tipe];

    const Icon = config.icon;

    return (
        <div className={cn('flex gap-2.5 items-start p-3 rounded-xl border', config.bg)}>
            <Icon className={cn('w-4 h-4 shrink-0 mt-0.5', config.color)} strokeWidth={1.5} />
            <p className="text-xs text-neutral-700 leading-relaxed">{pesan}</p>
        </div>
    );
}

/* ─────────────────────────────────────────────
   Character Counter
   ───────────────────────────────────────────── */
function CharCounter({ value, max }: { value: string; max: number }) {
    const count = value.length;
    const over = count > max;
    return (
        <span className={cn('text-xs', over ? 'text-red-500 font-semibold' : 'text-neutral-400')}>
            {count}/{max}
        </span>
    );
}

/* ─────────────────────────────────────────────
   SeoPanel
   ───────────────────────────────────────────── */
export function SeoPanel({
    metaTitle,
    metaDescription,
    onMetaTitleChange,
    onMetaDescriptionChange,
    errors,
    onAnalyze,
    isAnalyzing,
    jobStatus,
    analysisResult,
    jobError,
}: SeoPanelProps) {
    const [hasAnalyzed, setHasAnalyzed] = useState(false);

    const handleAnalyze = () => {
        setHasAnalyzed(true);
        onAnalyze();
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-5 flex flex-col gap-4">
            {/* ── Header ── */}
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <h3 className="text-base font-semibold text-neutral-900">SEO</h3>
                <button
                    type="button"
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className={cn(
                        'flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all',
                        'bg-gradient-to-r from-[#001f4d] to-[#003f87] text-white',
                        'hover:from-[#002a6b] hover:to-[#0050b0] shadow-md shadow-[#003f87]/20',
                        'disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none',
                        'active:scale-95',
                    )}
                >
                    {isAnalyzing ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" strokeWidth={1.5} />
                    ) : (
                        <Sparkles className="w-3.5 h-3.5" strokeWidth={1.5} />
                    )}
                    ✦ Analisis SEO
                </button>
            </div>

            {/* ── Meta Title ── */}
            <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-neutral-700">Meta Title</label>
                    <CharCounter value={metaTitle} max={60} />
                </div>
                <input
                    type="text"
                    value={metaTitle}
                    onChange={(e) => onMetaTitleChange(e.target.value)}
                    placeholder="Judul SEO optimal max 60 karakter"
                    maxLength={80}
                    className={cn(
                        'w-full px-3.5 py-2.5 rounded-xl border text-sm text-neutral-800 placeholder:text-neutral-400',
                        'focus:outline-none focus:ring-2 focus:ring-[#003f87]/30 focus:border-[#003f87] transition-all',
                        errors?.meta_title ? 'border-red-400 bg-red-50/40' : 'border-neutral-200',
                    )}
                />
                {/* Progress bar */}
                <div className="w-full h-1 bg-neutral-100 rounded-full overflow-hidden">
                    <div
                        className={cn(
                            'h-full rounded-full transition-all duration-300',
                            metaTitle.length > 60 ? 'bg-red-400' :
                            metaTitle.length > 40 ? 'bg-emerald-400' :
                            'bg-amber-400',
                        )}
                        style={{ width: `${Math.min(100, (metaTitle.length / 60) * 100)}%` }}
                    />
                </div>
                {errors?.meta_title && (
                    <p className="text-xs text-red-500">{errors.meta_title}</p>
                )}
            </div>

            {/* ── Meta Description ── */}
            <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-neutral-700">Meta Description</label>
                    <CharCounter value={metaDescription} max={155} />
                </div>
                <textarea
                    value={metaDescription}
                    onChange={(e) => onMetaDescriptionChange(e.target.value)}
                    placeholder="Deskripsi SEO optimal max 155 karakter"
                    rows={3}
                    maxLength={200}
                    className={cn(
                        'w-full px-3.5 py-2.5 rounded-xl border text-sm text-neutral-800 placeholder:text-neutral-400 resize-none',
                        'focus:outline-none focus:ring-2 focus:ring-[#003f87]/30 focus:border-[#003f87] transition-all',
                        errors?.meta_description ? 'border-red-400 bg-red-50/40' : 'border-neutral-200',
                    )}
                />
                {/* Progress bar */}
                <div className="w-full h-1 bg-neutral-100 rounded-full overflow-hidden">
                    <div
                        className={cn(
                            'h-full rounded-full transition-all duration-300',
                            metaDescription.length > 155 ? 'bg-red-400' :
                            metaDescription.length > 100 ? 'bg-emerald-400' :
                            'bg-amber-400',
                        )}
                        style={{ width: `${Math.min(100, (metaDescription.length / 155) * 100)}%` }}
                    />
                </div>
                {errors?.meta_description && (
                    <p className="text-xs text-red-500">{errors.meta_description}</p>
                )}
            </div>

            {/* ── Analysis Result ── */}
            <AnimatePresence>
                {hasAnalyzed && (
                    <motion.div
                        variants={scaleIn}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="flex flex-col gap-3"
                    >
                        {/* Loading */}
                        {isAnalyzing && jobStatus !== 'done' && (
                            <div className="flex items-center gap-2 py-3 px-4 rounded-xl bg-[#003f87]/5 border border-[#003f87]/10">
                                <Loader2 className="w-4 h-4 text-[#003f87] animate-spin shrink-0" strokeWidth={1.5} />
                                <span className="text-sm text-[#003f87] font-medium">Menganalisis SEO...</span>
                            </div>
                        )}

                        {/* Error */}
                        {jobError && !isAnalyzing && (
                            <div className="flex items-start gap-2.5 py-3 px-4 rounded-xl bg-red-50 border border-red-100">
                                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" strokeWidth={1.5} />
                                <p className="text-xs text-red-700 leading-relaxed">{jobError}</p>
                            </div>
                        )}

                        {/* Result */}
                        {analysisResult && !isAnalyzing && (
                            <div className="flex flex-col gap-3 border-t border-neutral-100 pt-3">
                                {/* Score gauge */}
                                <div className="flex flex-col items-center gap-2 py-3">
                                    <SeoGauge score={analysisResult.skor} />
                                    <div className="flex gap-3 text-xs text-neutral-500">
                                        <span>📖 {analysisResult.keterbacaan}</span>
                                        <span>⏱ {analysisResult.estimasi_baca} baca</span>
                                    </div>
                                </div>

                                {/* Keywords */}
                                {analysisResult.kata_kunci_utama.length > 0 && (
                                    <div>
                                        <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest mb-2">
                                            Kata Kunci Utama
                                        </p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {analysisResult.kata_kunci_utama.map((kw) => (
                                                <span
                                                    key={kw}
                                                    className="px-2 py-1 bg-[#003f87]/8 text-[#003f87] rounded-lg text-[11px] font-medium"
                                                >
                                                    {kw}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Suggested meta description */}
                                {analysisResult.meta_description_saran && (
                                    <div className="bg-emerald-50 rounded-xl border border-emerald-100 p-3">
                                        <p className="text-[10px] font-semibold text-emerald-600 uppercase tracking-widest mb-1.5">
                                            Saran Meta Description
                                        </p>
                                        <p className="text-xs text-emerald-800 leading-relaxed mb-2">
                                            {analysisResult.meta_description_saran}
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                onMetaDescriptionChange(analysisResult.meta_description_saran)
                                            }
                                            className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 underline underline-offset-2 transition-colors"
                                        >
                                            Gunakan Saran Meta Description Ini →
                                        </button>
                                    </div>
                                )}

                                {/* Saran list */}
                                {analysisResult.saran.length > 0 && (
                                    <div className="flex flex-col gap-2">
                                        <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest">
                                            Saran Perbaikan
                                        </p>
                                        {analysisResult.saran.map((s, i) => (
                                            <SaranItem key={i} tipe={s.tipe} pesan={s.pesan} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default SeoPanel;
