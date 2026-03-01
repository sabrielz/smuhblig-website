import { Head, usePage } from '@inertiajs/react';
import type { SharedProps } from '@/types';

export default function Beranda() {
    const { pengaturan, locale } = usePage<SharedProps>().props;

    return (
        <>
            <Head title="Beranda" />
            <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-900 to-primary-600">
                <div className="text-center text-white px-6">
                    <p className="text-sm font-semibold tracking-widest uppercase text-gold-400 mb-4">
                        {pengaturan.site_name}
                    </p>
                    <h1 className="font-serif text-display-xl font-bold mb-6">
                        {pengaturan.site_tagline}
                    </h1>
                    <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
                        {locale === 'id'
                            ? 'Website sedang dalam tahap pengembangan. Segera hadir dengan tampilan baru.'
                            : 'Website is under development. Coming soon with a new look.'}
                    </p>
                    <div className="flex items-center justify-center gap-3">
                        <span className="inline-block h-2 w-2 rounded-full bg-gold-500 animate-pulse" />
                        <span className="text-sm text-white/50">FASE 0 — Setup Complete</span>
                    </div>
                </div>
            </main>
        </>
    );
}
