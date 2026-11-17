import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { History, Eye, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/Components/UI/Button';
import { Modal } from '@/Components/UI/Modal';
import { ConfirmDialog } from '@/Components/UI/ConfirmDialog';
import { computeLineDiff, stripHtml, type DiffLine } from '@/lib/diff';
import type { ArticleRevisionItem } from '@/types';
import { cn } from '@/lib/utils';

interface RevisionPanelProps {
    articleId: number;
    revisions: ArticleRevisionItem[];
    currentTitle: string;
    currentContent: string;
}

export function RevisionPanel({
    articleId,
    revisions = [],
    currentTitle,
    currentContent,
}: RevisionPanelProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedRevision, setSelectedRevision] = useState<ArticleRevisionItem | null>(null);
    const [diffModalOpen, setDiffModalOpen] = useState(false);
    const [confirmRestoreOpen, setConfirmRestoreOpen] = useState(false);
    const [diffLines, setDiffLines] = useState<DiffLine[]>([]);
    const [isRestoring, setIsRestoring] = useState(false);

    if (revisions.length === 0) {
        return null;
    }

    const handleOpenDiff = (rev: ArticleRevisionItem) => {
        setSelectedRevision(rev);
        const revContent = rev.snapshot.translations?.id?.content ?? '';
        const oldClean = stripHtml(revContent);
        const curClean = stripHtml(currentContent);
        const lines = computeLineDiff(curClean, oldClean); // membandingkan versi saat ini terhadap revisi
        setDiffLines(lines);
        setDiffModalOpen(true);
    };

    const handleTriggerRestore = (rev: ArticleRevisionItem) => {
        setSelectedRevision(rev);
        setConfirmRestoreOpen(true);
    };

    const handleConfirmRestore = () => {
        if (!selectedRevision) return;
        setIsRestoring(true);
        router.post(
            `/admin/artikel/${articleId}/revisi/${selectedRevision.id}/restore`,
            {},
            {
                preserveScroll: true,
                onFinish: () => {
                    setIsRestoring(false);
                    setConfirmRestoreOpen(false);
                    setDiffModalOpen(false);
                },
            }
        );
    };

    return (
        <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between text-left font-medium text-neutral-900 group"
            >
                <div className="flex items-center gap-2">
                    <History className="w-5 h-5 text-primary-600" />
                    <span>Riwayat Revisi ({revisions.length})</span>
                </div>
                {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-neutral-500" />
                ) : (
                    <ChevronDown className="w-4 h-4 text-neutral-500" />
                )}
            </button>

            {isOpen && (
                <div className="mt-4 divide-y divide-neutral-100 max-h-72 overflow-y-auto pr-1">
                    {revisions.map((rev) => (
                        <div
                            key={rev.id}
                            className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3"
                        >
                            <div className="min-w-0">
                                <p className="text-sm font-medium text-neutral-800 truncate">
                                    {rev.user ? rev.user.name : 'Sistem'}
                                </p>
                                <p className="text-xs text-neutral-500">{rev.human_time}</p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleOpenDiff(rev)}
                                    title="Lihat Perbedaan"
                                >
                                    <Eye className="w-3.5 h-3.5" />
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleTriggerRestore(rev)}
                                    title="Pulihkan Revisi Ini"
                                >
                                    <RotateCcw className="w-3.5 h-3.5" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal Diff */}
            <Modal
                isOpen={diffModalOpen}
                onClose={() => setDiffModalOpen(false)}
                title={`Perbandingan Revisi (${selectedRevision?.human_time ?? ''})`}
                size="2xl"
            >
                <div className="space-y-4">
                    <div className="text-xs text-neutral-500 pb-2 border-b border-neutral-100 flex items-center justify-between">
                        <span>
                            Dibuat oleh: <strong>{selectedRevision?.user?.name ?? 'Sistem'}</strong> ({selectedRevision?.created_at})
                        </span>
                        <div className="flex items-center gap-3">
                            <span className="inline-flex items-center gap-1 text-emerald-700">
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Ditambahkan
                            </span>
                            <span className="inline-flex items-center gap-1 text-rose-700">
                                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Dihapus
                            </span>
                        </div>
                    </div>

                    <div className="font-mono text-xs bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-x-auto max-h-96 space-y-1">
                        {diffLines.length === 0 ? (
                            <p className="text-neutral-400 italic">Tidak ada perubahan teks konten yang terdeteksi.</p>
                        ) : (
                            diffLines.map((line, idx) => (
                                <div
                                    key={idx}
                                    className={cn(
                                        'px-2 py-0.5 rounded flex gap-2',
                                        line.type === 'add' && 'bg-emerald-950 text-emerald-300',
                                        line.type === 'del' && 'bg-rose-950 text-rose-300 line-through',
                                        line.type === 'same' && 'text-neutral-400'
                                    )}
                                >
                                    <span className="select-none w-4 text-neutral-500">
                                        {line.type === 'add' ? '+' : line.type === 'del' ? '-' : ' '}
                                    </span>
                                    <span className="whitespace-pre-wrap break-words flex-1">
                                        {line.text || ' '}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setDiffModalOpen(false)}
                        >
                            Tutup
                        </Button>
                        <Button
                            type="button"
                            variant="primary"
                            onClick={() => {
                                setDiffModalOpen(false);
                                setConfirmRestoreOpen(true);
                            }}
                        >
                            <RotateCcw className="w-4 h-4 mr-1.5" />
                            Pulihkan Versi Ini
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Confirm Dialog Restore */}
            <ConfirmDialog
                isOpen={confirmRestoreOpen}
                onClose={() => setConfirmRestoreOpen(false)}
                onConfirm={handleConfirmRestore}
                title="Pulihkan Revisi Artikel"
                message={`Apakah Anda yakin ingin memulihkan revisi dari "${selectedRevision?.user?.name ?? 'Sistem'}" (${selectedRevision?.human_time ?? ''})? Kondisi artikel saat ini akan disimpan sebagai riwayat revisi baru.`}
                confirmLabel="Ya, Pulihkan"
                cancelLabel="Batal"
                variant="primary"
                isLoading={isRestoring}
            />
        </div>
    );
}
