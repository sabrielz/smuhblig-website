import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronUp, Clock, CheckCircle2, Sparkles, Globe, ExternalLink, ToggleLeft, ToggleRight } from 'lucide-react';
import { TipTapEditor } from '@/Components/Editor/TipTapEditor';

export interface TranslationData {
    id: number;
    value: string;
    ai_translated: boolean;
    reviewed: boolean;
}

export interface KontenItem {
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

export type KontenGrouped = Record<string, KontenItem[]>;
export type LocaleValues = Record<string, Record<string, Record<string, string>>>;

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

interface FieldEditorProps {
    item: KontenItem;
    locale: 'id' | 'en';
    value: string;
    onChange: (section: string, key: string, locale: string, value: string) => void;
    section: string;
    aiEnabled?: boolean;
}

export function FieldEditor({ item, locale, value, onChange, section, aiEnabled = true }: FieldEditorProps) {
    const baseInputClass = cn(
        'w-full rounded-lg border border-neutral-200 bg-white px-3 py-2',
        'text-sm text-neutral-800 placeholder:text-neutral-400',
        'focus:outline-none focus:ring-2 focus:ring-primary-600/30 focus:border-primary-600',
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
                        aiEnabled={aiEnabled}
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
                            className="flex items-center gap-1 px-3 py-2 rounded-lg border border-neutral-200 text-sm text-neutral-600 hover:text-primary-600 hover:border-primary-600 transition-colors"
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
                        <ToggleRight className="w-8 h-8 text-primary-600" strokeWidth={1.5} />
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

interface SectionAccordionProps {
    sectionName: string;
    items: KontenItem[];
    values: LocaleValues;
    onFieldChange: (section: string, key: string, locale: string, value: string) => void;
    aiEnabled?: boolean;
}

export function SectionAccordion({ sectionName, items, values, onFieldChange, aiEnabled = true }: SectionAccordionProps) {
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
                    <div className="w-1.5 h-5 rounded-full bg-primary-600" />
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
                                            <span className="text-xs font-bold px-2 py-0.5 rounded bg-primary-600 text-white">ID</span>
                                            <span className="text-xs text-neutral-500">Bahasa Indonesia</span>
                                        </div>
                                        <FieldEditor
                                            item={item}
                                            locale="id"
                                            value={currentIdValue}
                                            onChange={onFieldChange}
                                            section={sectionName}
                                            aiEnabled={aiEnabled}
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
                                                aiEnabled={aiEnabled}
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
