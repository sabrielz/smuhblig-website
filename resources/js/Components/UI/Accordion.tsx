import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AccordionItem {
    id: string | number;
    title: string;
    content: string; // HTML string or plain text
}

export interface AccordionProps {
    items: AccordionItem[];
    allowMultiple?: boolean;
    defaultOpenId?: string | number | null;
    className?: string;
}

export function Accordion({
    items,
    allowMultiple = false,
    defaultOpenId = null,
    className,
}: AccordionProps) {
    const [openIds, setOpenIds] = useState<(string | number)[]>(
        defaultOpenId !== null ? [defaultOpenId] : []
    );

    const toggleItem = (id: string | number) => {
        if (allowMultiple) {
            setOpenIds((prev) =>
                prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
            );
        } else {
            setOpenIds((prev) => (prev.includes(id) ? [] : [id]));
        }
    };

    return (
        <div className={cn('space-y-3', className)}>
            {items.map((item) => {
                const isOpen = openIds.includes(item.id);
                const buttonId = `accordion-button-${item.id}`;
                const panelId = `accordion-panel-${item.id}`;

                return (
                    <div
                        key={item.id}
                        className={cn(
                            'border rounded-2xl transition-all duration-200 overflow-hidden',
                            isOpen
                                ? 'bg-white border-primary-300 shadow-sm'
                                : 'bg-white border-neutral-200/80 hover:border-neutral-300'
                        )}
                    >
                        <h3>
                            <button
                                type="button"
                                id={buttonId}
                                aria-expanded={isOpen}
                                aria-controls={panelId}
                                onClick={() => toggleItem(item.id)}
                                className="w-full flex items-center justify-between text-left p-4 sm:p-5 text-neutral-900 font-semibold text-sm sm:text-base gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-2xl"
                            >
                                <span className={cn('transition-colors', isOpen && 'text-primary-600')}>
                                    {item.title}
                                </span>
                                <div
                                    className={cn(
                                        'w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200',
                                        isOpen ? 'bg-primary-50 text-primary-600 rotate-180' : 'bg-neutral-100 text-neutral-500'
                                    )}
                                >
                                    <ChevronDown className="w-4 h-4" />
                                </div>
                            </button>
                        </h3>

                        <AnimatePresence initial={false}>
                            {isOpen && (
                                <motion.div
                                    id={panelId}
                                    role="region"
                                    aria-labelledby={buttonId}
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                                >
                                    <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-neutral-600 leading-relaxed border-t border-neutral-100">
                                        <div
                                            className="prose prose-sm max-w-none text-neutral-600"
                                            dangerouslySetInnerHTML={{ __html: item.content }}
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                );
            })}
        </div>
    );
}

export default Accordion;
