import React from 'react';
import { ExternalLink, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface MitraItem {
    id: number;
    nama: string;
    bidang?: string;
    url?: string | null;
    logo_url?: string | null;
}

interface Props {
    items: MitraItem[];
    className?: string;
}

export function MitraStrip({ items, className }: Props) {
    if (!items || items.length === 0) return null;

    return (
        <div className={cn('w-full', className)}>
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 lg:gap-10">
                {items.map((item) => {
                    const content = (
                        <div
                            key={item.id}
                            className="group relative flex items-center justify-center p-3 sm:p-4 rounded-xl bg-white border border-neutral-200/80 shadow-2xs hover:shadow-md hover:border-primary-200 transition-all duration-300 w-36 sm:w-44 h-20 sm:h-24"
                        >
                            {item.logo_url ? (
                                <img
                                    src={item.logo_url}
                                    alt={item.nama}
                                    className="max-h-12 sm:max-h-14 max-w-full object-contain filter grayscale group-hover:grayscale-0 opacity-70 group-hover:opacity-100 transition-all duration-300"
                                    loading="lazy"
                                />
                            ) : (
                                <div className="flex items-center gap-2 text-neutral-500 group-hover:text-primary-600 transition-colors">
                                    <Building2 className="w-5 h-5 shrink-0" />
                                    <span className="text-xs font-semibold truncate text-center">
                                        {item.nama}
                                    </span>
                                </div>
                            )}

                            {item.url && (
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ExternalLink className="w-3.5 h-3.5 text-neutral-400 group-hover:text-primary-600" />
                                </div>
                            )}
                        </div>
                    );

                    if (item.url) {
                        return (
                            <a
                                key={item.id}
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                title={`Kunjungi website resmi ${item.nama}`}
                                className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-xl"
                            >
                                {content}
                            </a>
                        );
                    }

                    return <div key={item.id}>{content}</div>;
                })}
            </div>
        </div>
    );
}

export default MitraStrip;
