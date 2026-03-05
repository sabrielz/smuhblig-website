import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/UI/Button';
import { ConfirmDialog } from '@/Components/UI/ConfirmDialog';
import { ArrowLeft, UploadCloud, X, ImageIcon, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

interface Photo {
    id: number;
    url: string;
    preview_url: string;
    name: string;
    size: string;
    sort_order: number;
}

interface Galeri {
    id: number;
    judul_id: string;
    event_date: string | null;
}

interface Props {
    galeri: Galeri;
    photos: Photo[];
}

export default function Show({ galeri, photos: initialPhotos }: Props) {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [isDraggingUpload, setIsDraggingUpload] = useState(false);

    // Sort logic
    const [draggedPhotoIndex, setDraggedPhotoIndex] = useState<number | null>(null);

    useEffect(() => {
        setPhotos(initialPhotos.sort((a, b) => a.sort_order - b.sort_order));
    }, [initialPhotos]);

    const { data, setData, post, processing, progress, reset, errors } = useForm<{ photos: File[] }>({
        photos: [],
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUploadFiles = (files: File[]) => {
        const validFiles = Array.from(files).filter(file => {
            if (!file.type.startsWith('image/')) {
                toast.error(`${file.name} bukan berupa file gambar.`);
                return false;
            }
            if (file.size > 5 * 1024 * 1024) {
                toast.error(`${file.name} melebihi batas 5MB.`);
                return false;
            }
            return true;
        });

        if (validFiles.length > 20) {
            toast.error('Hanya 20 foto yang bisa diupload sekaligus.');
            return;
        }

        if (validFiles.length === 0) return;

        // Immediately upload valid files
        router.post(route('admin.galeri.uploadFoto', { galeri: galeri.id } as any), {
            _method: 'post',
            photos: validFiles,
        }, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Foto berhasil diunggah.');
                reset();
            },
            onError: (err) => {
                Object.values(err).forEach((msg) => toast.error(msg as string));
            }
        });
    };

    const handleDelete = () => {
        if (!deleteId) return;
        router.delete(route('admin.galeri.deleteFoto', { mediaId: deleteId } as any), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Foto dihapus.');
                setDeleteId(null);
            },
        });
    };

    const handleDragStart = (index: number) => {
        setDraggedPhotoIndex(index);
    };

    const handleDragEnter = (index: number) => {
        if (draggedPhotoIndex === null || draggedPhotoIndex === index) return;

        const newPhotos = [...photos];
        const draggedItem = newPhotos[draggedPhotoIndex];
        newPhotos.splice(draggedPhotoIndex, 1);
        newPhotos.splice(index, 0, draggedItem);

        setDraggedPhotoIndex(index);
        setPhotos(newPhotos);
    };

    const handleDragEnd = () => {
        setDraggedPhotoIndex(null);
        toast('Urutan foto diubah (visual only).', { icon: 'ℹ️' });
    };

    return (
        <AdminLayout title={`Album: ${galeri.judul_id}`}>
            <Head title={`Album: ${galeri.judul_id}`} />

            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link href={route('admin.galeri.index')}>
                        <Button variant="outline" size="sm" className="px-3">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                            {galeri.judul_id}
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Kelola koleksi foto dalam album ini
                        </p>
                    </div>
                </div>
                <Link href={route('admin.galeri.edit', { galeri: galeri.id } as any)}>
                    <Button>Edit Album</Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* UPOLAD ZONE */}
                <div className="lg:col-span-1">
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={(e) => { e.preventDefault(); setIsDraggingUpload(true); }}
                        onDragLeave={(e) => { e.preventDefault(); setIsDraggingUpload(false); }}
                        onDrop={(e) => {
                            e.preventDefault();
                            setIsDraggingUpload(false);
                            if (e.dataTransfer.files) handleUploadFiles(Array.from(e.dataTransfer.files));
                        }}
                        className={cn(
                            "w-full h-48 border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-6 text-center transition-all cursor-pointer group sticky top-24",
                            isDraggingUpload ? "border-blue-500 bg-blue-50" : "border-neutral-300 hover:border-blue-400 hover:bg-neutral-50"
                        )}
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            multiple
                            accept="image/jpeg,image/png,image/webp,image/jpg"
                            onChange={(e) => {
                                if (e.target.files) handleUploadFiles(Array.from(e.target.files));
                            }}
                        />
                        <UploadCloud className={cn("w-10 h-10 mb-3", isDraggingUpload ? "text-blue-500" : "text-neutral-400 group-hover:text-blue-500")} />
                        <p className="text-sm font-semibold text-neutral-800 mb-1">Upload Foto Baru</p>
                        <p className="text-xs text-neutral-500">Drag & drop atau klik untuk memilih file.</p>
                        <p className="text-[10px] text-neutral-400 mt-2">Maks 20 foto/upload. 5MB/foto.</p>
                    </div>
                    {progress && (
                        <div className="mt-4 p-4 border rounded-lg bg-neutral-50 shadow-sm border-neutral-200">
                            <p className="text-sm font-semibold mb-2">Mengunggah Foto...</p>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${progress.percentage}%` }}></div>
                            </div>
                            <p className="text-xs mt-1 text-right">{progress.percentage}%</p>
                        </div>
                    )}
                </div>

                {/* PHOTOS GRID */}
                <div className="lg:col-span-3">
                    {photos.length === 0 ? (
                        <div className="bg-white rounded-xl border border-neutral-100 p-16 text-center flex flex-col items-center justify-center">
                            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4 text-neutral-400">
                                <ImageIcon className="w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-bold text-neutral-900 mb-1">Belum ada foto</h3>
                            <p className="text-neutral-500">
                                Silakan unggah foto menggunakan area di sebelah kiri.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                            {photos.map((photo, index) => (
                                <div
                                    key={photo.id}
                                    draggable
                                    onDragStart={() => handleDragStart(index)}
                                    onDragEnter={() => handleDragEnter(index)}
                                    onDragEnd={handleDragEnd}
                                    onDragOver={(e) => e.preventDefault()}
                                    className="group relative aspect-square rounded-xl bg-neutral-100 overflow-hidden shadow-sm border border-neutral-200 cursor-grab active:cursor-grabbing hover:shadow-md transition-all"
                                >
                                    <img
                                        src={photo.preview_url}
                                        alt={photo.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        loading="lazy"
                                    />

                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                                        <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setDeleteId(photo.id); }}
                                                className="p-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors shadow-sm"
                                                title="Hapus foto"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div className="text-white text-xs opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                                            <GripVertical className="w-4 h-4 opacity-70" />
                                            <span className="truncate flex-1 font-medium">{photo.name}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <ConfirmDialog
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Hapus Foto"
                message="Apakah Anda yakin ingin menghapus foto terpilih? Tindakan ini tidak dapat dibatalkan."
                variant="danger"
                confirmLabel="Hapus"
            />
        </AdminLayout>
    );
}
