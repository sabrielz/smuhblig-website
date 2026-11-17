import React from 'react';
import { cn } from '@/lib/utils';

export interface ResponsiveImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    srcset?: string;
    alt: string;
    width?: number | string;
    height?: number | string;
    aspectRatio?: string;
    isHero?: boolean;
    className?: string;
}

export function ResponsiveImage({
    src,
    srcset,
    alt,
    width,
    height,
    aspectRatio,
    isHero = false,
    className = '',
    loading,
    fetchPriority,
    style,
    ...rest
}: ResponsiveImageProps) {
    const combinedStyle: React.CSSProperties = {
        ...style,
        ...(aspectRatio ? { aspectRatio } : {}),
    };

    return (
        <img
            src={src}
            srcSet={srcset}
            alt={alt}
            width={width}
            height={height}
            loading={isHero ? 'eager' : (loading || 'lazy')}
            fetchPriority={isHero ? 'high' : (fetchPriority || 'auto')}
            decoding="async"
            style={combinedStyle}
            className={cn('object-cover', className)}
            {...rest}
        />
    );
}

export default ResponsiveImage;
