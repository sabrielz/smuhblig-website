import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

export interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    className?: string;
}

export function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    className,
}: PaginationProps) {
    if (totalPages <= 1) return null;

    const renderPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        if (startPage > 1) {
            pages.push(
                <button
                    key="1"
                    onClick={() => onPageChange(1)}
                    className="w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors text-neutral-600 hover:bg-neutral-100"
                >
                    1
                </button>
            );
            if (startPage > 2) {
                pages.push(
                    <div key="ellipsis-start" className="w-10 h-10 flex items-center justify-center text-neutral-400">
                        <MoreHorizontal className="w-4 h-4" />
                    </div>
                );
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => onPageChange(i)}
                    className={cn(
                        'w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors',
                        currentPage === i
                            ? 'bg-[#003f87] text-white shadow-sm'
                            : 'text-neutral-600 hover:bg-neutral-100'
                    )}
                >
                    {i}
                </button>
            );
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                pages.push(
                    <div key="ellipsis-end" className="w-10 h-10 flex items-center justify-center text-neutral-400">
                        <MoreHorizontal className="w-4 h-4" />
                    </div>
                );
            }
            pages.push(
                <button
                    key={totalPages}
                    onClick={() => onPageChange(totalPages)}
                    className="w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors text-neutral-600 hover:bg-neutral-100"
                >
                    {totalPages}
                </button>
            );
        }

        return pages;
    };

    return (
        <div className={cn('flex items-center space-x-2', className)}>
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors text-neutral-600 hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Previous Page"
            >
                <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-1">
                {renderPageNumbers()}
            </div>

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors text-neutral-600 hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Next Page"
            >
                <ChevronRight className="w-5 h-5" />
            </button>
        </div>
    );
}
