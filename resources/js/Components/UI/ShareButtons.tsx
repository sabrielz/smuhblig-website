import React, { useState } from 'react';
import { Share2, MessageCircle, Facebook, Link as LinkIcon, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export interface ShareButtonsProps {
    url?: string;
    title: string;
    className?: string;
}

export function ShareButtons({ url, title, className = '' }: ShareButtonsProps) {
    const [copied, setCopied] = useState(false);

    const shareUrl = typeof window !== 'undefined'
        ? (url || window.location.href)
        : (url || '');

    const handleCopy = async () => {
        try {
            if (navigator?.clipboard?.writeText) {
                await navigator.clipboard.writeText(shareUrl);
            } else {
                // Fallback select
                const textarea = document.createElement('textarea');
                textarea.value = shareUrl;
                textarea.style.position = 'fixed';
                textarea.style.opacity = '0';
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
            }
            setCopied(true);
            toast.success('Tautan berhasil disalin!');
            setTimeout(() => setCopied(false), 2000);
        } catch {
            toast.error('Gagal menyalin tautan');
        }
    };

    const handleWhatsApp = () => {
        const text = encodeURIComponent(`${title}\n${shareUrl}`);
        window.open(`https://wa.me/?text=${text}`, '_blank', 'noopener,noreferrer');
    };

    const handleFacebook = () => {
        const encodedUrl = encodeURIComponent(shareUrl);
        window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
            '_blank',
            'noopener,noreferrer'
        );
    };

    return (
        <div className={className}>
            <h3 className="font-semibold text-lg mb-4 flex items-center text-neutral-900">
                <Share2 className="w-5 h-5 mr-2 text-primary-600" />
                Bagikan Artikel
            </h3>
            <div className="flex flex-wrap gap-2 sm:gap-3">
                <button
                    type="button"
                    onClick={handleCopy}
                    className="flex-1 sm:flex-none justify-center inline-flex items-center px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-full text-xs sm:text-sm font-medium transition-colors min-h-11 cursor-pointer"
                >
                    {copied ? (
                        <>
                            <Check className="w-4 h-4 mr-1 sm:mr-2 text-emerald-600" />
                            <span className="text-emerald-700 font-semibold">Tersalin!</span>
                        </>
                    ) : (
                        <>
                            <LinkIcon className="w-4 h-4 mr-1 sm:mr-2" />
                            Salin <span className="hidden sm:inline">&nbsp;Tautan</span>
                        </>
                    )}
                </button>

                <button
                    type="button"
                    onClick={handleWhatsApp}
                    className="flex-1 sm:flex-none justify-center inline-flex items-center px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-full text-xs sm:text-sm font-medium transition-colors min-h-11 cursor-pointer"
                >
                    <MessageCircle className="w-4 h-4 mr-1 sm:mr-2" />
                    WhatsApp
                </button>

                <button
                    type="button"
                    onClick={handleFacebook}
                    className="flex-1 sm:flex-none justify-center inline-flex items-center px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-full text-xs sm:text-sm font-medium transition-colors min-h-11 cursor-pointer"
                >
                    <Facebook className="w-4 h-4 mr-1 sm:mr-2" />
                    Facebook
                </button>
            </div>
        </div>
    );
}

export default ShareButtons;
