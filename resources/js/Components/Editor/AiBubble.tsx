import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Loader2, CornerDownLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Editor } from '@tiptap/react';

/* ─────────────────────────────────────────────
   Types
   ───────────────────────────────────────────── */
export type ReviseInstruction = 'formal' | 'ringkas' | 'alur' | 'custom';

export interface AiBubbleProps {
    /** TipTap editor instance */
    editor: Editor | null;
    /** Called when user triggers a revision. Returns jobId string from server */
    onRevise: (text: string, instruction: string) => Promise<string | null>;
    /** Current AI result for this selection */
    revisionResult: string | null;
    /** Whether revision is in progress */
    isRevising: boolean;
    /** Apply the current revision result to editor */
    onApply: (originalText: string, newText: string) => void;
    /** Discard result */
    onDiscard: () => void;
}

interface BubblePosition {
    top: number;
    left: number;
}

const QUICK_ACTIONS: { id: ReviseInstruction; label: string }[] = [
    { id: 'formal', label: 'Buat Formal' },
    { id: 'ringkas', label: 'Ringkas' },
    { id: 'alur', label: 'Perbaiki Alur' },
];

const INSTRUCTION_MAP: Record<ReviseInstruction, string> = {
    formal: 'Buat lebih formal',
    ringkas: 'Buat lebih ringkas',
    alur: 'Perbaiki alur kalimat',
    custom: '',
};

/* ─────────────────────────────────────────────
   Diff View
   ───────────────────────────────────────────── */
interface DiffViewProps {
    original: string;
    revised: string;
    onApply: () => void;
    onDiscard: () => void;
}

function DiffView({ original, revised, onApply, onDiscard }: DiffViewProps) {
    return (
        <div className="flex flex-col gap-2 w-80">
            <p className="text-[10px] font-semibold text-white/50 uppercase tracking-widest">Hasil Revisi</p>
            <div className="rounded-xl bg-white/5 border border-white/10 overflow-hidden text-xs leading-relaxed">
                {/* Original */}
                <div className="px-3 py-2 border-b border-white/10">
                    <span className="text-red-400 line-through opacity-80">{original}</span>
                </div>
                {/* Revised */}
                <div className="px-3 py-2">
                    <span className="text-emerald-300">{revised}</span>
                </div>
            </div>
            <div className="flex gap-2">
                <button
                    type="button"
                    onClick={onApply}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-semibold rounded-lg transition-colors"
                >
                    <CornerDownLeft className="w-3 h-3" strokeWidth={1.5} />
                    Terapkan
                </button>
                <button
                    type="button"
                    onClick={onDiscard}
                    className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white/80 text-xs font-semibold rounded-lg transition-colors"
                >
                    Batal
                </button>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────
   AiBubble
   ───────────────────────────────────────────── */
export function AiBubble({
    editor,
    onRevise,
    revisionResult,
    isRevising,
    onApply,
    onDiscard,
}: AiBubbleProps) {
    const [visible, setVisible] = useState(false);
    const [position, setPosition] = useState<BubblePosition>({ top: 0, left: 0 });
    const [selectedText, setSelectedText] = useState('');
    const [showCustomInput, setShowCustomInput] = useState(false);
    const [customInstruction, setCustomInstruction] = useState('');
    const bubbleRef = useRef<HTMLDivElement>(null);
    const customInputRef = useRef<HTMLInputElement>(null);

    const updateBubblePosition = useCallback(() => {
        if (!editor) return;

        const { from, to } = editor.state.selection;
        if (from === to) {
            setVisible(false);
            setShowCustomInput(false);
            return;
        }

        const text = editor.state.doc.textBetween(from, to, ' ');
        if (!text.trim() || text.trim().length < 3) {
            setVisible(false);
            return;
        }

        setSelectedText(text.trim());

        // Get DOM selection position
        const domSelection = window.getSelection();
        if (!domSelection || domSelection.rangeCount === 0) return;

        const range = domSelection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        if (rect.width === 0 && rect.height === 0) return;

        const scrollX = window.scrollX || document.documentElement.scrollLeft;
        const scrollY = window.scrollY || document.documentElement.scrollTop;

        // Position bubble above the selection
        setPosition({
            top: rect.top + scrollY - 12, // 12px gap above selection
            left: Math.min(
                rect.left + scrollX + rect.width / 2,
                window.innerWidth + scrollX - 200, // prevent overflow right
            ),
        });
        setVisible(true);
    }, [editor]);

    // Listen to selection changes on the editor
    useEffect(() => {
        if (!editor) return;

        const handleSelectionChange = () => {
            // Small delay to let TipTap update its state
            setTimeout(updateBubblePosition, 50);
        };

        editor.on('selectionUpdate', handleSelectionChange);
        document.addEventListener('mouseup', handleSelectionChange);
        document.addEventListener('touchend', handleSelectionChange);

        return () => {
            editor.off('selectionUpdate', handleSelectionChange);
            document.removeEventListener('mouseup', handleSelectionChange);
            document.removeEventListener('touchend', handleSelectionChange);
        };
    }, [editor, updateBubblePosition]);

    // Focus custom input when it appears
    useEffect(() => {
        if (showCustomInput) {
            setTimeout(() => customInputRef.current?.focus(), 50);
        }
    }, [showCustomInput]);

    const handleQuickAction = async (action: ReviseInstruction) => {
        if (!selectedText || isRevising) return;
        setShowCustomInput(false);
        await onRevise(selectedText, INSTRUCTION_MAP[action]);
    };

    const handleCustomSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!customInstruction.trim() || isRevising) return;
        await onRevise(selectedText, customInstruction.trim());
        setCustomInstruction('');
        setShowCustomInput(false);
    };

    const handleApply = () => {
        if (revisionResult) {
            onApply(selectedText, revisionResult);
            setVisible(false);
        }
    };

    const handleDiscard = () => {
        onDiscard();
        setVisible(false);
    };

    if (!editor) return null;

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    ref={bubbleRef}
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    style={{
                        position: 'fixed',
                        top: position.top,
                        left: position.left,
                        transform: 'translate(-50%, -100%)',
                        zIndex: 9999,
                    }}
                    className="pointer-events-auto"
                    // Don't hide bubble on mousedown inside it
                    onMouseDown={(e) => e.stopPropagation()}
                >
                    <div className="bg-gradient-to-br from-[#001f4d] to-[#003f87] rounded-2xl shadow-2xl shadow-[#001f4d]/40 border border-white/10 p-3 flex flex-col gap-2">

                        {/* ── Loading state ── */}
                        {isRevising && (
                            <div className="flex items-center gap-2 px-1 min-w-[160px]">
                                <Loader2 className="w-3.5 h-3.5 text-[#c9a84c] animate-spin shrink-0" strokeWidth={1.5} />
                                <span className="text-white/70 text-xs">AI sedang merevisi...</span>
                            </div>
                        )}

                        {/* ── Diff result ── */}
                        {!isRevising && revisionResult && (
                            <DiffView
                                original={selectedText}
                                revised={revisionResult}
                                onApply={handleApply}
                                onDiscard={handleDiscard}
                            />
                        )}

                        {/* ── Quick actions ── */}
                        {!isRevising && !revisionResult && (
                            <>
                                <div className="flex items-center gap-1 flex-wrap">
                                    {QUICK_ACTIONS.map((action) => (
                                        <QuickActionBtn
                                            key={action.id}
                                            label={action.label}
                                            onClick={() => void handleQuickAction(action.id)}
                                        />
                                    ))}
                                    <QuickActionBtn
                                        label="Tulis Sendiri..."
                                        onClick={() => setShowCustomInput((v) => !v)}
                                        active={showCustomInput}
                                    />
                                </div>

                                {/* Custom input */}
                                <AnimatePresence>
                                    {showCustomInput && (
                                        <motion.form
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            onSubmit={(e) => void handleCustomSubmit(e)}
                                            className="overflow-hidden"
                                        >
                                            <div className="flex gap-2 pt-1">
                                                <input
                                                    ref={customInputRef}
                                                    type="text"
                                                    value={customInstruction}
                                                    onChange={(e) => setCustomInstruction(e.target.value)}
                                                    placeholder="Instruksi revisi..."
                                                    className="flex-1 bg-white/10 text-white placeholder:text-white/40 text-xs rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-[#c9a84c]/50 border border-white/10 focus:border-[#c9a84c]/40 transition-all"
                                                />
                                                <button
                                                    type="submit"
                                                    disabled={!customInstruction.trim()}
                                                    className="px-3 py-2 bg-[#c9a84c] disabled:bg-[#c9a84c]/40 text-[#001f4d] rounded-lg text-xs font-bold transition-colors"
                                                >
                                                    <Sparkles className="w-3.5 h-3.5" strokeWidth={1.5} />
                                                </button>
                                            </div>
                                        </motion.form>
                                    )}
                                </AnimatePresence>
                            </>
                        )}
                    </div>

                    {/* Caret arrow */}
                    <div
                        className="absolute left-1/2 -translate-x-1/2 -bottom-1.5 w-3 h-3 bg-[#003f87] rotate-45 border-r border-b border-white/10"
                        style={{ zIndex: -1 }}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
}

/* ─────────────────────────────────────────────
   Quick Action Button
   ───────────────────────────────────────────── */
interface QuickActionBtnProps {
    label: string;
    onClick: () => void;
    active?: boolean;
}

function QuickActionBtn({ label, onClick, active }: QuickActionBtnProps) {
    return (
        <button
            type="button"
            onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClick();
            }}
            className={cn(
                'flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all duration-150 whitespace-nowrap select-none',
                active
                    ? 'bg-[#c9a84c] text-[#001f4d]'
                    : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white',
            )}
        >
            <Sparkles className="w-3 h-3 shrink-0" strokeWidth={1.5} />
            {label}
        </button>
    );
}

export default AiBubble;
