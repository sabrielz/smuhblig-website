import { Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { JurusanCard } from '@/Components/UI/JurusanCard';
import { MitraStrip } from '@/Components/UI/MitraStrip';
import type { JurusanData } from './JurusanHero';

interface JurusanOthersProps {
    jurusan: JurusanData;
    jurusanLain: JurusanData[];
    spmbUrl: string;
}

export default function JurusanOthers({ jurusan, jurusanLain, spmbUrl }: JurusanOthersProps) {
    const { t } = useTranslation();

    return (
        <>
            {/* MITRA INDUSTRI JURUSAN */}
            {jurusan.mitras && jurusan.mitras.length > 0 && (
                <section className="py-20 bg-neutral-50/70 border-t border-neutral-200/60">
                    <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
                        <div className="text-center max-w-2xl mx-auto mb-12">
                            <span className="text-xs font-mono tracking-widest uppercase text-primary-600 block mb-2">
                                {t('jurusan.partners_badge')}
                            </span>
                            <h2 className="text-2xl lg:text-3xl font-serif font-bold text-neutral-900">
                                {t('jurusan.partners_heading')} {jurusan.kode}
                            </h2>
                            <p className="text-neutral-500 text-sm mt-3">
                                {t('jurusan.partners_desc')}
                            </p>
                        </div>

                        <MitraStrip items={jurusan.mitras} />
                    </div>
                </section>
            )}

            {/* JURUSAN LAIN + CTA */}
            <section className="pt-20">
                <div className="container mx-auto px-4 lg:px-8 max-w-7xl mb-24">
                    <div className="flex justify-between items-end mb-10">
                        <div>
                            <h2 className="text-2xl lg:text-3xl font-serif font-bold text-primary-900">
                                {t('jurusan.other_programs_heading')}
                            </h2>
                        </div>
                    </div>

                    <div className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory">
                        {jurusanLain.map(other => (
                            <div key={other.id} className="min-w-[280px] sm:min-w-[320px] max-w-[350px] snap-start shrink-0">
                                <JurusanCard jurusan={other as any} className="h-full" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Final CTA Banner */}
                <div
                    className="py-24 relative overflow-hidden"
                    style={{ background: `linear-gradient(135deg, ${jurusan.color_start}, var(--color-primary-900))` }}
                >
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
                    <div className="container mx-auto px-4 lg:px-8 max-w-4xl text-center relative z-10">
                        <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6 leading-tight">
                            {t('jurusan.cta_ready')} <br className="hidden md:block"/>{jurusan.nama}?
                        </h2>
                        <p className="text-white/80 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
                            {t('jurusan.cta_ready_desc')}
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <a
                                href={spmbUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="w-full sm:w-auto px-8 py-4 bg-gold-500 hover:bg-gold-600 text-white text-lg font-bold rounded-xl shadow-xl transition-all hover:-translate-y-1"
                            >
                                {t('jurusan.register_now')}
                            </a>
                            <Link
                                href="/kontak"
                                className="w-full sm:w-auto px-8 py-4 border-2 border-white/30 hover:bg-white/10 text-white text-lg font-bold rounded-xl transition-all"
                            >
                                {t('jurusan.contact_us')}
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
