import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Award, Clock, Users } from 'lucide-react';
import { fadeInUp, staggerContainer, slideFromRight } from '@/lib/motion';
import { resolveIcon, type JurusanData } from './JurusanHero';

interface JurusanOverviewProps {
    jurusan: JurusanData;
}

export default function JurusanOverview({ jurusan }: JurusanOverviewProps) {
    const { t } = useTranslation();

    return (
        <section className="py-20 bg-white border-b border-gray-100">
            <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                    <div className="lg:col-span-7 order-2 lg:order-1">
                        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                            <motion.span variants={fadeInUp} className="text-sm font-semibold tracking-widest text-neutral-400 uppercase mb-4 block">
                                {t('jurusan.about_program')}
                            </motion.span>
                            <motion.h2 variants={fadeInUp} className="text-3xl lg:text-4xl font-serif font-bold text-primary-900 mb-8">
                                {t('jurusan.what_is')} {jurusan.nama}?
                            </motion.h2>

                            {jurusan.deskripsi_lengkap ? (
                                <motion.div
                                    variants={fadeInUp}
                                    className="prose prose-lg prose-neutral max-w-none prose-headings:text-primary-900 prose-a:text-gold-500 mb-10"
                                    dangerouslySetInnerHTML={{ __html: jurusan.deskripsi_lengkap }}
                                />
                            ) : (
                                <motion.p variants={fadeInUp} className="text-neutral-600 text-lg leading-relaxed mb-10">
                                    {jurusan.deskripsi_singkat}
                                </motion.p>
                            )}

                            <motion.div variants={staggerContainer} className="flex flex-col sm:flex-row gap-6">
                                {jurusan.akreditasi && (
                                    <motion.div variants={fadeInUp} className="flex items-center gap-4 pl-4 border-l-4" style={{ borderColor: jurusan.color_start }}>
                                        <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-700">
                                            <Award className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-500 font-medium tracking-wide uppercase">Akreditasi</div>
                                            <div className="text-lg font-bold text-gray-900">{jurusan.akreditasi}</div>
                                        </div>
                                    </motion.div>
                                )}
                                {jurusan.lama_pendidikan && (
                                    <motion.div variants={fadeInUp} className="flex items-center gap-4 pl-4 border-l-4" style={{ borderColor: jurusan.color_start }}>
                                        <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-700">
                                            <Clock className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-500 font-medium tracking-wide uppercase">Lama Pendidikan</div>
                                            <div className="text-lg font-bold text-gray-900">{jurusan.lama_pendidikan}</div>
                                        </div>
                                    </motion.div>
                                )}
                                {jurusan.total_siswa > 0 && (
                                    <motion.div variants={fadeInUp} className="flex items-center gap-4 pl-4 border-l-4" style={{ borderColor: jurusan.color_start }}>
                                        <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-700">
                                            <Users className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-500 font-medium tracking-wide uppercase">Total Siswa</div>
                                            <div className="text-lg font-bold text-gray-900">{jurusan.total_siswa} <span className="text-sm font-normal text-gray-500">Siswa Aktif</span></div>
                                        </div>
                                    </motion.div>
                                )}
                            </motion.div>
                        </motion.div>
                    </div>

                    <div className="lg:col-span-5 order-1 lg:order-2">
                        <motion.div
                            variants={slideFromRight}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="relative rounded-2xl overflow-hidden aspect-[4/5] shadow-2xl"
                        >
                            {jurusan.cover_image ? (
                                <img src={jurusan.cover_image} alt={jurusan.nama} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center" style={{ background: `linear-gradient(-45deg, ${jurusan.color_start}, ${jurusan.color_end})` }}>
                                    {resolveIcon(jurusan.icon_name, 120, "text-white/20")}
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
