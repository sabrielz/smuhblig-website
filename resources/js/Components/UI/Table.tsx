import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export interface Column<T = any> {
    key: string;
    label: string;
    render?: (item: T) => ReactNode;
    sortable?: boolean;
    width?: string;
}

export interface TableProps<T = any> {
    columns: Column<T>[];
    data: T[];
    isLoading?: boolean;
    className?: string;
}

export function Table<T = any>({
    columns,
    data,
    isLoading = false,
    className,
}: TableProps<T>) {
    return (
        <div
            className={cn(
                'bg-white rounded-xl border border-neutral-200 overflow-hidden',
                className
            )}
        >
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-neutral-50 border-b border-neutral-200">
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    className="px-6 py-4 text-sm font-semibold text-neutral-700 whitespace-nowrap"
                                    style={{ width: col.width }}
                                >
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <SkeletonTable columns={columns.length} rows={5} />
                        ) : data.length > 0 ? (
                            data.map((item, rowIndex) => (
                                <motion.tr
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        duration: 0.2,
                                        delay: rowIndex * 0.05,
                                    }}
                                    key={rowIndex}
                                    className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors duration-200 last:border-b-0"
                                >
                                    {columns.map((col) => (
                                        <td
                                            key={col.key}
                                            className="px-6 py-4 text-sm text-neutral-600"
                                        >
                                            {col.render
                                                ? col.render(item)
                                                : (item as any)[col.key]}
                                        </td>
                                    ))}
                                </motion.tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="px-6 py-8 text-center text-sm text-neutral-500"
                                >
                                    Tidak ada data.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function SkeletonTable({ columns, rows }: { columns: number; rows: number }) {
    return (
        <>
            {Array.from({ length: rows }).map((_, rowIndex) => (
                <tr
                    key={rowIndex}
                    className="border-b border-neutral-100 last:border-b-0 animate-pulse"
                >
                    {Array.from({ length: columns }).map((_, colIndex) => (
                        <td key={colIndex} className="px-6 py-4">
                            <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
                        </td>
                    ))}
                </tr>
            ))}
        </>
    );
}
