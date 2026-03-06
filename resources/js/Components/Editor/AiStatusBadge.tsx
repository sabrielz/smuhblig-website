import React from 'react';
import { motion } from 'framer-motion';
import { Bot, CheckCircle2, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

/* ─────────────────────────────────────────────
   Types
   ───────────────────────────────────────────── */
export type TranslationStatus = 'ai_translated' | 'reviewed' | null;

export interface AiStatusBadgeProps {
    status: TranslationStatus;
    onMarkReviewed?: () => void;
    isMarkingReviewed?: boolean;
    className?: string;
}

/* ─────────────────────────────────────────────
   AiStatusBadge
   ───────────────────────────────────────────── */
export function AiStatusBadge({
    status,
    onMarkReviewed,
    isMarkingReviewed,
    className,
}: AiStatusBadgeProps) {
    if (!status) return null;

    if (status === 'reviewed') {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={cn('flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-100', className)}
            >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" strokeWidth={1.5} />
                <span className="text-xs font-semibold text-emerald-700">Sudah Direview</span>
            </motion.div>
        );
    }

    // ai_translated — Belum Direview
    return (
        <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn('flex flex-wrap items-center gap-2', className)}
        >
            {/* Badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200">
                <Bot className="w-3.5 h-3.5 text-amber-600 shrink-0" strokeWidth={1.5} />
                <span className="text-xs font-semibold text-amber-700">AI Translated</span>
                <span className="text-neutral-300 text-xs">·</span>
                <Clock className="w-3 h-3 text-amber-400 shrink-0" strokeWidth={1.5} />
                <span className="text-xs text-amber-600 font-medium">Belum Direview</span>
            </div>

            {/* Mark reviewed button */}
            {onMarkReviewed && (
                <button
                    type="button"
                    onClick={onMarkReviewed}
                    disabled={isMarkingReviewed}
                    className={cn(
                        'flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all',
                        'bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95',
                        'disabled:opacity-50 disabled:cursor-not-allowed',
                    )}
                >
                    {isMarkingReviewed ? (
                        <span className="inline-block w-3 h-3 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                    ) : (
                        <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                    )}
                    Tandai Sudah Direview
                </button>
            )}
        </motion.div>
    );
}

export default AiStatusBadge;
