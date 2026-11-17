import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { MiniBarChart } from './MiniBarChart';

describe('MiniBarChart Component', () => {
    it('menampilkan teks kosong ketika data tidak ada', () => {
        render(<MiniBarChart data={[]} />);
        expect(screen.getByText('Tidak ada data kunjungan untuk ditampilkan')).toBeDefined();
    });

    it('memiliki jumlah batang SVG yang sama dengan jumlah item data', () => {
        const dummyData = [
            { label: '01 Nov', value: 10 },
            { label: '02 Nov', value: 25 },
            { label: '03 Nov', value: 15 },
        ];
        render(<MiniBarChart data={dummyData} />);

        const bars = screen.getAllByTestId('chart-bar');
        expect(bars.length).toBe(3);
    });

    it('memiliki atribut role img dan aria-label yang tepat', () => {
        const dummyData = [{ label: '01 Nov', value: 50 }];
        render(<MiniBarChart data={dummyData} />);

        const svg = screen.getByRole('img');
        expect(svg).toBeDefined();
        expect(svg.getAttribute('aria-label')).toContain('Grafik kunjungan batang. Nilai tertinggi 50.');
    });
});
