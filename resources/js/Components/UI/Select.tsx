import React, { SelectHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export interface SelectOption {
    value: string | number;
    label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: SelectOption[];
    placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
    (
        { className, label, error, options, id, placeholder, ...props },
        ref
    ) => {
        const selectId = id || `select-${Math.random().toString(36).substring(2, 9)}`;

        return (
            <div className="w-full">
                {label && (
                    <label
                        htmlFor={selectId}
                        className="block text-sm font-medium text-neutral-700 mb-1.5"
                    >
                        {label} {props.required && <span className="text-red-500">*</span>}
                    </label>
                )}

                <div className="relative">
                    <select
                        id={selectId}
                        ref={ref}
                        className={cn(
                            'block w-full rounded-lg border-neutral-300 shadow-sm transition-colors duration-200 min-h-[44px]',
                            'focus:border-[#003f87] focus:ring focus:ring-[#003f87] focus:ring-opacity-20',
                            'disabled:bg-neutral-100 disabled:text-neutral-500 disabled:cursor-not-allowed',
                            error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : '',
                            className
                        )}
                        {...props}
                    >
                        {placeholder && (
                            <option value="" disabled hidden>
                                {placeholder}
                            </option>
                        )}
                        {options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
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
            </div>
        );
    }
);

Select.displayName = 'Select';
