import React from 'react';
import { motion } from 'framer-motion';
import {
    MapPin,
    Phone,
    Mail,
    Clock,
    Instagram,
    Youtube,
    Facebook,
    Music2,
    ExternalLink,
} from 'lucide-react';
import { slideFromLeft, slideFromRight } from '@/lib/motion';
import type { Pengaturan } from '@/types';

interface InfoItemProps {
    icon: React.ReactNode;
    label: string;
    value: React.ReactNode;
}

const InfoItem = ({ icon, label, value }: InfoItemProps) => (
    <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary-600/10 border border-primary-600/15 flex items-center justify-center">
            {icon}
        </div>
        <div>
            <p className="text-xs font-bold tracking-wide uppercase text-gold-500 mb-1">{label}</p>
            <div className="text-neutral-600 text-sm leading-relaxed">{value}</div>
        </div>
    </div>
);

interface SosmedLinkProps {
    href?: string | null;
    icon: React.ReactNode;
    label: string;
}

const SosmedLink = ({ href, icon, label }: SosmedLinkProps) => {
    if (!href) return null;
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="w-10 h-10 rounded-xl bg-primary-600/10 border border-primary-600/15 flex items-center justify-center text-primary-600 hover:bg-primary-600 hover:text-white hover:border-primary-600 transition-all duration-200"
        >
            {icon}
        </a>
    );
};

export interface InfoDanPetaProps {
    pengaturan: Pengaturan;
    kontenInfo?: Record<string, string>;
}

export function InfoDanPeta({ pengaturan, kontenInfo }: InfoDanPetaProps) {
    return (
        <section className="py-20 lg:py-28 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
                    {/* Left — Info kontak */}
                    <motion.div
                        variants={slideFromLeft}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="order-2 lg:order-1"
                    >
                        <p className="text-xs font-bold tracking-[0.2em] uppercase text-gold-500 mb-3">
                            INFORMASI KONTAK
                        </p>
                        <h2 className="font-serif text-3xl lg:text-4xl font-bold text-primary-600 mb-8 leading-tight">
                            Temukan &amp; Hubungi Kami
                        </h2>

                        <div className="space-y-6 mb-10">
                            <InfoItem
                                icon={<MapPin size={18} strokeWidth={1.5} className="text-primary-600" />}
                                label="Alamat"
                                value={
                                    <p>
                                        {pengaturan.site_address || 'Jl. Raya Bligo, Kec. Bligo, Kab. Batang, Jawa Tengah 51261'}
                                    </p>
                                }
                            />
                            <InfoItem
                                icon={<Phone size={18} strokeWidth={1.5} className="text-primary-600" />}
                                label="Telepon"
                                value={
                                    <a
                                        href={`tel:${pengaturan.site_phone}`}
                                        className="hover:text-primary-600 transition-colors"
                                    >
                                        {pengaturan.site_phone || '+62 285 xxxxxxx'}
                                    </a>
                                }
                            />
                            <InfoItem
                                icon={<Mail size={18} strokeWidth={1.5} className="text-primary-600" />}
                                label="Email"
                                value={
                                    <a
                                        href={`mailto:${pengaturan.site_email}`}
                                        className="hover:text-primary-600 transition-colors"
                                    >
                                        {pengaturan.site_email || 'info@smkmuhbligo.sch.id'}
                                    </a>
                                }
                            />
                            <InfoItem
                                icon={<Clock size={18} strokeWidth={1.5} className="text-primary-600" />}
                                label="Jam Operasional"
                                value={
                                    kontenInfo?.jam_operasional ? (
                                        <div className="whitespace-pre-line text-neutral-600 text-sm leading-relaxed">
                                            {kontenInfo.jam_operasional}
                                        </div>
                                    ) : (
                                        <div className="space-y-0.5">
                                            <p>Senin – Jumat: 07.00 – 15.30 WIB</p>
                                            <p>Sabtu: 07.00 – 12.00 WIB</p>
                                            <p className="text-neutral-400">Minggu & Hari Libur: Tutup</p>
                                        </div>
                                    )
                                }
                            />
                        </div>

                        {/* Sosmed Links */}
                        <div>
                            <p className="text-xs font-bold tracking-wide uppercase text-neutral-500 mb-3">
                                Media Sosial
                            </p>
                            <div className="flex items-center gap-3">
                                <SosmedLink
                                    href={pengaturan.sosial_instagram}
                                    icon={<Instagram size={18} strokeWidth={1.5} />}
                                    label="Instagram"
                                />
                                <SosmedLink
                                    href={pengaturan.sosial_youtube}
                                    icon={<Youtube size={18} strokeWidth={1.5} />}
                                    label="YouTube"
                                />
                                <SosmedLink
                                    href={pengaturan.sosial_facebook}
                                    icon={<Facebook size={18} strokeWidth={1.5} />}
                                    label="Facebook"
                                />
                                <SosmedLink
                                    href={pengaturan.sosial_tiktok}
                                    icon={<Music2 size={18} strokeWidth={1.5} />}
                                    label="TikTok"
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Right — Google Maps embed */}
                    <motion.div
                        variants={slideFromRight}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="relative order-1 lg:order-2 rounded-3xl overflow-hidden shadow-2xl aspect-video bg-neutral-50 border border-neutral-100"
                    >
                        {kontenInfo?.maps_embed_url ? (
                            <iframe
                                id="google-maps-embed"
                                title="Lokasi SMK Muhammadiyah Bligo"
                                src={kontenInfo.maps_embed_url}
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="w-full h-full"
                            />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-50 border border-neutral-100 min-h-[300px]">
                                <MapPin size={48} strokeWidth={1.5} className="text-primary-600 mb-4 opacity-50" />
                                <p className="text-neutral-500 text-center px-4 mb-4">Peta belum dikonfigurasi</p>
                                <a
                                    href={`https://maps.google.com/?q=${encodeURIComponent(pengaturan?.site_address || 'SMK Muhammadiyah Bligo')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:underline"
                                >
                                    Buka di Google Maps
                                    <ExternalLink size={14} />
                                </a>
                            </div>
                        )}

                        {/* Overlay badge */}
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2 shadow-md flex items-center gap-2">
                            <MapPin size={14} strokeWidth={1.5} className="text-primary-600" />
                            <span className="text-xs font-semibold text-primary-600">Bligo, Batang, Jawa Tengah</span>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

export default InfoDanPeta;
