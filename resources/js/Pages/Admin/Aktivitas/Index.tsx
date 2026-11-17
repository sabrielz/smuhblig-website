import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/UI/Button';
import { Input } from '@/Components/UI/Input';
import { Select } from '@/Components/UI/Select';
import { Pagination } from '@/Components/UI/Pagination';
import {
    Activity as ActivityIcon,
    Search,
    User as UserIcon,
    Calendar,
    Clock,
    FileText,
    Shield,
    Database,
    Tag,
} from 'lucide-react';
import type { PaginatedData } from '@/types';

interface ActivityItem {
    id: number;
    log_name: string;
    description: string;
    event: string | null;
    subject_type: string | null;
    subject_id: number | null;
    causer: {
        id: number;
        name: string;
        email: string;
    } | null;
    properties: Record<string, any>;
    created_at: string;
    human_time: string;
}

interface UserOption {
    id: number;
    name: string;
    email: string;
}

interface AktivitasIndexProps {
    activities: PaginatedData<ActivityItem>;
    users: UserOption[];
    log_names: string[];
    filters: {
        user_id: string;
        log_name: string;
        event: string;
        date_from: string;
        date_to: string;
    };
}

export default function AktivitasIndex({
    activities,
    users,
    log_names,
    filters,
}: AktivitasIndexProps) {
    const [userId, setUserId] = useState(filters.user_id || '');
    const [logName, setLogName] = useState(filters.log_name || '');
    const [event, setEvent] = useState(filters.event || '');
    const [dateFrom, setDateFrom] = useState(filters.date_from || '');
    const [dateTo, setDateTo] = useState(filters.date_to || '');

    const handleFilterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            '/admin/aktivitas',
            {
                user_id: userId || undefined,
                log_name: logName || undefined,
                event: event || undefined,
                date_from: dateFrom || undefined,
                date_to: dateTo || undefined,
            },
            { preserveState: true }
        );
    };

    const handleReset = () => {
        setUserId('');
        setLogName('');
        setEvent('');
        setDateFrom('');
        setDateTo('');
        router.get('/admin/aktivitas');
    };

    const getEventBadge = (evt: string | null) => {
        switch (evt) {
            case 'created':
                return (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                        Dibuat
                    </span>
                );
            case 'updated':
                return (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-100 text-blue-800">
                        Diperbarui
                    </span>
                );
            case 'deleted':
                return (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-red-100 text-red-800">
                        Dihapus
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-neutral-100 text-neutral-800">
                        {evt || 'Aksi'}
                    </span>
                );
        }
    };

    return (
        <AdminLayout title="Log Aktivitas">
            <Head title="Log Aktivitas — Admin CMS" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
                            Log Aktivitas (Audit Trail)
                        </h1>
                        <p className="text-sm text-neutral-500 mt-1">
                            Riwayat perubahan data konten dan aktivitas autentikasi operator (Retensi 180 hari).
                        </p>
                    </div>
                </div>

                {/* Filter Panel */}
                <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs">
                    <form onSubmit={handleFilterSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                            <div>
                                <label className="block text-xs font-semibold text-neutral-600 mb-1">
                                    Operator
                                </label>
                                <Select
                                    value={userId}
                                    onChange={(e) => setUserId(e.target.value)}
                                    options={[
                                        { value: '', label: 'Semua Operator' },
                                        ...users.map((u) => ({ value: u.id, label: u.name })),
                                    ]}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-neutral-600 mb-1">
                                    Modul / Kanal
                                </label>
                                <Select
                                    value={logName}
                                    onChange={(e) => setLogName(e.target.value)}
                                    options={[
                                        { value: '', label: 'Semua Kanal' },
                                        ...log_names.map((ln) => ({ value: ln, label: ln })),
                                    ]}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-neutral-600 mb-1">
                                    Tipe Aksi
                                </label>
                                <Select
                                    value={event}
                                    onChange={(e) => setEvent(e.target.value)}
                                    options={[
                                        { value: '', label: 'Semua Aksi' },
                                        { value: 'created', label: 'Dibuat (Created)' },
                                        { value: 'updated', label: 'Diperbarui (Updated)' },
                                        { value: 'deleted', label: 'Dihapus (Deleted)' },
                                    ]}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-neutral-600 mb-1">
                                    Dari Tanggal
                                </label>
                                <Input
                                    type="date"
                                    value={dateFrom}
                                    onChange={(e) => setDateFrom(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-neutral-600 mb-1">
                                    Sampai Tanggal
                                </label>
                                <Input
                                    type="date"
                                    value={dateTo}
                                    onChange={(e) => setDateTo(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100">
                            <Button type="button" variant="ghost" size="sm" onClick={handleReset}>
                                Reset
                            </Button>
                            <Button type="submit" variant="primary" size="sm">
                                <Search className="w-4 h-4 mr-1.5" />
                                Terapkan Filter
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Activity Table */}
                <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="bg-neutral-50/80 border-b border-neutral-200 text-neutral-600 font-semibold uppercase tracking-wider text-[11px]">
                                    <th className="py-3 px-4">Waktu</th>
                                    <th className="py-3 px-4">Operator</th>
                                    <th className="py-3 px-4">Modul / Subjek</th>
                                    <th className="py-3 px-4">Aksi</th>
                                    <th className="py-3 px-4">Deskripsi</th>
                                    <th className="py-3 px-4">Perubahan / Properti</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100">
                                {activities.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="py-12 text-center text-neutral-400">
                                            <ActivityIcon className="w-10 h-10 mx-auto mb-2 opacity-30" />
                                            <p className="text-sm font-medium">Belum ada catatan aktivitas.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    activities.data.map((act) => {
                                        const hasAttributes = act.properties?.attributes;
                                        const hasOld = act.properties?.old;

                                        return (
                                            <tr key={act.id} className="hover:bg-neutral-50/60 transition-colors">
                                                <td className="py-3 px-4 whitespace-nowrap text-neutral-600">
                                                    <div className="font-mono text-[11px] text-neutral-900">
                                                        {act.created_at}
                                                    </div>
                                                    <div className="text-[10px] text-neutral-400 mt-0.5">
                                                        {act.human_time}
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4 whitespace-nowrap">
                                                    {act.causer ? (
                                                        <div>
                                                            <div className="font-semibold text-neutral-900">
                                                                {act.causer.name}
                                                            </div>
                                                            <div className="text-[11px] text-neutral-400">
                                                                {act.causer.email}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span className="text-neutral-400 italic">Sistem / Tamu</span>
                                                    )}
                                                </td>
                                                <td className="py-3 px-4 whitespace-nowrap">
                                                    <div className="font-medium text-neutral-800">
                                                        {act.subject_type || '-'}
                                                    </div>
                                                    <span className="inline-block mt-0.5 text-[10px] font-mono text-neutral-400 bg-neutral-100 px-1 rounded">
                                                        {act.log_name}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 whitespace-nowrap">
                                                    {getEventBadge(act.event)}
                                                </td>
                                                <td className="py-3 px-4 max-w-xs text-neutral-700 leading-relaxed break-words">
                                                    {act.description}
                                                </td>
                                                <td className="py-3 px-4 text-neutral-600 max-w-sm">
                                                    {hasAttributes ? (
                                                        <div className="bg-neutral-50 p-2 rounded text-[11px] font-mono border border-neutral-200/60 space-y-1 overflow-x-auto max-h-24">
                                                            {Object.keys(hasAttributes).map((key) => (
                                                                <div key={key} className="truncate">
                                                                    <span className="font-bold text-neutral-800">{key}:</span>{' '}
                                                                    {hasOld && hasOld[key] !== undefined && (
                                                                        <span className="text-red-600 line-through mr-1">
                                                                            {String(hasOld[key])}
                                                                        </span>
                                                                    )}
                                                                    <span className="text-emerald-700">
                                                                        {String(hasAttributes[key])}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : act.properties?.ip ? (
                                                        <div className="text-[11px] text-neutral-500 font-mono">
                                                            IP: {act.properties.ip}
                                                        </div>
                                                    ) : (
                                                        <span className="text-neutral-400">-</span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {activities.meta.last_page > 1 && (
                        <div className="p-4 border-t border-neutral-100 flex justify-center">
                            <Pagination
                                currentPage={activities.meta.current_page}
                                totalPages={activities.meta.last_page}
                                onPageChange={(page) => {
                                    router.get(
                                        '/admin/aktivitas',
                                        {
                                            page,
                                            user_id: userId || undefined,
                                            log_name: logName || undefined,
                                            event: event || undefined,
                                            date_from: dateFrom || undefined,
                                            date_to: dateTo || undefined,
                                        },
                                        { preserveState: true }
                                    );
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
