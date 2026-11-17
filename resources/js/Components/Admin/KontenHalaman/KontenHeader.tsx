import { cn } from '@/lib/utils';
import { Save, Sparkles, Loader2, PencilLine } from 'lucide-react';
import type { AiPollStatus } from './useTranslateJob';

interface KontenHeaderProps {
    displayHalaman: string;
    aiStatus: AiPollStatus;
    isAiRunning: boolean;
    isSaving: boolean;
    onTranslateAll: () => void;
    onSaveAll: () => void;
}

export default function KontenHeader({
    displayHalaman,
    aiStatus,
    isAiRunning,
    isSaving,
    onTranslateAll,
    onSaveAll,
}: KontenHeaderProps) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-600/10 flex items-center justify-center shrink-0">
                    <PencilLine className="w-5 h-5 text-primary-600" strokeWidth={1.5} />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-neutral-900">
                        Kelola Konten: <span className="text-primary-600">{displayHalaman}</span>
                    </h1>
                    <p className="text-sm text-neutral-500 mt-0.5">
                        Semua teks statis halaman {displayHalaman.toLowerCase()} bisa diubah di sini
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
                <button
                    type="button"
                    id="btn-translate-all"
                    onClick={onTranslateAll}
                    disabled={isAiRunning}
                    className={cn(
                        'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200',
                        'border border-gold-500 text-gold-700 hover:bg-gold-500 hover:text-white',
                        'disabled:opacity-60 disabled:cursor-not-allowed',
                        isAiRunning && 'bg-gold-100',
                    )}
                >
                    {isAiRunning ? (
                        <Loader2 className="w-4 h-4 animate-spin" strokeWidth={1.5} />
                    ) : (
                        <Sparkles className="w-4 h-4" strokeWidth={1.5} />
                    )}
                    {isAiRunning
                        ? aiStatus === 'pending'
                            ? 'Menunggu...'
                            : 'Menerjemahkan...'
                        : '✦ Terjemahkan Semua ke EN'}
                </button>

                <button
                    type="button"
                    id="btn-save-all"
                    onClick={onSaveAll}
                    disabled={isSaving}
                    className={cn(
                        'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200',
                        'bg-primary-600 text-white hover:bg-primary-800 shadow-sm hover:shadow-md',
                        'disabled:opacity-60 disabled:cursor-not-allowed',
                    )}
                >
                    {isSaving ? (
                        <Loader2 className="w-4 h-4 animate-spin" strokeWidth={1.5} />
                    ) : (
                        <Save className="w-4 h-4" strokeWidth={1.5} />
                    )}
                    {isSaving ? 'Menyimpan...' : 'Simpan Semua'}
                </button>
            </div>
        </div>
    );
}
