import { useEffect } from 'react';
import { Input } from '@/Components/UI/Input';
import { Button } from '@/Components/UI/Button';
import { Link, useForm } from '@inertiajs/react';
import { Save, ArrowLeft, Search } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import React, { useState } from 'react';

// Select searchable icon picker
const IconPicker = ({ value, onChange, error }: { value: string, onChange: (v: string) => void, error?: string }) => {
    const [search, setSearch] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const iconNames = Object.keys(LucideIcons).filter(key =>
        key !== 'createLucideIcon' &&
        key !== 'default' &&
        typeof (LucideIcons as any)[key] === 'object'
    );

    const filteredIcons = iconNames.filter(name => name.toLowerCase().includes(search.toLowerCase())).slice(0, 50);

    const CurrentIcon = value ? (LucideIcons as any)[value] : null;

    return (
        <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Icon (Lucide)</label>
            <div
                className={`flex items-center justify-between border rounded-lg px-3 py-2 cursor-pointer bg-white ${error ? 'border-red-500' : 'border-gray-300'}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-2 text-gray-700">
                    {CurrentIcon ? <CurrentIcon className="w-5 h-5 text-gray-600" /> : <Search className="w-5 h-5 text-gray-400" />}
                    <span>{value || 'Pilih Icon...'}</span>
                </div>
            </div>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

            {isOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-2 max-h-64 overflow-y-auto">
                    <Input
                        placeholder="Cari icon..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="mb-2 w-full text-sm"
                        autoFocus
                    />
                    <div className="grid grid-cols-4 gap-2">
                        {filteredIcons.map(name => {
                            const IconCmp = (LucideIcons as any)[name];
                            return (
                                <div
                                    key={name}
                                    className="p-2 border border-gray-100 rounded hover:bg-gray-50 flex flex-col items-center justify-center cursor-pointer"
                                    onClick={() => {
                                        onChange(name);
                                        setIsOpen(false);
                                    }}
                                >
                                    <IconCmp className="w-5 h-5 text-gray-700" />
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default function TautanForm({ tautan = null, isEdit = false }: { tautan?: any, isEdit?: boolean }) {
    const { data, setData, post, put, processing, errors } = useForm({
        label: tautan?.label || '',
        label_en: tautan?.label_en || '',
        url: tautan?.url || '',
        icon_name: tautan?.icon_name || '',
        kategori: tautan?.kategori || '',
        buka_tab_baru: tautan?.buka_tab_baru ?? true,
        is_active: tautan?.is_active ?? true,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit) {
            put(route('admin.tautan.update', tautan.id));
        } else {
            post(route('admin.tautan.store'));
        }
    };

    return (
        <form onSubmit={submit} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm max-w-4xl mx-auto space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                    label="Label (ID)"
                    value={data.label}
                    onChange={e => setData('label', e.target.value)}
                    error={errors.label}
                    required
                />
                <Input
                    label="Label (EN)"
                    value={data.label_en}
                    onChange={e => setData('label_en', e.target.value)}
                    error={errors.label_en}
                />

                <div className="md:col-span-2">
                    <Input
                        label="URL Tautan"
                        type="url"
                        value={data.url}
                        onChange={e => setData('url', e.target.value)}
                        error={errors.url}
                        placeholder="https://..."
                        required
                    />
                </div>

                <IconPicker
                    value={data.icon_name}
                    onChange={v => setData('icon_name', v)}
                    error={errors.icon_name}
                />

                <Input
                    label="Kategori"
                    value={data.kategori}
                    onChange={e => setData('kategori', e.target.value)}
                    error={errors.kategori}
                    placeholder="Contoh: Media Sosial, Partner"
                />

                <div className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        id="buka_tab_baru"
                        checked={data.buka_tab_baru}
                        onChange={e => setData('buka_tab_baru', e.target.checked)}
                        className="rounded border-gray-300 text-primary-navy focus:ring-primary-navy"
                    />
                    <label htmlFor="buka_tab_baru" className="text-sm font-medium text-gray-700 cursor-pointer">
                        Buka di tab baru (_blank)
                    </label>
                </div>

                <div className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        id="is_active"
                        checked={data.is_active}
                        onChange={e => setData('is_active', e.target.checked)}
                        className="rounded border-gray-300 text-primary-navy focus:ring-primary-navy"
                    />
                    <label htmlFor="is_active" className="text-sm font-medium text-gray-700 cursor-pointer">
                        Aktif (Tampilkan di website)
                    </label>
                </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                <Link href={route('admin.tautan.index')}>
                    <Button variant="outline" type="button">Batal</Button>
                </Link>
                <Button type="submit" disabled={processing}>
                    <Save className="w-4 h-4 mr-2" />
                    Simpan
                </Button>
            </div>
        </form>
    );
}
