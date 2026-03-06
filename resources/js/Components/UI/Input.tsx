import React, { InputHTMLAttributes, forwardRef, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    hint?: string;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        { className, label, error, hint, leftIcon, rightIcon, id, ...props },
        ref
    ) => {
        const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;

        return (
            <div className="w-full">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="block text-sm font-medium text-neutral-700 mb-1.5"
                    >
                        {label} {props.required && <span className="text-red-500">*</span>}
                    </label>
                )}

                <div className="relative">
                    {leftIcon && (
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                            {leftIcon}
                        </div>
                    )}

                    <input
                        id={inputId}
                        ref={ref}
                        className={cn(
                            'block w-full rounded-lg border-neutral-300 shadow-sm transition-colors duration-200 min-h-[44px]',
                            'focus:border-[#003f87] focus:ring focus:ring-[#003f87] focus:ring-opacity-20',
                            'disabled:bg-neutral-100 disabled:text-neutral-500 disabled:cursor-not-allowed',
                            leftIcon ? 'pl-10' : '',
                            rightIcon ? 'pr-10' : '',
                            error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : '',
                            className
                        )}
                        {...props}
                    />

                    {rightIcon && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-neutral-400">
                            {rightIcon}
                        </div>
                    )}
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

Input.displayName = 'Input';
