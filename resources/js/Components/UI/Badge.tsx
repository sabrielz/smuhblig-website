import { cn } from '@/lib/utils';
import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: 'primary' | 'gold' | 'success' | 'warning' | 'danger' | 'neutral' | 'info';
    size?: 'sm' | 'md';
}

export function Badge({
    className,
    variant = 'primary',
    size = 'sm',
    children,
    ...props
}: BadgeProps) {
    const baseStyles = 'inline-flex items-center justify-center rounded-full font-medium';

    const variants = {
        primary: 'bg-[#003f87]/10 text-[#003f87]',
        gold: 'bg-[#c9a84c]/10 text-[#c9a84c]',
        success: 'bg-emerald-100 text-emerald-800',
        warning: 'bg-amber-100 text-amber-800',
        danger: 'bg-red-100 text-red-800',
        neutral: 'bg-neutral-100 text-neutral-800',
        info: 'bg-blue-100 text-blue-800',
    };

    const sizes = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-sm',
    };

    return (
        <span
            className={cn(baseStyles, variants[variant], sizes[size], className)}
            {...props}
        >
            {children}
        </span>
    );
}

export default Badge;
