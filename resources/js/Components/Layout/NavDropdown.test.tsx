import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { NavDropdown } from './NavDropdown';

// Mock react-i18next
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => {
            const map: Record<string, string> = {
                'nav.profile': 'Profil',
                'nav.about': 'Tentang Sekolah',
                'nav.teachers': 'Guru & Tendik',
                'nav.facilities': 'Fasilitas',
                'nav.extracurricular': 'Ekstrakurikuler',
                'nav.achievements': 'Prestasi',
            };
            return map[key] || key;
        },
    }),
}));

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
        { labelKey: 'nav.about', href: '/tentang' },
        { labelKey: 'nav.teachers', href: '/guru' },
        { labelKey: 'nav.facilities', href: '/fasilitas' },
        { labelKey: 'nav.extracurricular', href: '/ekstrakurikuler' },
        { labelKey: 'nav.achievements', href: '/prestasi' },
    ];

    it('opens dropdown when pressing Enter and closes on Escape', () => {
        render(
            <NavDropdown
                labelKey="nav.profile"
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
                labelKey="nav.profile"
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
