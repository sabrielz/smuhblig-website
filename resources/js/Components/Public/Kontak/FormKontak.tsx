import React from 'react';
import { usePage, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    MessageSquare,
    Mail,
    PhoneCall,
    CheckCircle,
    AlertCircle,
    User,
    FileText,
    Send,
} from 'lucide-react';
import { slideFromLeft, fadeInUp, scaleIn } from '@/lib/motion';
import { cn } from '@/lib/utils';
import type { SharedProps } from '@/types';

interface FormData {
    nama: string;
    email: string;
    nomor_telepon: string;
    subjek: string;
    pesan: string;
    website: string; // honeypot
}

const inputClass = cn(
    'w-full px-4 py-3 text-sm rounded-xl border border-neutral-100',
    'bg-white text-neutral-900 placeholder-neutral-300',
    'outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-600/15',
    'transition-all duration-200',
);

const labelClass = 'block text-xs font-bold uppercase tracking-wide text-neutral-500 mb-2';

const FieldError = ({ message }: { message?: string }) =>
    message ? (
        <p className="flex items-center gap-1.5 mt-2 text-xs text-red-600 font-medium">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" strokeWidth={2} />
            {message}
        </p>
    ) : null;

export function FormKontak() {
    const { props } = usePage<SharedProps>();
    const flash = props.flash;
    const isSuccess = !!flash?.success;

    const { data, setData, post, processing, errors, reset } = useForm<FormData>({
        nama: '',
        email: '',
        nomor_telepon: '',
        subjek: '',
        pesan: '',
        website: '', // honeypot — must stay empty
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/kontak/kirim', {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    const pesanLength = data.pesan.length;
    const rateLimitError = (errors as Record<string, string>).rate_limit;

    return (
        <section className="py-20 lg:py-28 bg-white border-t border-neutral-100">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
                    {/* Left — Intro text */}
                    <motion.div
                        variants={slideFromLeft}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        <p className="text-xs font-bold tracking-[0.2em] uppercase text-gold-500 mb-3">
                            FORMULIR KONTAK
                        </p>
                        <h2 className="font-serif text-3xl lg:text-4xl font-bold text-primary-600 mb-6 leading-tight">
                            Kirim <span className="text-gold-500">Pesan</span>
                        </h2>
                        <p className="text-neutral-500 text-base leading-relaxed mb-8">
                            Punya pertanyaan seputar PPDB, jurusan, fasilitas, atau kerjasama?
                            Tim kami siap membantu. Isi formulir ini dan kami akan merespons
                            secepatnya.
                        </p>

                        {/* Info Tips */}
                        <div className="space-y-3">
                            {[
                                { icon: <MessageSquare size={16} strokeWidth={1.5} />, text: 'Pesan akan dibalas dalam 1×24 jam kerja.' },
                                { icon: <Mail size={16} strokeWidth={1.5} />, text: 'Pastikan alamat email Anda aktif untuk menerima balasan.' },
                                { icon: <PhoneCall size={16} strokeWidth={1.5} />, text: 'Untuk urusan mendesak, hubungi langsung via telepon.' },
                            ].map((tip, i) => (
                                <div key={i} className="flex items-start gap-3 text-sm text-neutral-500">
                                    <div className="w-7 h-7 rounded-lg bg-primary-600/8 flex items-center justify-center shrink-0 text-primary-600 mt-0.5">
                                        {tip.icon}
                                    </div>
                                    {tip.text}
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right — Form */}
                    <motion.div
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        {/* Success state */}
                        {isSuccess ? (
                            <motion.div
                                variants={scaleIn}
                                initial="hidden"
                                animate="visible"
                                className="flex flex-col items-center justify-center text-center py-16 px-8 bg-neutral-50 rounded-3xl border border-neutral-100"
                            >
                                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-5">
                                    <CheckCircle size={32} strokeWidth={1.5} className="text-green-600" />
                                </div>
                                <h3 className="font-serif text-2xl font-bold text-primary-600 mb-3">
                                    Pesan Terkirim!
                                </h3>
                                <p className="text-neutral-500 text-sm leading-relaxed max-w-sm">
                                    {flash.success}{' '}
                                    Tim kami akan segera menghubungi Anda melalui email yang terdaftar.
                                </p>
                            </motion.div>
                        ) : (
                            <form
                                onSubmit={handleSubmit}
                                noValidate
                                className="bg-neutral-50 rounded-3xl border border-neutral-100 p-6 sm:p-8 space-y-5"
                            >
                                {/* Rate limit error global */}
                                {rateLimitError && (
                                    <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" strokeWidth={1.5} />
                                        <p className="font-medium">{rateLimitError}</p>
                                    </div>
                                )}

                                {/* Row 1: Nama + Email */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label htmlFor="kontak-nama" className={labelClass}>
                                            Nama Lengkap <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <User
                                                size={15}
                                                strokeWidth={1.5}
                                                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-300"
                                            />
                                            <input
                                                id="kontak-nama"
                                                name="nama"
                                                type="text"
                                                value={data.nama}
                                                onChange={e => setData('nama', e.target.value)}
                                                placeholder="Nama Anda"
                                                autoComplete="name"
                                                className={cn(inputClass, 'pl-10', errors.nama && 'border-red-400 focus:ring-red-400/20')}
                                            />
                                        </div>
                                        <FieldError message={errors.nama} />
                                    </div>

                                    <div>
                                        <label htmlFor="kontak-email" className={labelClass}>
                                            Email <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <Mail
                                                size={15}
                                                strokeWidth={1.5}
                                                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-300"
                                            />
                                            <input
                                                id="kontak-email"
                                                name="email"
                                                type="email"
                                                value={data.email}
                                                onChange={e => setData('email', e.target.value)}
                                                placeholder="email@domain.com"
                                                autoComplete="email"
                                                className={cn(inputClass, 'pl-10', errors.email && 'border-red-400 focus:ring-red-400/20')}
                                            />
                                        </div>
                                        <FieldError message={errors.email} />
                                    </div>
                                </div>

                                {/* Row 2: Telepon + Subjek */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label htmlFor="kontak-telepon" className={labelClass}>
                                            Nomor Telepon
                                            <span className="normal-case font-normal tracking-normal ml-1 text-neutral-300">(opsional)</span>
                                        </label>
                                        <div className="relative">
                                            <PhoneCall
                                                size={15}
                                                strokeWidth={1.5}
                                                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-300"
                                            />
                                            <input
                                                id="kontak-telepon"
                                                name="nomor_telepon"
                                                type="tel"
                                                value={data.nomor_telepon}
                                                onChange={e => setData('nomor_telepon', e.target.value)}
                                                placeholder="08xx-xxxx-xxxx"
                                                autoComplete="tel"
                                                className={cn(inputClass, 'pl-10', errors.nomor_telepon && 'border-red-400 focus:ring-red-400/20')}
                                            />
                                        </div>
                                        <FieldError message={errors.nomor_telepon} />
                                    </div>

                                    <div>
                                        <label htmlFor="kontak-subjek" className={labelClass}>
                                            Subjek <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <FileText
                                                size={15}
                                                strokeWidth={1.5}
                                                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-300"
                                            />
                                            <input
                                                id="kontak-subjek"
                                                name="subjek"
                                                type="text"
                                                value={data.subjek}
                                                onChange={e => setData('subjek', e.target.value)}
                                                placeholder="Topik pesan Anda"
                                                className={cn(inputClass, 'pl-10', errors.subjek && 'border-red-400 focus:ring-red-400/20')}
                                            />
                                        </div>
                                        <FieldError message={errors.subjek} />
                                    </div>
                                </div>

                                {/* Pesan */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label htmlFor="kontak-pesan" className={cn(labelClass, 'mb-0')}>
                                            Pesan <span className="text-red-500">*</span>
                                        </label>
                                        <span className={cn(
                                            'text-xs font-medium',
                                            pesanLength > 4500 ? 'text-red-500' : 'text-neutral-300',
                                        )}>
                                            {pesanLength.toLocaleString('id-ID')}/5.000
                                        </span>
                                    </div>
                                    <textarea
                                        id="kontak-pesan"
                                        name="pesan"
                                        rows={6}
                                        value={data.pesan}
                                        onChange={e => setData('pesan', e.target.value)}
                                        placeholder="Tulis pesan Anda di sini..."
                                        maxLength={5000}
                                        className={cn(
                                            inputClass,
                                            'resize-none',
                                            errors.pesan && 'border-red-400 focus:ring-red-400/20',
                                        )}
                                    />
                                    <FieldError message={errors.pesan} />
                                </div>

                                {/* Honeypot — hidden dari user, tapi bot akan mengisinya */}
                                <input
                                    name="website"
                                    type="text"
                                    value={data.website}
                                    onChange={e => setData('website', e.target.value)}
                                    className="hidden"
                                    tabIndex={-1}
                                    autoComplete="off"
                                    aria-hidden="true"
                                />

                                {/* Submit */}
                                <button
                                    id="kontak-submit"
                                    type="submit"
                                    disabled={processing}
                                    className={cn(
                                        'w-full sm:w-auto flex items-center justify-center gap-2.5',
                                        'px-8 py-4 rounded-xl',
                                        'bg-gold-500 text-white text-sm font-bold',
                                        'hover:bg-gold-600 transition-all duration-200',
                                        'focus:outline-none focus:ring-2 focus:ring-gold-500/50',
                                        'disabled:opacity-60 disabled:cursor-not-allowed',
                                        'shadow-md hover:shadow-lg',
                                    )}
                                >
                                    {processing ? (
                                        <>
                                            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                            </svg>
                                            Mengirim...
                                        </>
                                    ) : (
                                        <>
                                            <Send size={16} strokeWidth={1.5} />
                                            Kirim Pesan
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

export default FormKontak;
