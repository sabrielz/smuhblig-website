import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/UI/Button';
import { cn } from '@/lib/utils';
import {
    ArrowLeft,
    Mail,
    Phone,
    User,
    Calendar,
    Globe,
    Monitor,
    Archive,
    Trash2,
    ExternalLink,
    MessageSquare,
} from 'lucide-react';
import type { PesanKontak } from '@/types';

interface Props {
    pesan: PesanKontak;
}

function StatusBadge({ status }: { status: PesanKontak['status'] }) {
    const variants: Record<PesanKontak['status'], { label: string; className: string }> = {
        baru:     { label: 'Baru',    className: 'bg-blue-100 text-blue-700 border border-blue-200' },
        dibaca:   { label: 'Dibaca',  className: 'bg-neutral-100 text-neutral-600 border border-neutral-200' },
        dibalas:  { label: 'Dibalas', className: 'bg-green-100 text-green-700 border border-green-200' },
        diarsip:  { label: 'Diarsip', className: 'bg-amber-100 text-amber-700 border border-amber-200' },
    };
    const v = variants[status] ?? variants.dibaca;
    return (
        <span className={cn('inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold', v.className)}>
            {v.label}
        </span>
    );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
    return (
        <div className="flex items-start gap-3 py-3 border-b border-neutral-100 last:border-0">
            <div className="w-8 h-8 rounded-lg bg-[#003f87]/8 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-[#003f87]">{icon}</span>
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400 mb-0.5">{label}</p>
                <div className="text-sm text-neutral-800 break-words">{value}</div>
            </div>
        </div>
    );
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('id-ID', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
    });
}

export default function Show({ pesan }: Props) {
    const handleDelete = () => {
        if (!window.confirm('Hapus pesan ini secara permanen?')) return;
        router.delete(`/admin/pesan/${pesan.id}`, {
            onSuccess: () => router.visit('/admin/pesan'),
        });
    };

    const handleArsip = () => {
        router.patch(`/admin/pesan/${pesan.id}/arsip`);
    };

    return (
        <AdminLayout title="Detail Pesan">
            <Head title={`Pesan dari ${pesan.nama}`} />

            {/* Breadcrumb / back */}
            <div className="flex items-center gap-3 mb-6">
                <Link href="/admin/pesan">
                    <Button variant="ghost" size="sm" className="flex items-center gap-2 text-neutral-500 hover:text-neutral-900">
                        <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
                        Kembali
                    </Button>
                </Link>
                <span className="text-neutral-300">/</span>
                <span className="text-sm text-neutral-500">Detail Pesan</span>
            </div>

            {/* Layout 2 kolom */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">

                {/* ===== Kiri: Isi Pesan ===== */}
                <div className="space-y-4">
                    {/* Header */}
                    <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6">
                        <div className="flex flex-wrap items-start gap-3 mb-4">
                            <div className="flex-1 min-w-0">
                                <h1 className="text-xl font-bold text-neutral-900 leading-tight">
                                    {pesan.subjek}
                                </h1>
                                <p className="text-sm text-neutral-500 mt-1">
                                    Dari <span className="font-semibold text-neutral-700">{pesan.nama}</span>
                                    {' '}&lt;{pesan.email}&gt;
                                    {' '}· {formatDate(pesan.created_at)}
                                </p>
                            </div>
                            <StatusBadge status={pesan.status} />
                        </div>

                        {/* Divider */}
                        <div className="h-px bg-neutral-100 mb-5" />

                        {/* Body text */}
                        <div className="prose prose-sm max-w-none text-neutral-800 whitespace-pre-wrap leading-relaxed">
                            {pesan.pesan}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-3">
                        <a
                            href={`mailto:${pesan.email}?subject=Re: ${encodeURIComponent(pesan.subjek)}`}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#003f87] text-white text-sm font-semibold rounded-xl hover:bg-[#002d6b] transition-colors"
                        >
                            <Mail className="w-4 h-4" strokeWidth={1.5} />
                            Balas via Email
                            <ExternalLink className="w-3.5 h-3.5 opacity-70" strokeWidth={1.5} />
                        </a>

                        {pesan.status !== 'diarsip' && (
                            <Button
                                variant="outline"
                                onClick={handleArsip}
                                className="flex items-center gap-2"
                            >
                                <Archive className="w-4 h-4" strokeWidth={1.5} />
                                Arsipkan
                            </Button>
                        )}

                        <Button
                            variant="danger"
                            onClick={handleDelete}
                            className="flex items-center gap-2"
                        >
                            <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                            Hapus
                        </Button>
                    </div>
                </div>

                {/* ===== Kanan: Info Pengirim ===== */}
                <div className="space-y-4">
                    {/* Info Card */}
                    <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5">
                        <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-400 mb-3 flex items-center gap-2">
                            <User className="w-4 h-4" strokeWidth={1.5} />
                            Info Pengirim
                        </h2>

                        <InfoRow
                            icon={<User className="w-4 h-4" strokeWidth={1.5} />}
                            label="Nama"
                            value={<span className="font-semibold">{pesan.nama}</span>}
                        />
                        <InfoRow
                            icon={<Mail className="w-4 h-4" strokeWidth={1.5} />}
                            label="Email"
                            value={
                                <a
                                    href={`mailto:${pesan.email}`}
                                    className="text-[#0050a8] hover:underline"
                                >
                                    {pesan.email}
                                </a>
                            }
                        />
                        {pesan.nomor_telepon && (
                            <InfoRow
                                icon={<Phone className="w-4 h-4" strokeWidth={1.5} />}
                                label="Telepon"
                                value={
                                    <a href={`tel:${pesan.nomor_telepon}`} className="text-[#0050a8] hover:underline">
                                        {pesan.nomor_telepon}
                                    </a>
                                }
                            />
                        )}
                        <InfoRow
                            icon={<Calendar className="w-4 h-4" strokeWidth={1.5} />}
                            label="Dikirim"
                            value={formatDate(pesan.created_at)}
                        />
                        <InfoRow
                            icon={<MessageSquare className="w-4 h-4" strokeWidth={1.5} />}
                            label="Status"
                            value={<StatusBadge status={pesan.status} />}
                        />
                        {pesan.dibaca_at && (
                            <InfoRow
                                icon={<Calendar className="w-4 h-4" strokeWidth={1.5} />}
                                label="Dibaca"
                                value={
                                    <span>
                                        {formatDate(pesan.dibaca_at)}
                                        {pesan.dibaca_oleh && (
                                            <span className="text-neutral-400"> oleh {pesan.dibaca_oleh}</span>
                                        )}
                                    </span>
                                }
                            />
                        )}
                    </div>

                    {/* Meta Card */}
                    <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5">
                        <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-400 mb-3 flex items-center gap-2">
                            <Globe className="w-4 h-4" strokeWidth={1.5} />
                            Metadata
                        </h2>

                        {pesan.ip_address && (
                            <InfoRow
                                icon={<Globe className="w-4 h-4" strokeWidth={1.5} />}
                                label="IP Address"
                                value={<code className="text-xs bg-neutral-100 px-2 py-0.5 rounded">{pesan.ip_address}</code>}
                            />
                        )}
                        {pesan.user_agent && (
                            <InfoRow
                                icon={<Monitor className="w-4 h-4" strokeWidth={1.5} />}
                                label="User Agent"
                                value={<span className="text-xs text-neutral-500 break-all">{pesan.user_agent}</span>}
                            />
                        )}
                    </div>
                </div>

            </div>
        </AdminLayout>
    );
}
