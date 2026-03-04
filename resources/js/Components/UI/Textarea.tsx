import React, { TextareaHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    (
        { className, label, error, hint, rows = 4, id, ...props },
        ref
    ) => {
        const textareaId = id || `textarea-${Math.random().toString(36).substring(2, 9)}`;

        return (
            <div className="w-full">
                {label && (
                    <label
                        htmlFor={textareaId}
                        className="block text-sm font-medium text-neutral-700 mb-1.5"
                    >
                        {label} {props.required && <span className="text-red-500">*</span>}
                    </label>
                )}

                <div className="relative">
                    <textarea
                        id={textareaId}
                        ref={ref}
                        rows={rows}
                        className={cn(
                            'block w-full rounded-lg border-neutral-300 shadow-sm transition-colors duration-200 resize-y min-h-[80px]',
                            'focus:border-[#003f87] focus:ring focus:ring-[#003f87] focus:ring-opacity-20',
                            'disabled:bg-neutral-100 disabled:text-neutral-500 disabled:cursor-not-allowed',
                            error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : '',
                            className
                        )}
                        {...props}
                    />
                </div>

                <AnimatePresence>
                    {error && (
                        <motion.p
                            initial={{ opacity: 0, height: 0, marginTop: 0 }}
                            animate={{ opacity: 1, height: 'auto', marginTop: 4 }}
                            exit={{ opacity: 0, height: 0, marginTop: 0 }}
                            className="text-sm text-red-600"
                        >
                            {error}
                        </motion.p>
                    )}
                </AnimatePresence>

                {hint && !error && (
                    <p className="mt-1.5 text-sm text-neutral-500">{hint}</p>
                )}
            </div>
        );
    }
);

Textarea.displayName = 'Textarea';
