import { TextareaHTMLAttributes, forwardRef, useId } from 'react';
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
        const generatedId = useId();
        const textareaId = id || generatedId;
        const errorId = `${textareaId}-error`;
        const hintId = `${textareaId}-hint`;

        const describedBy = [
            error ? errorId : null,
            hint && !error ? hintId : null,
        ].filter(Boolean).join(' ') || undefined;

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
                        aria-invalid={error ? 'true' : 'false'}
                        aria-describedby={describedBy}
                        className={cn(
                            'block w-full rounded-lg border-neutral-300 shadow-sm transition-colors duration-200 min-h-[44px]',
                            'focus:border-primary-600 focus:ring focus:ring-primary-600 focus:ring-opacity-20',
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
                            id={errorId}
                            role="alert"
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
                    <p id={hintId} className="mt-1.5 text-sm text-neutral-500">{hint}</p>
                )}
            </div>
        );
    }
);

Textarea.displayName = 'Textarea';
