import { cn } from '@/lib/utils';
import React from 'react';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    width?: string | number;
    height?: string | number;
    rounded?: string;
}

export function Skeleton({
    className,
    width,
    height,
    rounded = 'rounded-md',
    style,
    ...props
}: SkeletonProps) {
    return (
        <div
            className={cn(
                'animate-pulse bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 bg-[length:200%_100%]',
                rounded,
                className
            )}
            style={{ width, height, ...style }}
            {...props}
        />
    );
}

export function SkeletonText({
    lines = 3,
    className,
    ...props
}: { lines?: number } & SkeletonProps) {
    return (
        <div className={cn('space-y-2', className)} {...props}>
            {Array.from({ length: lines }).map((_, i) => (
                <Skeleton
                    key={i}
                    height="1rem"
                    className={cn(
                        'w-full',
                        i === lines - 1 && lines > 1 ? 'w-2/3' : ''
                    )}
                />
            ))}
        </div>
    );
}

export function SkeletonCard({ className, ...props }: SkeletonProps) {
    return (
        <div className={cn('flex flex-col space-y-3 overflow-hidden rounded-xl border border-neutral-100 bg-white p-4 shadow-sm', className)} {...props}>
            <Skeleton className="h-40 w-full rounded-lg" />
            <div className="space-y-2 pt-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
            </div>
        </div>
    );
}

export default Skeleton;
