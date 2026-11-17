import { useState, useCallback } from 'react';
import { router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { cn } from '@/lib/utils';
import { CheckCircle2, AlertCircle, Loader2, Save, PencilLine } from 'lucide-react';
import toast from 'react-hot-toast';
import { SharedProps } from '@/types';
import {
    SectionAccordion,
    type KontenGrouped,
    type LocaleValues,
} from '@/Components/Admin/KontenHalaman/SectionAccordion';
import KontenHeader from '@/Components/Admin/KontenHalaman/KontenHeader';
import { useTranslateJob } from '@/Components/Admin/KontenHalaman/useTranslateJob';

interface PageProps {
    halaman: string;
    halamanValid: string[];
    kontenGrouped: KontenGrouped;
    [key: string]: unknown;
}

const PAGE_LABELS: Record<string, string> = {
    beranda: 'Beranda',
    tentang: 'Tentang',
    kontak: 'Kontak',
};

const PAGE_ICONS: Record<string, string> = {
    beranda: '🏠',
    tentang: 'ℹ️',
    kontak: '📞',
};

function initValues(kontenGrouped: KontenGrouped): LocaleValues {
    const vals: LocaleValues = {};
    for (const [section, items] of Object.entries(kontenGrouped)) {
        vals[section] = {};
        for (const item of items) {
            vals[section][item.key] = {
                id: item.translations.id?.value ?? '',
                en: item.translations.en?.value ?? '',
            };
        }
    }
    return vals;
}

export default function KontenHalamanEdit() {
    const { halaman, halamanValid, kontenGrouped, pengaturan } = usePage<PageProps & SharedProps>().props;
    const aiEnabled = pengaturan?.artikel_ai_enabled ?? true;

    const [values, setValues] = useState<LocaleValues>(() => initValues(kontenGrouped));
    const [isSaving, setIsSaving] = useState(false);
    const { status: aiStatus, errorMsg: aiError, startPolling, reset: resetAi } = useTranslateJob();
    const [localKonten, setLocalKonten] = useState<KontenGrouped>(kontenGrouped);

    const handleFieldChange = useCallback(
        (section: string, key: string, locale: string, value: string) => {
            setValues((prev) => ({
                ...prev,
                [section]: {
                    ...prev[section],
                    [key]: {
                        ...prev[section]?.[key],
                        [locale]: value,
                    },
                },
            }));
        },
        [],
    );

    const handleSave = async () => {
        setIsSaving(true);
        const csrfMeta = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]');
        const csrfToken = csrfMeta?.content ?? '';

        try {
            const res = await fetch(`/admin/konten/${halaman}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: JSON.stringify(values),
            });

            const data = await res.json() as { success: boolean; message: string };
            if (data.success) {
                toast.success(data.message ?? 'Konten berhasil disimpan!');
            } else {
                toast.error('Gagal menyimpan konten.');
            }
        } catch {
            toast.error('Terjadi kesalahan. Silakan coba lagi.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleTranslateAll = async () => {
        if (aiStatus === 'pending' || aiStatus === 'processing') return;
        resetAi();

        const csrfMeta = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]');
        const csrfToken = csrfMeta?.content ?? '';

        try {
            const res = await fetch(`/admin/konten/${halaman}/translate`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
            });

            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json() as { jobId: number; message: string };
            toast.success('Terjemahan dimulai...');

            startPolling(data.jobId, async () => {
                try {
                    const refreshRes = await fetch(`/admin/konten/${halaman}/data`, {
                        headers: { Accept: 'application/json' },
                    });
                    if (refreshRes.ok) {
                        const refreshData = await refreshRes.json() as { kontenGrouped: KontenGrouped };
                        setLocalKonten(refreshData.kontenGrouped);
                        setValues(initValues(refreshData.kontenGrouped));
                        toast.success('Semua konten berhasil diterjemahkan ke Bahasa Inggris!');
                    }
                } catch {
                    toast.success('Terjemahan selesai! Refresh halaman untuk melihat hasilnya.');
                }
            });
        } catch {
            toast.error('Gagal memulai terjemahan. Silakan coba lagi.');
        }
    };

    const isAiRunning = aiStatus === 'pending' || aiStatus === 'processing';
    const displayHalaman = PAGE_LABELS[halaman] ?? halaman;

    return (
        <AdminLayout title={`Konten: ${displayHalaman}`}>
            <div className="space-y-6">
                <KontenHeader
                    displayHalaman={displayHalaman}
                    aiStatus={aiStatus}
                    isAiRunning={isAiRunning}
                    isSaving={isSaving}
                    onTranslateAll={() => void handleTranslateAll()}
                    onSaveAll={() => void handleSave()}
                />

                {/* AI Status Banner */}
                {(isAiRunning || aiStatus === 'done' || aiStatus === 'failed') && (
                    <div
                        className={cn(
                            'flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium',
                            isAiRunning && 'bg-amber-50 border-amber-200 text-amber-800',
                            aiStatus === 'done' && 'bg-emerald-50 border-emerald-200 text-emerald-800',
                            aiStatus === 'failed' && 'bg-red-50 border-red-200 text-red-800',
                        )}
                    >
                        {isAiRunning && <Loader2 className="w-4 h-4 animate-spin shrink-0" strokeWidth={1.5} />}
                        {aiStatus === 'done' && <CheckCircle2 className="w-4 h-4 shrink-0" strokeWidth={1.5} />}
                        {aiStatus === 'failed' && <AlertCircle className="w-4 h-4 shrink-0" strokeWidth={1.5} />}
                        <span>
                            {isAiRunning && aiStatus === 'pending' && 'AI sedang dalam antrian untuk menerjemahkan...'}
                            {isAiRunning && aiStatus === 'processing' && 'AI sedang menerjemahkan semua konten ke Bahasa Inggris...'}
                            {aiStatus === 'done' && 'Semua konten berhasil diterjemahkan!'}
                            {aiStatus === 'failed' && (aiError ?? 'Terjemahan gagal. Silakan coba lagi.')}
                        </span>
                    </div>
                )}

                {/* Page Tabs */}
                <div className="flex items-start gap-5">
                    <aside className="hidden lg:flex flex-col gap-1 w-48 shrink-0 sticky top-6">
                        <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2 px-3">
                            Pilih Halaman
                        </p>
                        {halamanValid.map((page) => (
                            <a
                                key={page}
                                href={`/admin/konten/${page}`}
                                id={`tab-${page}`}
                                className={cn(
                                    'flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                                    page === halaman
                                        ? 'bg-primary-600 text-white shadow-sm'
                                        : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900',
                                )}
                            >
                                <span>{PAGE_ICONS[page] ?? '📄'}</span>
                                {PAGE_LABELS[page] ?? page}
                            </a>
                        ))}
                    </aside>

                    <div className="flex-1 min-w-0 space-y-4">
                        <div className="lg:hidden">
                            <label htmlFor="mobile-page-select" className="block text-xs font-semibold text-neutral-500 mb-1.5 uppercase tracking-wider">
                                Pilih Halaman
                            </label>
                            <select
                                id="mobile-page-select"
                                value={halaman}
                                onChange={(e) => {
                                    router.visit(`/admin/konten/${e.target.value}`);
                                }}
                                className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-600/30 focus:border-primary-600"
                            >
                                {halamanValid.map((page) => (
                                    <option key={page} value={page}>
                                        {PAGE_ICONS[page]} {PAGE_LABELS[page] ?? page}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {Object.keys(localKonten).length === 0 && (
                            <div className="text-center py-16 text-neutral-400">
                                <PencilLine className="w-10 h-10 mx-auto mb-3 opacity-30" strokeWidth={1.5} />
                                <p className="text-sm">Belum ada konten untuk halaman ini.</p>
                                <p className="text-xs mt-1">Jalankan HalamanKontenSeeder terlebih dahulu.</p>
                            </div>
                        )}

                        {Object.entries(localKonten).map(([sectionName, items]) => (
                            <SectionAccordion
                                key={sectionName}
                                sectionName={sectionName}
                                items={items}
                                values={values}
                                onFieldChange={handleFieldChange}
                                aiEnabled={aiEnabled}
                            />
                        ))}

                        {Object.keys(localKonten).length > 0 && (
                            <div className="pt-2 pb-4 flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => void handleSave()}
                                    disabled={isSaving}
                                    className={cn(
                                        'flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200',
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
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
