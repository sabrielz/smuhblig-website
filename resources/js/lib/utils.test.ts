import { describe, it, expect } from 'vitest';
import { cn, truncate } from './utils';

describe('utils', () => {
    describe('cn', () => {
        it('merges class names correctly', () => {
            expect(cn('px-4', 'py-2')).toBe('px-4 py-2');
        });

        it('handles conditional classes and resolves conflicts', () => {
            expect(cn('px-2', false && 'hidden', 'px-4')).toBe('px-4');
        });
    });

    describe('truncate', () => {
        it('returns original string if length is within limit', () => {
            expect(truncate('Hello World', 20)).toBe('Hello World');
        });

        it('truncates and appends ellipsis if text exceeds limit', () => {
            expect(truncate('Hello World', 5)).toBe('Hello…');
        });
    });
});
