import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { Accordion } from './Accordion';

describe('Accordion UI Component', () => {
    const items = [
        {
            id: '1',
            title: 'Apa itu SMK Muhammadiyah Bligo?',
            content: '<p>Sekolah Pusat Keunggulan di Pekalongan.</p>',
        },
        {
            id: '2',
            title: 'Bagaimana cara mendaftar?',
            content: '<p>Pendaftaran lewat link SPMB resmi.</p>',
        },
    ];

    it('renders all accordion headers properly with aria-expanded false initially', () => {
        render(<Accordion items={items} />);

        const buttons = screen.getAllByRole('button');
        expect(buttons).toHaveLength(2);
        expect(buttons[0].getAttribute('aria-expanded')).toBe('false');
        expect(buttons[1].getAttribute('aria-expanded')).toBe('false');
    });

    it('toggles panel open and closed on click', () => {
        render(<Accordion items={items} />);

        const firstButton = screen.getByRole('button', { name: /Apa itu SMK Muhammadiyah Bligo\?/i });
        expect(firstButton.getAttribute('aria-expanded')).toBe('false');

        // Buka
        fireEvent.click(firstButton);
        expect(firstButton.getAttribute('aria-expanded')).toBe('true');
        expect(screen.getByText('Sekolah Pusat Keunggulan di Pekalongan.')).toBeTruthy();

        // Tutup
        fireEvent.click(firstButton);
        expect(firstButton.getAttribute('aria-expanded')).toBe('false');
    });

    it('honors defaultOpenId prop', () => {
        render(<Accordion items={items} defaultOpenId="2" />);

        const secondButton = screen.getByRole('button', { name: /Bagaimana cara mendaftar\?/i });
        expect(secondButton.getAttribute('aria-expanded')).toBe('true');
        expect(screen.getByText('Pendaftaran lewat link SPMB resmi.')).toBeTruthy();
    });
});
