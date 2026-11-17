import React, { useState, KeyboardEvent } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TagInputProps {
    value: string[];
    onChange: (tags: string[]) => void;
    maxTags?: number;
    placeholder?: string;
    className?: string;
    error?: string;
}

export function TagInput({
    value = [],
    onChange,
    maxTags = 10,
    placeholder = 'Tambah tag...',
    className,
    error,
}: TagInputProps) {
    const [inputValue, setInputValue] = useState('');

    const addTag = (rawText: string) => {
        const clean = rawText.trim().replace(/^#+/, '');
        if (!clean) return;

        if (value.length >= maxTags) return;

        // Cegah duplikat (case insensitive)
        const isDuplicate = value.some(
            (t) => t.toLowerCase() === clean.toLowerCase()
        );
        if (isDuplicate) {
            setInputValue('');
            return;
        }

        onChange([...value, clean]);
        setInputValue('');
    };

    const removeTag = (indexToRemove: number) => {
        onChange(value.filter((_, idx) => idx !== indexToRemove));
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addTag(inputValue);
        } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
            e.preventDefault();
            removeTag(value.length - 1);
        }
    };

    return (
        <div className={cn('w-full', className)}>
            <div
                className={cn(
                    'flex flex-wrap items-center gap-1.5 p-2 rounded-xl border bg-white min-h-[46px] transition-all',
                    error
                        ? 'border-red-500 focus-within:ring-2 focus-within:ring-red-500/20'
                        : 'border-neutral-200 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/20'
                )}
            >
                {value.map((tag, idx) => (
                    <span
                        key={`${tag}-${idx}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-neutral-100 text-neutral-800 text-xs font-medium"
                    >
                        <span>#{tag}</span>
                        <button
                            type="button"
                            onClick={() => removeTag(idx)}
                            aria-label={`Hapus tag ${tag}`}
                            className="text-neutral-400 hover:text-neutral-700 transition-colors"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    </span>
                ))}

                {value.length < maxTags && (
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onBlur={() => {
                            if (inputValue.trim()) {
                                addTag(inputValue);
                            }
                        }}
                        placeholder={value.length === 0 ? placeholder : ''}
                        className="flex-1 min-w-[120px] bg-transparent text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none px-1 py-0.5"
                    />
                )}
            </div>

            <div className="flex items-center justify-between mt-1 text-xs text-neutral-400">
                <span>{error ? <span className="text-red-500">{error}</span> : 'Tekan Enter atau koma (,) untuk menambah tag'}</span>
                <span>
                    {value.length}/{maxTags}
                </span>
            </div>
        </div>
    );
}

export default TagInput;
