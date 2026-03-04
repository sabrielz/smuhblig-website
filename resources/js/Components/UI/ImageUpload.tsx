import React, { useCallback, useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { UploadCloud, X, Image as ImageIcon } from 'lucide-react';

export interface ImageUploadProps {
    value?: string; // URL of existing image
    onChange: (file: File) => void;
    aspectRatio?: string;
    className?: string;
    label?: string;
    error?: string;
    accept?: string;
    maxSizeMB?: number;
}

export function ImageUpload({
    value,
    onChange,
    aspectRatio = 'aspect-video',
    className,
    label,
    error,
    accept = 'image/jpeg, image/png, image/webp',
    maxSizeMB = 2,
}: ImageUploadProps) {
    const [preview, setPreview] = useState<string | null>(value || null);
    const [isDragging, setIsDragging] = useState(false);
    const [fileError, setFileError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (value) {
            setPreview(value);
        }
    }, [value]);

    const handleFile = (file: File) => {
        setFileError(null);

        if (!file.type.startsWith('image/')) {
            setFileError('File harus berupa gambar');
            return;
        }

        if (file.size > maxSizeMB * 1024 * 1024) {
            setFileError(`Ukuran file maksimal ${maxSizeMB}MB`);
            return;
        }

        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
        onChange(file);
    };

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFile(e.dataTransfer.files[0]);
            e.dataTransfer.clearData();
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFile(e.target.files[0]);
        }
    };

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        setPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        // If it's a completely new state, we don't have a file to send,
        // but since onChange requires a file, the parent might handle null internally.
        // We'll leave it to just clearing the preview state for now.
    };

    const displayError = error || fileError;

    return (
        <div className={cn('w-full', className)}>
            {label && (
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                    {label}
                </label>
            )}

            <div
                className={cn(
                    'relative overflow-hidden rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer group',
                    aspectRatio,
                    isDragging
                        ? 'border-[#003f87] bg-blue-50/50'
                        : 'border-neutral-300 hover:border-[#003f87] hover:bg-neutral-50',
                    displayError ? 'border-red-500 hover:border-red-600' : ''
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleChange}
                    accept={accept}
                    className="hidden"
                />

                {preview ? (
                    <div className="absolute inset-0 w-full h-full">
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                                type="button"
                                onClick={handleRemove}
                                className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-neutral-500">
                        <div className="w-12 h-12 mb-4 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600 group-hover:bg-[#003f87]/10 group-hover:text-[#003f87] transition-colors">
                            <UploadCloud className="w-6 h-6" />
                        </div>
                        <p className="text-sm font-medium text-neutral-700 mb-1">
                            Klik atau drag & drop gambar ke sini
                        </p>
                        <p className="text-xs text-neutral-500">
                            SVG, PNG, JPG, WEBP (Max. {maxSizeMB}MB)
                        </p>
                    </div>
                )}
            </div>

            {displayError && (
                <p className="mt-1.5 text-sm text-red-600">{displayError}</p>
            )}
        </div>
    );
}
