import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { TagInput } from './TagInput';

describe('TagInput component', () => {
    it('renders existing tags', () => {
        render(<TagInput value={['prestasi', 'sekolah']} onChange={vi.fn()} />);

        expect(screen.getByText('#prestasi')).toBeDefined();
        expect(screen.getByText('#sekolah')).toBeDefined();
    });

    it('adds new tag on Enter key and trims hash', () => {
        const handleChange = vi.fn();
        render(<TagInput value={['berita']} onChange={handleChange} />);

        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: '#lomba' } });
        fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

        expect(handleChange).toHaveBeenCalledWith(['berita', 'lomba']);
    });

    it('prevents adding duplicate tags (case insensitive)', () => {
        const handleChange = vi.fn();
        render(<TagInput value={['prestasi']} onChange={handleChange} />);

        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'PRESTASI' } });
        fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

        expect(handleChange).not.toHaveBeenCalled();
    });

    it('removes tag on click close button', () => {
        const handleChange = vi.fn();
        render(<TagInput value={['prestasi', 'smk']} onChange={handleChange} />);

        const removeButtons = screen.getAllByRole('button');
        fireEvent.click(removeButtons[0]);

        expect(handleChange).toHaveBeenCalledWith(['smk']);
    });

    it('removes last tag on Backspace when input is empty', () => {
        const handleChange = vi.fn();
        render(<TagInput value={['prestasi', 'smk']} onChange={handleChange} />);

        const input = screen.getByRole('textbox');
        fireEvent.keyDown(input, { key: 'Backspace', code: 'Backspace' });

        expect(handleChange).toHaveBeenCalledWith(['prestasi']);
    });
});
