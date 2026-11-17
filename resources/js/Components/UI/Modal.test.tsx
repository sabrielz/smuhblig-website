import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React, { useState } from 'react';
import { Modal } from './Modal';

function ModalTestWrapper() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div>
            <button
                type="button"
                data-testid="trigger-btn"
                onClick={() => setIsOpen(true)}
            >
                Buka Modal
            </button>

            <Modal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                title="Judul Modal Uji"
            >
                <div data-testid="modal-content">
                    <p>Konten di dalam modal</p>
                    <button type="button" data-testid="modal-action-btn">
                        Aksi
                    </button>
                </div>
            </Modal>
        </div>
    );
}

describe('Modal accessibility & keyboard behavior', () => {
    it('renders with role="dialog" and aria-modal="true" when open', () => {
        render(<ModalTestWrapper />);

        const trigger = screen.getByTestId('trigger-btn');
        fireEvent.click(trigger);

        const dialog = screen.getByRole('dialog');
        expect(dialog).toBeDefined();
        expect(dialog.getAttribute('aria-modal')).toBe('true');
        expect(screen.getByText('Judul Modal Uji')).toBeDefined();
    });

    it('closes on Escape key press and returns focus to trigger', async () => {
        render(<ModalTestWrapper />);

        const trigger = screen.getByTestId('trigger-btn');
        trigger.focus();
        expect(document.activeElement).toBe(trigger);

        // Buka modal
        fireEvent.click(trigger);

        // Dialog harus muncul
        expect(screen.getByRole('dialog')).toBeDefined();

        // Tekan tombol Escape
        fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });

        // Tunggu modal tertutup
        await waitFor(() => {
            expect(screen.queryByRole('dialog')).toBeNull();
        });

        // Fokus kembali ke tombol pemicu
        expect(document.activeElement).toBe(trigger);
    });
});
