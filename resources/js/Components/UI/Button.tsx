import { cn } from '@/lib/utils';
import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'gold' | 'outline' | 'ghost' | 'white' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({
        className,
        variant = 'primary',
        size = 'md',
        isLoading = false,
        leftIcon,
        rightIcon,
        children,
        disabled,
        ...props
    }, ref) => {
        const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

        const variants = {
            primary: 'bg-[#003f87] text-white hover:bg-[#002d6b] focus:ring-[#003f87]/50 border border-transparent',
            gold: 'bg-[#c9a84c] text-white hover:bg-[#a8821f] focus:ring-[#c9a84c]/50 border border-transparent',
            outline: 'border-2 border-[#003f87] text-[#003f87] hover:bg-[#eef5fc] focus:ring-[#003f87]/50',
            ghost: 'text-[#003f87] hover:bg-[#eef5fc] focus:ring-[#003f87]/50 border border-transparent',
            white: 'bg-white text-[#003f87] hover:bg-neutral-100 focus:ring-white/50 border border-transparent',
            danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-600/50 border border-transparent',
        };

        const sizes = {
            sm: 'px-4 py-2 text-sm rounded-lg',
            md: 'px-6 py-3 text-base rounded-xl',
            lg: 'px-8 py-4 text-lg rounded-xl',
        };

        return (
            <button
                ref={ref}
                className={cn(baseStyles, variants[variant], sizes[size], className)}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading && (
                    <LoadingSpinner size="sm" className={cn('mr-2', !children && 'mr-0')} />
                )}
                {!isLoading && leftIcon && (
                    <span className={cn('mr-2', !children && 'mr-0')}>{leftIcon}</span>
                )}
                {children}
                {!isLoading && rightIcon && (
                    <span className={cn('ml-2', !children && 'ml-0')}>{rightIcon}</span>
                )}
            </button>
        );
    }
);

Button.displayName = 'Button';

export default Button;
