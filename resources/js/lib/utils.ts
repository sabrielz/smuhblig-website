import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes with clsx.
 * Handles conditional classes and resolves Tailwind conflicts.
 *
 * @example
 * cn('px-4 py-2', isActive && 'bg-primary-600', className)
 */
export function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs));
}

/**
 * Format a date to Indonesian locale string.
 */
export function formatDate(date: string | Date, locale: string = 'id-ID'): string {
    return new Intl.DateTimeFormat(locale, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(new Date(date));
}

/**
 * Format a date with relative time (e.g., "2 hari yang lalu").
 */
export function formatRelativeDate(date: string | Date, locale: string = 'id-ID'): string {
    const now = new Date();
    const target = new Date(date);
    const diffMs = now.getTime() - target.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

    if (diffDays === 0) return rtf.format(0, 'day');
    if (diffDays < 7) return rtf.format(-diffDays, 'day');
    if (diffDays < 30) return rtf.format(-Math.floor(diffDays / 7), 'week');
    if (diffDays < 365) return rtf.format(-Math.floor(diffDays / 30), 'month');
    return rtf.format(-Math.floor(diffDays / 365), 'year');
}

/**
 * Truncate text to a specified length with ellipsis.
 */
export function truncate(text: string, length: number): string {
    if (text.length <= length) return text;
    return text.slice(0, length).trimEnd() + '…';
}

/**
 * Generate initials from a full name.
 */
export function getInitials(name: string): string {
    return name
        .split(' ')
        .map((word) => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}
