import React, { useState, useEffect } from 'react';
import { Modal } from '@/Components/UI/Modal';
import { Button } from '@/Components/UI/Button';
import { Input } from '@/Components/UI/Input';
import { Search, Image as ImageIcon, Check, Loader2 } from 'lucide-react';
import type { MediaLibraryItem } from '@/types';

interface MediaPickerProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (media: { url: string; alt: string }) => void;
}

export function MediaPicker({ isOpen, onClose, onSelect }: MediaPickerProps) {
    const [mediaList, setMediaList] = useState<MediaLibraryItem[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [search, setSearch] = useState<string>('');
    const [selectedMedia, setSelectedMedia] = useState<MediaLibraryItem | null>(null);

    const fetchMedia = async (searchQuery = '') => {
        setLoading(true);
        try {
            const url = new URL('/admin/media', window.location.origin);
            url.searchParams.set('type', 'image');
            if (searchQuery) {
                url.searchParams.set('search', searchQuery);
            }
            const response = await fetch(url.toString(), {
                headers: {
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });
            if (response.ok) {
                const data = await response.json();
                // Inertia response or resource collection
                const items = data.props?.media?.data || data.data || [];
                setMediaList(items);
            }
        } catch (error) {
            console.error('Gagal mengambil daftar media:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            setSelectedMedia(null);
            fetchMedia(search);
        }
    }, [isOpen]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        fetchMedia(search);
    };

    const handleConfirm = () => {
        if (selectedMedia && selectedMedia.url) {
            onSelect({
                url: selectedMedia.url,
                alt: selectedMedia.alt || selectedMedia.name || 'Gambar konten',
            });
            onClose();
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Pilih Gambar dari Pustaka Media"
            size="2xl"
        >
            <div className="space-y-4">
                <form onSubmit={handleSearchSubmit} className="flex gap-2">
                    <Input
                        placeholder="Cari nama atau berkas gambar..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1"
                    />
                    <Button type="submit" variant="outline">
                        <Search className="w-4 h-4 mr-1.5" />
                        Cari
                    </Button>
                </form>

                <div className="min-h-[280px] max-h-[380px] overflow-y-auto border rounded-xl p-3 bg-neutral-50/50">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-48 text-neutral-400">
                            <Loader2 className="w-8 h-8 animate-spin mb-2" />
                            <p className="text-sm">Memuat pustaka media...</p>
                        </div>
                    ) : mediaList.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-48 text-neutral-400">
                            <ImageIcon className="w-10 h-10 mb-2 opacity-40" />
                            <p className="text-sm">Tidak ada gambar yang ditemukan.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            {mediaList.map((item) => {
                                const isSelected = selectedMedia?.id === item.id;
                                return (
                                    <button
                                        type="button"
                                        key={item.id}
                                        onClick={() => setSelectedMedia(item)}
                                        className={`group relative aspect-square rounded-lg overflow-hidden border-2 text-left transition-all ${
                                            isSelected
                                                ? 'border-primary-600 ring-2 ring-primary-500/20 shadow-sm'
                                                : 'border-neutral-200 hover:border-neutral-300'
                                        }`}
                                    >
                                        {item.url ? (
                                            <img
                                                src={item.url}
                                                alt={item.alt || item.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-neutral-100 text-neutral-400">
                                                <ImageIcon className="w-6 h-6" />
                                            </div>
                                        )}
                                        {isSelected && (
                                            <div className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-primary-600 text-white flex items-center justify-center shadow-xs">
                                                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                                            </div>
                                        )}
                                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-1.5">
                                            <p className="text-[11px] font-medium text-white truncate">
                                                {item.name || item.file_name}
                                            </p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                {selectedMedia && (
                    <div className="bg-neutral-100 rounded-lg p-3 text-xs text-neutral-600 space-y-1">
                        <p><span className="font-semibold text-neutral-900">Berkas:</span> {selectedMedia.file_name}</p>
                        <p><span className="font-semibold text-neutral-900">Ukuran:</span> {selectedMedia.human_size}</p>
                        <p><span className="font-semibold text-neutral-900">Alt Text:</span> {selectedMedia.alt || '(Belum ada alt text)'}</p>
                    </div>
                )}

                <div className="flex justify-end gap-2 pt-2 border-t">
                    <Button variant="ghost" onClick={onClose}>
                        Batal
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleConfirm}
                        disabled={!selectedMedia}
                    >
                        Sisipkan Gambar
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
