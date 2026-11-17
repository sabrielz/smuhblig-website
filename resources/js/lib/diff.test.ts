import { describe, it, expect } from 'vitest';
import { computeLineDiff, stripHtml } from './diff';

describe('diff lib', () => {
    it('menghasilkan same ketika teks identik', () => {
        const text = 'Baris 1\nBaris 2';
        const diff = computeLineDiff(text, text);
        expect(diff).toEqual([
            { type: 'same', text: 'Baris 1' },
            { type: 'same', text: 'Baris 2' },
        ]);
    });

    it('mendeteksi penambahan baris', () => {
        const oldText = 'Baris 1';
        const newText = 'Baris 1\nBaris 2';
        const diff = computeLineDiff(oldText, newText);
        expect(diff).toEqual([
            { type: 'same', text: 'Baris 1' },
            { type: 'add', text: 'Baris 2' },
        ]);
    });

    it('mendeteksi penghapusan baris', () => {
        const oldText = 'Baris 1\nBaris 2';
        const newText = 'Baris 1';
        const diff = computeLineDiff(oldText, newText);
        expect(diff).toEqual([
            { type: 'same', text: 'Baris 1' },
            { type: 'del', text: 'Baris 2' },
        ]);
    });

    it('mendeteksi perubahan (del dan add) baris', () => {
        const oldText = 'Baris Lama';
        const newText = 'Baris Baru';
        const diff = computeLineDiff(oldText, newText);
        expect(diff).toEqual([
            { type: 'del', text: 'Baris Lama' },
            { type: 'add', text: 'Baris Baru' },
        ]);
    });

    it('membersihkan tag HTML dengan stripHtml', () => {
        const html = '<p>Halo <strong>dunia</strong></p><br/><div>Baris dua</div>';
        const stripped = stripHtml(html);
        expect(stripped).toContain('Halo dunia');
        expect(stripped).toContain('Baris dua');
    });
});
