import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';
// Assuming there might be a Button component or just using standard html buttons
// import { Button } from './Button';

export interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: 'danger' | 'primary';
    isLoading?: boolean;
}

export function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmLabel = 'Ya, Lanjutkan',
    cancelLabel = 'Batal',
    variant = 'danger',
    isLoading = false,
}: ConfirmDialogProps) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const isDanger = variant === 'danger';

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm"
                    />

                    {/* Dialog Panel */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden"
                    >
                        <div className="p-6">
                            <div className="flex items-start">
                                <div
                                    className={cn(
                                        'flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full',
                                        isDanger
                                            ? 'bg-red-100 text-red-600'
                                            : 'bg-blue-100 text-[#003f87]'
                                    )}
                                >
                                    {isDanger ? (
                                        <AlertTriangle className="w-6 h-6" />
                                    ) : (
                                        <Info className="w-6 h-6" />
                                    )}
                                </div>
                                <div className="ml-4 flex-1">
                                    <h3 className="text-lg font-semibold text-neutral-900">
                                        {title}
                                    </h3>
                                    <p className="mt-2 text-sm text-neutral-600">
                                        {message}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="px-6 py-4 bg-neutral-50 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 gap-3 sm:gap-0">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isLoading}
                                className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-200 transition-colors disabled:opacity-50"
                            >
                                {cancelLabel}
                            </button>
                            <button
                                type="button"
                                onClick={onConfirm}
                                disabled={isLoading}
                                className={cn(
                                    'w-full sm:w-auto px-4 py-2 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors disabled:opacity-50 flex items-center justify-center',
                                    isDanger
                                        ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                                        : 'bg-[#003f87] hover:bg-[#003f87]/90 focus:ring-[#003f87]'
                                )}
                            >
                                {isLoading ? (
                                    <span className="flex items-center space-x-2">
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Loading...
                                    </span>
                                ) : (
                                    confirmLabel
                                )}
                            </button>
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-500 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
