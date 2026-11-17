import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { NavDropdown } from './NavDropdown';

// Mock Inertia Link
vi.mock('@inertiajs/react', () => ({
    Link: ({ children, href, onClick, ...props }: any) => (
        <a href={href} onClick={onClick} {...props}>
            {children}
        </a>
    ),
}));

describe('NavDropdown Component', () => {
    const items = [
        { label: { id: 'Tentang Sekolah', en: 'About School' }, href: '/tentang' },
        { label: { id: 'Guru & Tendik', en: 'Teachers & Staff' }, href: '/guru' },
        { label: { id: 'Fasilitas', en: 'Facilities' }, href: '/fasilitas' },
        { label: { id: 'Ekstrakurikuler', en: 'Extracurricular' }, href: '/ekstrakurikuler' },
        { label: { id: 'Prestasi', en: 'Achievements' }, href: '/prestasi' },
    ];

    it('opens dropdown when pressing Enter and closes on Escape', () => {
        render(
            <NavDropdown
                label={{ id: 'Profil', en: 'Profile' }}
                locale="id"
                items={items}
                currentPath="/"
                isScrolled={false}
            />
        );

        const button = screen.getByRole('button', { name: /profil/i });
        expect(button.getAttribute('aria-expanded')).toBe('false');

        // Buka dengan Enter
        fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' });
        expect(button.getAttribute('aria-expanded')).toBe('true');
        expect(screen.getByText('Tentang Sekolah')).toBeDefined();
        expect(screen.getByText('Fasilitas')).toBeDefined();

        // Tutup dengan Escape
        fireEvent.keyDown(button, { key: 'Escape', code: 'Escape' });
        expect(button.getAttribute('aria-expanded')).toBe('false');
    });

    it('toggles dropdown on click', () => {
        render(
            <NavDropdown
                label={{ id: 'Profil', en: 'Profile' }}
                locale="id"
                items={items}
                currentPath="/"
                isScrolled={false}
            />
        );

        const button = screen.getByRole('button', { name: /profil/i });
        expect(button.getAttribute('aria-expanded')).toBe('false');

        fireEvent.click(button);
        expect(button.getAttribute('aria-expanded')).toBe('true');

        fireEvent.click(button);
        expect(button.getAttribute('aria-expanded')).toBe('false');
    });
});
