import React, { useState, useCallback, useRef } from 'react';
import { router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { cn } from '@/lib/utils';
import {
    ChevronDown,
    ChevronUp,
    Save,
    Sparkles,
    Globe,
    CheckCircle2,
    Clock,
    AlertCircle,
    Loader2,
    ExternalLink,
    ToggleLeft,
    ToggleRight,
    PencilLine,
} from 'lucide-react';
import { TipTapEditor } from '@/Components/Editor/TipTapEditor';
import toast from 'react-hot-toast';

/* ─────────────────────────────────────────────
   Types
   ───────────────────────────────────────────── */

interface TranslationData {
    id: number;
    value: string;
    ai_translated: boolean;
    reviewed: boolean;
}

interface KontenItem {
    id: number;
    key: string;
    label: string;
    type: 'text' | 'textarea' | 'richtext' | 'number' | 'url' | 'boolean' | 'image';
    sort_order: number;
    translations: {
        id?: TranslationData;
        en?: TranslationData;
    };
}

type KontenGrouped = Record<string, KontenItem[]>;

interface PageProps {
    halaman: string;
    halamanValid: string[];
    kontenGrouped: KontenGrouped;
}

type LocaleValues = Record<string, Record<string, Record<string, string>>>;

/* ─────────────────────────────────────────────
   AI Job Polling (custom untuk konteks ini)
   ───────────────────────────────────────────── */

type AiPollStatus = 'idle' | 'pending' | 'processing' | 'done' | 'failed';

function useTranslateJob() {
    const [status, setStatus] = useState<AiPollStatus>('idle');
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const stopPolling = useCallback(() => {
        if (intervalRef.current !== null) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);

    const startPolling = useCallback((jobId: number, onDone: () => void) => {
        setStatus('pending');
        setErrorMsg(null);
        stopPolling();

        const poll = async () => {
            try {
                const res = await fetch(`/admin/ai/jobs/${jobId}/status`, {
                    headers: { Accept: 'application/json' },
                });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);

                const data = await res.json() as {
                    status: string;
                    output?: string;
                    error_message?: string;
                };

                if (data.status === 'processing') {
                    setStatus('processing');
                } else if (data.status === 'done') {
                    stopPolling();
                    setStatus('done');
                    onDone();
                } else if (data.status === 'failed') {
                    stopPolling();
                    setStatus('failed');
                    setErrorMsg(data.error_message ?? 'Terjemahan gagal.');
                }
            } catch {
                // keep polling
            }
        };

        void poll();
        intervalRef.current = setInterval(() => void poll(), 2000);
    }, [stopPolling]);

    const reset = useCallback(() => {
        stopPolling();
        setStatus('idle');
        setErrorMsg(null);
    }, [stopPolling]);

    return { status, errorMsg, startPolling, reset };
}

/* ─────────────────────────────────────────────
   Translation Badge
   ───────────────────────────────────────────── */

function TranslationBadge({ translation }: { translation?: TranslationData }) {
    if (!translation) {
        return (
            <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-500 font-medium">
                <Clock className="w-3 h-3" />
                Belum diterjemahkan
            </span>
        );
    }
    if (translation.reviewed) {
        return (
            <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                <CheckCircle2 className="w-3 h-3" />
                Direview
            </span>
        );
    }
    if (translation.ai_translated) {
        return (
            <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-medium">
                <Sparkles className="w-3 h-3" />
                AI Translated
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-medium">
            <Globe className="w-3 h-3" />
            Manual
        </span>
    );
}

/* ─────────────────────────────────────────────
   Field Editor (per locale)
   ───────────────────────────────────────────── */

interface FieldEditorProps {
    item: KontenItem;
    locale: 'id' | 'en';
    value: string;
    onChange: (section: string, key: string, locale: string, value: string) => void;
    section: string;
}

function FieldEditor({ item, locale, value, onChange, section }: FieldEditorProps) {
    const baseInputClass = cn(
        'w-full rounded-lg border border-neutral-200 bg-white px-3 py-2',
        'text-sm text-neutral-800 placeholder:text-neutral-400',
        'focus:outline-none focus:ring-2 focus:ring-[#003f87]/30 focus:border-[#003f87]',
        'transition-colors duration-150',
    );

    const handleChange = (val: string) => onChange(section, item.key, locale, val);

    switch (item.type) {
        case 'textarea':
            return (
                <textarea
                    id={`field-${section}-${item.key}-${locale}`}
                    rows={4}
                    value={value}
                    onChange={(e) => handleChange(e.target.value)}
                    className={cn(baseInputClass, 'resize-y min-h-[100px]')}
                    placeholder={`${item.label} (${locale.toUpperCase()})`}
                />
            );

        case 'richtext':
            return (
                <div className="border border-neutral-200 rounded-lg overflow-hidden">
                    <TipTapEditor
                        key={`${section}-${item.key}-${locale}`}
                        value={value}
                        onChange={handleChange}
                        placeholder={`${item.label} (${locale.toUpperCase()})...`}
                    />
                </div>
            );

        case 'number':
            return (
                <input
                    type="number"
                    id={`field-${section}-${item.key}-${locale}`}
                    value={value}
                    onChange={(e) => handleChange(e.target.value)}
                    className={baseInputClass}
                />
            );

        case 'url':
            return (
                <div className="flex gap-2">
                    <input
                        type="url"
                        id={`field-${section}-${item.key}-${locale}`}
                        value={value}
                        onChange={(e) => handleChange(e.target.value)}
                        className={cn(baseInputClass, 'flex-1')}
                        placeholder="https://..."
                    />
                    {value && (
                        <a
                            href={value}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 px-3 py-2 rounded-lg border border-neutral-200 text-sm text-neutral-600 hover:text-[#003f87] hover:border-[#003f87] transition-colors"
                            title="Buka link"
                        >
                            <ExternalLink className="w-4 h-4" strokeWidth={1.5} />
                        </a>
                    )}
                </div>
            );

        case 'boolean':
            return (
                <button
                    type="button"
                    id={`field-${section}-${item.key}-${locale}`}
                    onClick={() => handleChange(value === 'true' ? 'false' : 'true')}
                    className="flex items-center gap-2 text-sm text-neutral-700 hover:text-neutral-900 transition-colors"
                >
                    {value === 'true' ? (
                        <ToggleRight className="w-8 h-8 text-[#003f87]" strokeWidth={1.5} />
                    ) : (
                        <ToggleLeft className="w-8 h-8 text-neutral-400" strokeWidth={1.5} />
                    )}
                    {value === 'true' ? 'Aktif' : 'Tidak Aktif'}
                </button>
            );

        default:
            return (
                <input
                    type="text"
                    id={`field-${section}-${item.key}-${locale}`}
                    value={value}
                    onChange={(e) => handleChange(e.target.value)}
                    className={baseInputClass}
                    placeholder={`${item.label} (${locale.toUpperCase()})`}
                />
            );
    }
}

/* ─────────────────────────────────────────────
   Section Accordion
   ───────────────────────────────────────────── */

interface SectionAccordionProps {
    sectionName: string;
    items: KontenItem[];
    values: LocaleValues;
    onFieldChange: (section: string, key: string, locale: string, value: string) => void;
}

function SectionAccordion({ sectionName, items, values, onFieldChange }: SectionAccordionProps) {
    const [isOpen, setIsOpen] = useState(true);

    const displayName = sectionName
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());

    return (
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm">
            {/* Header */}
            <button
                type="button"
                onClick={() => setIsOpen((v) => !v)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-neutral-50 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-5 rounded-full bg-[#003f87]" />
                    <span className="font-semibold text-neutral-800 text-sm">{displayName}</span>
                    <span className="text-xs text-neutral-400 font-normal">{items.length} field</span>
                </div>
                {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-neutral-400" strokeWidth={1.5} />
                ) : (
                    <ChevronDown className="w-4 h-4 text-neutral-400" strokeWidth={1.5} />
                )}
            </button>

            {/* Fields */}
            {isOpen && (
                <div className="divide-y divide-neutral-100 border-t border-neutral-100">
                    {items.map((item) => {
                        const currentIdValue = values[sectionName]?.[item.key]?.['id'] ?? item.translations.id?.value ?? '';
                        const currentEnValue = values[sectionName]?.[item.key]?.['en'] ?? item.translations.en?.value ?? '';

                        return (
                            <div key={item.key} className="px-5 py-5">
                                <label className="block text-sm font-semibold text-neutral-700 mb-1">
                                    {item.label}
                                </label>
                                <p className="text-xs text-neutral-400 font-mono mb-4">
                                    {sectionName}.{item.key} — <span className="text-neutral-500">{item.type}</span>
                                </p>

                                {/* Dual locale tabs */}
                                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                                    {/* ID */}
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#003f87] text-white">ID</span>
                                            <span className="text-xs text-neutral-500">Bahasa Indonesia</span>
                                        </div>
                                        <FieldEditor
                                            item={item}
                                            locale="id"
                                            value={currentIdValue}
                                            onChange={onFieldChange}
                                            section={sectionName}
                                        />
                                    </div>

                                    {/* EN */}
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold px-2 py-0.5 rounded bg-neutral-700 text-white">EN</span>
                                            <span className="text-xs text-neutral-500">English</span>
                                            <TranslationBadge translation={item.translations.en} />
                                        </div>
                                        {item.type !== 'boolean' && item.type !== 'image' ? (
                                            <FieldEditor
                                                item={item}
                                                locale="en"
                                                value={currentEnValue}
                                                onChange={onFieldChange}
                                                section={sectionName}
                                            />
                                        ) : (
                                            <p className="text-xs text-neutral-400 italic py-2">
                                                Field ini tidak perlu terjemahan.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

/* ─────────────────────────────────────────────
   Page Tabs
   ───────────────────────────────────────────── */

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

/* ─────────────────────────────────────────────
   Initialize values from server data
   ───────────────────────────────────────────── */

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

/* ─────────────────────────────────────────────
   Main Page Component
   ───────────────────────────────────────────── */

export default function KontenHalamanEdit() {
    const { halaman, halamanValid, kontenGrouped } = usePage<PageProps>().props;

    const [values, setValues] = useState<LocaleValues>(() => initValues(kontenGrouped));
    const [isSaving, setIsSaving] = useState(false);
    const { status: aiStatus, errorMsg: aiError, startPolling, reset: resetAi } = useTranslateJob();

    // Track current page data reference for refreshing after AI done
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
                // Refresh data dari server setelah AI selesai
                try {
                    const refreshRes = await fetch(`/admin/konten/${halaman}/data`, {
                        headers: { Accept: 'application/json' },
                    });
                    if (refreshRes.ok) {
                        const refreshData = await refreshRes.json() as {
                            kontenGrouped: KontenGrouped;
                        };
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

                {/* ── Page Header ── */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#003f87]/10 flex items-center justify-center shrink-0">
                            <PencilLine className="w-5 h-5 text-[#003f87]" strokeWidth={1.5} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-neutral-900">
                                Kelola Konten:{' '}
                                <span className="text-[#003f87]">{displayHalaman}</span>
                            </h1>
                            <p className="text-sm text-neutral-500 mt-0.5">
                                Semua teks statis halaman {displayHalaman.toLowerCase()} bisa diubah di sini
                            </p>
                        </div>
                    </div>

                    {/* Toolbar Actions */}
                    <div className="flex items-center gap-2 flex-wrap">
                        {/* AI Translate Button */}
                        <button
                            type="button"
                            id="btn-translate-all"
                            onClick={() => void handleTranslateAll()}
                            disabled={isAiRunning}
                            className={cn(
                                'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200',
                                'border border-[#c9a84c] text-[#8a6a1c] hover:bg-[#c9a84c] hover:text-white',
                                'disabled:opacity-60 disabled:cursor-not-allowed',
                                isAiRunning && 'bg-[#fdf7e8]',
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

                        {/* Save Button */}
                        <button
                            type="button"
                            id="btn-save-all"
                            onClick={() => void handleSave()}
                            disabled={isSaving}
                            className={cn(
                                'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200',
                                'bg-[#003f87] text-white hover:bg-[#002d6b] shadow-sm hover:shadow-md',
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

                {/* ── Page Tabs (Halaman Selector) ── */}
                <div className="flex items-start gap-5">

                    {/* Desktop: Vertical Tabs */}
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
                                        ? 'bg-[#003f87] text-white shadow-sm'
                                        : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900',
                                )}
                            >
                                <span>{PAGE_ICONS[page] ?? '📄'}</span>
                                {PAGE_LABELS[page] ?? page}
                            </a>
                        ))}
                    </aside>

                    {/* Content Area */}
                    <div className="flex-1 min-w-0 space-y-4">

                        {/* Mobile: Dropdown */}
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
                                className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#003f87]/30 focus:border-[#003f87]"
                            >
                                {halamanValid.map((page) => (
                                    <option key={page} value={page}>
                                        {PAGE_ICONS[page]} {PAGE_LABELS[page] ?? page}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Empty state */}
                        {Object.keys(localKonten).length === 0 && (
                            <div className="text-center py-16 text-neutral-400">
                                <PencilLine className="w-10 h-10 mx-auto mb-3 opacity-30" strokeWidth={1.5} />
                                <p className="text-sm">Belum ada konten untuk halaman ini.</p>
                                <p className="text-xs mt-1">Jalankan HalamanKontenSeeder terlebih dahulu.</p>
                            </div>
                        )}

                        {/* Section Accordions */}
                        {Object.entries(localKonten).map(([sectionName, items]) => (
                            <SectionAccordion
                                key={sectionName}
                                sectionName={sectionName}
                                items={items}
                                values={values}
                                onFieldChange={handleFieldChange}
                            />
                        ))}

                        {/* Bottom Save Button (mobile convenience) */}
                        {Object.keys(localKonten).length > 0 && (
                            <div className="pt-2 pb-4 flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => void handleSave()}
                                    disabled={isSaving}
                                    className={cn(
                                        'flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200',
                                        'bg-[#003f87] text-white hover:bg-[#002d6b] shadow-sm hover:shadow-md',
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
