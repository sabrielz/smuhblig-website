import { useEffect, useRef, useId } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { scaleIn, fadeIn } from '@/lib/motion';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
    className?: string;
}

const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-[95vw] sm:max-w-7xl',
};

export function Modal({ isOpen, onClose, title, children, size = 'md', className }: ModalProps) {
    const overlayRef = useRef<HTMLDivElement>(null);
    const dialogRef = useRef<HTMLDivElement>(null);
    const previousActiveElement = useRef<HTMLElement | null>(null);
    const titleId = useId();

    useEffect(() => {
        if (!isOpen) return;

        // Simpan elemen pemicu yang aktif sebelum modal terbuka
        previousActiveElement.current = document.activeElement as HTMLElement | null;
        document.body.style.overflow = 'hidden';

        // Focus trap & Esc handler
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                e.stopPropagation();
                onClose();
                return;
            }

            if (e.key === 'Tab' && dialogRef.current) {
                const focusableElements = dialogRef.current.querySelectorAll<HTMLElement>(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                if (focusableElements.length === 0) return;

                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];

                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        // Auto-focus elemen pertama dalam dialog setelah mount
        const timer = setTimeout(() => {
            if (dialogRef.current) {
                const focusable = dialogRef.current.querySelector<HTMLElement>(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                if (focusable) {
                    focusable.focus();
                } else {
                    dialogRef.current.focus();
                }
            }
        }, 50);

        return () => {
            clearTimeout(timer);
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
            // Kembalikan fokus ke elemen pemicu
            if (previousActiveElement.current && typeof previousActiveElement.current.focus === 'function') {
                previousActiveElement.current.focus();
            }
        };
    }, [isOpen, onClose]);

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === overlayRef.current) onClose();
    };

    if (typeof document === 'undefined') return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    {/* Overlay */}
                    <motion.div
                        variants={fadeIn}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        ref={overlayRef}
                        onClick={handleOverlayClick}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                        aria-hidden="true"
                    />

                    {/* Modal Panel */}
                    <motion.div
                        ref={dialogRef}
                        tabIndex={-1}
                        variants={scaleIn}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby={title ? titleId : undefined}
                        className={cn(
                            "relative w-full bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden focus:outline-none",
                            sizeClasses[size],
                            className
                        )}
                    >
                        {/* Header */}
                        {title && (
                            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 shrink-0">
                                <h2 id={titleId} className="text-lg font-semibold text-neutral-900">
                                    {title}
                                </h2>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    aria-label="Tutup dialog"
                                    className="p-2 -mr-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5" strokeWidth={1.5} />
                                </button>
                            </div>
                        )}

                        {/* Close button if no title */}
                        {!title && (
                            <button
                                type="button"
                                onClick={onClose}
                                aria-label="Tutup dialog"
                                className="absolute top-4 right-4 z-10 p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50 rounded-lg transition-colors bg-white/50 backdrop-blur-sm"
                            >
                                <X className="w-5 h-5" strokeWidth={1.5} />
                            </button>
                        )}

                        {/* Body */}
                        <div className="p-6 overflow-y-auto overflow-x-hidden flex-1 custom-scrollbar">
                            {children}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
}
