import { motion } from 'framer-motion';
import { FileDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './Button';

interface EmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    description: string;
    action?: {
        label: string;
        onClick: () => void;
    };
    className?: string;
}

export function EmptyState({
    icon,
    title,
    description,
    action,
    className
}: EmptyStateProps) {
    return (
        <div className={cn("flex flex-col items-center justify-center p-12 text-center", className)}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="w-20 h-20 bg-neutral-50 rounded-2xl flex items-center justify-center mb-6 border border-neutral-100 shadow-sm"
            >
                {icon || <FileDown className="w-10 h-10 text-neutral-400" strokeWidth={1.5} />}
            </motion.div>

            <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
                className="text-lg font-semibold text-neutral-900 mb-2"
            >
                {title}
            </motion.h3>

            <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' }}
                className="text-sm text-neutral-500 max-w-sm mb-6 leading-relaxed"
            >
                {description}
            </motion.p>

            {action && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
                >
                    <Button onClick={action.onClick} variant="primary" size="sm">
                        {action.label}
                    </Button>
                </motion.div>
            )}
        </div>
    );
}
