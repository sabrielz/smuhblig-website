import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Briefcase, CheckCircle2 } from 'lucide-react';
import { fadeInUp, staggerContainer, scaleIn } from '@/lib/motion';
import { cn } from '@/lib/utils';
import type { JurusanData } from './JurusanHero';

function EmptyState({ title, className = '' }: { title: string; className?: string }) {
    return (
        <div className={cn("p-8 rounded-xl border-2 border-dashed border-gray-200 text-center flex flex-col items-center justify-center min-h-[150px]", className)}>
            <p className="text-gray-400 font-medium">{title}</p>
        </div>
    );
}

interface JurusanFeaturesProps {
    jurusan: JurusanData;
}

export default function JurusanFeatures({ jurusan }: JurusanFeaturesProps) {
    const { t } = useTranslation();

    return (
        <>
            {/* --- SECTION 3: KOMPETENSI --- */}
            <section className="py-20 bg-neutral-50">
                <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
                    <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-12">
                        <span className="text-sm font-semibold tracking-widest text-gold-500 uppercase mb-4 block">
                            {t('jurusan.competencies_badge')}
                        </span>
                        <h2 className="text-3xl lg:text-4xl font-serif font-bold text-primary-900">
                            {t('jurusan.competencies_heading')}
                        </h2>
                    </motion.div>

                    {jurusan.kompetensi?.length > 0 ? (
                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                        >
                            {jurusan.kompetensi.map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    variants={fadeInUp}
                                    transition={{ duration: 0.3 }}
                                    className="bg-transparent hover:bg-white border-b border-gray-200 hover:border-transparent rounded-xl px-5 py-6 hover:shadow-lg transition-all duration-300 flex items-start gap-4"
                                >
                                    <span className="font-mono text-xs opacity-40 font-bold block pt-1" style={{ color: jurusan.color_start }}>
                                        {(idx + 1).toString().padStart(2, '0')}
                                    </span>
                                    <p className="font-medium text-neutral-800 text-base leading-relaxed">{item}</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <EmptyState title={t('jurusan.competencies_empty')} />
                    )}
                </div>
            </section>

            {/* --- SECTION 4: PROSPEK KARIR --- */}
            <section className="py-24 relative overflow-hidden" style={{ backgroundColor: jurusan.color_start || 'var(--color-primary-900)' }}>
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="container mx-auto px-4 lg:px-8 max-w-7xl relative z-10">
                    <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-12">
                        <span className="text-sm font-semibold tracking-widest text-white/50 uppercase mb-4 block">
                            {t('jurusan.careers_badge')}
                        </span>
                        <h2 className="text-3xl lg:text-4xl font-serif font-bold text-white">
                            {t('jurusan.careers_heading')}
                        </h2>
                    </motion.div>

                    {jurusan.prospek_karir?.length > 0 ? (
                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
                        >
                            {jurusan.prospek_karir.map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    variants={scaleIn}
                                    className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl px-6 py-5 border border-white/5 transition-all duration-300 flex items-center gap-4"
                                >
                                    <div className="w-10 h-10 rounded-full bg-gold-500/20 text-gold-500 flex items-center justify-center shrink-0">
                                        <Briefcase className="w-5 h-5" />
                                    </div>
                                    <p className="font-semibold text-white leading-tight">{item}</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <EmptyState title={t('jurusan.careers_empty')} className="border-white/20 text-white/50" />
                    )}
                </div>
            </section>

            {/* --- SECTION 5: FASILITAS --- */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
                    <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-12">
                        <span className="text-sm font-semibold tracking-widest text-gold-500 uppercase mb-4 block">
                            {t('jurusan.facilities_badge')}
                        </span>
                        <h2 className="text-3xl lg:text-4xl font-serif font-bold text-primary-900">
                            {t('jurusan.facilities_heading')}
                        </h2>
                    </motion.div>

                    {jurusan.fasilitas?.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-8">
                            {jurusan.fasilitas.map((item, idx) => (
                                <div key={idx} className="flex items-start gap-4 p-4 lg:p-5 rounded-2xl bg-gray-50 border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all">
                                    <div className="shrink-0 mt-0.5">
                                        <CheckCircle2 className="w-5 h-5" style={{ color: jurusan.color_start }} />
                                    </div>
                                    <p className="text-gray-800 font-medium leading-relaxed">{item}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <EmptyState title={t('jurusan.facilities_empty')} />
                    )}
                </div>
            </section>
        </>
    );
}
