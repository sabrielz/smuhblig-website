import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Wand2, Search, X, Loader2, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

/* ─────────────────────────────────────────────
   Types
   ───────────────────────────────────────────── */
export interface GenerateDraftParams {
    topic: string;
    points: string;
    tone: 'formal' | 'semi_formal' | 'informatif';
    locale: 'id' | 'en';
}

export interface AiToolbarProps {
    /** Called when user submits the Generate Draft form */
    onGenerate: (params: GenerateDraftParams) => void;
    /** Called when user confirms grammar correction */
    onCorrect: () => void;
    /** Called when user clicks Analisis SEO */
    onOpenSeo: () => void;
    /** Whether an AI job is currently running */
    isLoading: boolean;
    /** True when editor is empty or content < 100 chars — shows Generate button */
    editorEmpty: boolean;
    /** Current locale tab */
    locale?: 'id' | 'en';
}

/* ─────────────────────────────────────────────
   Modal: Generate Draft
   ───────────────────────────────────────────── */
interface GenerateModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (params: GenerateDraftParams) => void;
    locale: 'id' | 'en';
}

function GenerateModal({ open, onClose, onSubmit, locale }: GenerateModalProps) {
    const [topic, setTopic] = useState('');
    const [points, setPoints] = useState('');
    const [tone, setTone] = useState<GenerateDraftParams['tone']>('semi_formal');
    const [targetLocale, setTargetLocale] = useState<'id' | 'en'>(locale);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!topic.trim()) return;
        onSubmit({ topic: topic.trim(), points: points.trim(), tone, locale: targetLocale });
        onClose();
    };

    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
                        onClick={onClose}
                    />
                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
                    >
                        <div
                            className="pointer-events-auto bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="bg-gradient-to-r from-[#001f4d] to-[#003f87] px-6 py-4 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-[#c9a84c]" strokeWidth={1.5} />
                                    <h2 className="text-white font-semibold text-base">Generate Draft Artikel</h2>
                                </div>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="text-white/60 hover:text-white transition-colors rounded-lg p-1 hover:bg-white/10"
                                >
                                    <X className="w-4 h-4" strokeWidth={1.5} />
                                </button>
                            </div>

                            {/* Body */}
                            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
                                {/* Topic */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-semibold text-neutral-700">
                                        Topik / Judul Artikel <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={topic}
                                        onChange={(e) => setTopic(e.target.value)}
                                        placeholder="Contoh: Peluncuran Program Beasiswa SMK Muhammadiyah Bligo 2025"
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#003f87]/30 focus:border-[#003f87] transition-all"
                                        required
                                    />
                                </div>

                                {/* Points */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-semibold text-neutral-700">
                                        Poin-poin yang Ingin Dibahas{' '}
                                        <span className="text-neutral-400 font-normal">(opsional)</span>
                                    </label>
                                    <textarea
                                        value={points}
                                        onChange={(e) => setPoints(e.target.value)}
                                        placeholder="Satu poin per baris. Contoh:&#10;- Latar belakang program&#10;- Persyaratan pendaftaran&#10;- Cara mendaftar"
                                        rows={4}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#003f87]/30 focus:border-[#003f87] transition-all resize-none"
                                    />
                                </div>

                                {/* Tone & Locale */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-sm font-semibold text-neutral-700">Nada Tulisan</label>
                                        <div className="relative">
                                            <select
                                                value={tone}
                                                onChange={(e) => setTone(e.target.value as GenerateDraftParams['tone'])}
                                                className="w-full appearance-none px-3.5 py-2.5 pr-9 rounded-xl border border-neutral-200 text-sm text-neutral-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#003f87]/30 focus:border-[#003f87] transition-all cursor-pointer"
                                            >
                                                <option value="formal">Formal</option>
                                                <option value="semi_formal">Semi-formal</option>
                                                <option value="informatif">Informatif</option>
                                            </select>
                                            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" strokeWidth={1.5} />
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-sm font-semibold text-neutral-700">Bahasa</label>
                                        <div className="relative">
                                            <select
                                                value={targetLocale}
                                                onChange={(e) => setTargetLocale(e.target.value as 'id' | 'en')}
                                                className="w-full appearance-none px-3.5 py-2.5 pr-9 rounded-xl border border-neutral-200 text-sm text-neutral-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#003f87]/30 focus:border-[#003f87] transition-all cursor-pointer"
                                            >
                                                <option value="id">Indonesia</option>
                                                <option value="en">English</option>
                                            </select>
                                            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" strokeWidth={1.5} />
                                        </div>
                                    </div>
                                </div>

                                {/* Info note */}
                                <p className="text-xs text-neutral-500 bg-neutral-50 rounded-xl px-4 py-3 border border-neutral-100">
                                    ✦ AI akan menghasilkan draft artikel lengkap. Anda dapat mengedit hasilnya sebelum digunakan.
                                </p>

                                {/* Actions */}
                                <div className="flex justify-end gap-3 pt-1">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="px-5 py-2.5 rounded-xl border border-neutral-200 text-sm font-semibold text-neutral-600 hover:bg-neutral-50 hover:border-neutral-300 transition-all"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={!topic.trim()}
                                        className={cn(
                                            'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all',
                                            'bg-gradient-to-r from-[#001f4d] to-[#003f87] hover:from-[#002a6b] hover:to-[#0050b0]',
                                            'shadow-md shadow-[#003f87]/20 hover:shadow-lg hover:shadow-[#003f87]/30',
                                            'disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none',
                                        )}
                                    >
                                        <Sparkles className="w-3.5 h-3.5" strokeWidth={1.5} />
                                        Generate
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

/* ─────────────────────────────────────────────
   Inline Confirm
   ───────────────────────────────────────────── */
interface InlineConfirmProps {
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

function InlineConfirm({ message, onConfirm, onCancel }: InlineConfirmProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="flex items-center gap-3 bg-[#001f4d]/95 backdrop-blur rounded-xl px-4 py-2.5 shadow-lg border border-white/10"
        >
            <span className="text-sm text-white/90">{message}</span>
            <button
                type="button"
                onClick={onConfirm}
                className="px-3 py-1 rounded-lg bg-[#c9a84c] text-[#001f4d] text-xs font-bold hover:bg-[#d4b55f] transition-colors"
            >
                Ya, Lanjutkan
            </button>
            <button
                type="button"
                onClick={onCancel}
                className="px-3 py-1 rounded-lg bg-white/10 text-white/80 text-xs font-semibold hover:bg-white/20 transition-colors"
            >
                Batal
            </button>
        </motion.div>
    );
}

/* ─────────────────────────────────────────────
   AiToolbar
   ───────────────────────────────────────────── */
export function AiToolbar({
    onGenerate,
    onCorrect,
    onOpenSeo,
    isLoading,
    editorEmpty,
    locale = 'id',
}: AiToolbarProps) {
    const [showGenerateModal, setShowGenerateModal] = useState(false);
    const [showCorrectConfirm, setShowCorrectConfirm] = useState(false);

    const handleCorrectConfirm = () => {
        setShowCorrectConfirm(false);
        onCorrect();
    };

    return (
        <>
            {/* Toolbar Strip */}
            <div className="relative flex items-center gap-1.5 bg-gradient-to-r from-[#001f4d] to-[#003f87] px-4 py-2.5 border-b border-white/10 overflow-x-auto custom-scrollbar flex-nowrap shrink-0">
                <span className="text-white/40 text-xs font-medium mr-1.5 tracking-widest uppercase shrink-0">AI</span>

                {/* ── Generate Draft ── visible only when editor empty */}
                {editorEmpty && (
                    <AiButton
                        icon={<Sparkles className="w-3.5 h-3.5" strokeWidth={1.5} />}
                        label="Generate Draft"
                        onClick={() => setShowGenerateModal(true)}
                        disabled={isLoading}
                        isLoading={isLoading}
                        title="Buat draft artikel otomatis dengan AI"
                    />
                )}

                {/* ── Koreksi Grammar ── */}
                <div className="relative">
                    <AnimatePresence>
                        {showCorrectConfirm && (
                            <div className="absolute bottom-full left-0 mb-2 z-30 min-w-max">
                                <InlineConfirm
                                    message="Koreksi seluruh artikel?"
                                    onConfirm={handleCorrectConfirm}
                                    onCancel={() => setShowCorrectConfirm(false)}
                                />
                            </div>
                        )}
                    </AnimatePresence>
                    <AiButton
                        icon={<Wand2 className="w-3.5 h-3.5" strokeWidth={1.5} />}
                        label="Koreksi Grammar"
                        onClick={() => setShowCorrectConfirm(true)}
                        disabled={isLoading || editorEmpty}
                        isLoading={isLoading}
                        title="Koreksi grammar dan gaya seluruh artikel"
                    />
                </div>

                {/* ── Analisis SEO ── */}
                <AiButton
                    icon={<Search className="w-3.5 h-3.5" strokeWidth={1.5} />}
                    label="Analisis SEO"
                    onClick={onOpenSeo}
                    disabled={isLoading}
                    isLoading={false}
                    title="Buka panel analisis SEO"
                />

                {/* Loading indicator */}
                {isLoading && (
                    <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="ml-auto flex items-center gap-2 text-white/60 text-xs"
                    >
                        <Loader2 className="w-3.5 h-3.5 animate-spin" strokeWidth={1.5} />
                        <span>AI sedang memproses...</span>
                    </motion.div>
                )}
            </div>

            {/* Generate Draft Modal */}
            <GenerateModal
                open={showGenerateModal}
                onClose={() => setShowGenerateModal(false)}
                onSubmit={onGenerate}
                locale={locale}
            />
        </>
    );
}

/* ─────────────────────────────────────────────
   Reusable AI Button
   ───────────────────────────────────────────── */
interface AiButtonProps {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    disabled?: boolean;
    isLoading?: boolean;
    title?: string;
}

function AiButton({ icon, label, onClick, disabled, isLoading, title }: AiButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            title={title || label}
            className={cn(
                'flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 select-none whitespace-nowrap min-h-[44px] sm:min-h-0',
                'text-white/80 hover:text-white hover:bg-white/12 active:scale-95',
                disabled && 'opacity-40 cursor-not-allowed pointer-events-none',
            )}
        >
            {isLoading ? (
                <Loader2 className="w-4 h-4 sm:w-3.5 sm:h-3.5 animate-spin shrink-0" strokeWidth={1.5} />
            ) : (
                <span className="shrink-0 scale-125 sm:scale-100">{icon}</span>
            )}
            <span className="hidden sm:inline">✦ {label}</span>
        </button>
    );
}

export default AiToolbar;
