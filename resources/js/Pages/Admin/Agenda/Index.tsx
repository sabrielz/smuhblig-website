import React, { useState, useMemo } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/UI/Button';
import { Badge } from '@/Components/UI/Badge';
import { Table, Column } from '@/Components/UI/Table';
import { Pagination } from '@/Components/UI/Pagination';
import { ConfirmDialog } from '@/Components/UI/ConfirmDialog';
import { Plus, Edit, Trash, Calendar as CalendarIcon, List, CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths, isSameDay } from 'date-fns';
import { id } from 'date-fns/locale';

interface Agenda {
    id: number;
    slug: string;
    tanggal_mulai: string;
    tanggal_selesai: string | null;
    warna: string;
    tipe: string;
    is_active: boolean;
    judul_id: string;
    judul_en: string;
}

interface PaginatedData {
    data: Agenda[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface Props {
    agendas: PaginatedData;
    filters: {
        bulan?: string;
        tahun?: string;
    };
}

export default function Index({ agendas, filters }: Props) {
    const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [currentDate, setCurrentDate] = useState(() => {
        if (filters.bulan && filters.tahun) {
            return new Date(parseInt(filters.tahun), parseInt(filters.bulan) - 1, 1);
        }
        return new Date();
    });

    const handleDelete = () => {
        if (!deleteId) return;
        router.delete(route('admin.agenda.destroy', { agenda: deleteId }), {
            onSuccess: () => setDeleteId(null),
        });
    };

    const handleMonthChange = (direction: 'prev' | 'next') => {
        const newDate = direction === 'prev' ? subMonths(currentDate, 1) : addMonths(currentDate, 1);
        setCurrentDate(newDate);

        // Reload data from server with new filters
        router.get(route('admin.agenda.index'), {
            bulan: (newDate.getMonth() + 1).toString(),
            tahun: newDate.getFullYear().toString(),
        }, { preserveState: true });
    };

    const getTipeBadge = (tipe: string) => {
        switch (tipe) {
            case 'libur': return <Badge variant="danger">Libur</Badge>;
            case 'ujian': return <Badge variant="warning">Ujian</Badge>;
            case 'penerimaan': return <Badge variant="success">Penerimaan</Badge>;
            case 'kegiatan':
            default: return <Badge variant="info">Kegiatan</Badge>;
        }
    };

    const columns: Column<Agenda>[] = [
        {
            key: 'judul',
            label: 'Judul Agenda',
            render: (a) => (
                <div>
                    <span className="font-semibold text-gray-900 block">{a.judul_id || 'Tanpa Judul'}</span>
                    <div className="flex items-center mt-1 space-x-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: a.warna }}></div>
                        <span className="text-xs text-neutral-500 uppercase">{a.tipe}</span>
                    </div>
                </div>
            ),
        },
        {
            key: 'tanggal',
            label: 'Tanggal',
            render: (a) => (
                <div className="text-sm">
                    {a.tanggal_mulai}
                    {a.tanggal_selesai && a.tanggal_selesai !== a.tanggal_mulai && ` s/d ${a.tanggal_selesai}`}
                </div>
            ),
        },
        {
            key: 'status',
            label: 'Status',
            render: (a) => (
                a.is_active ? <Badge variant="success">Aktif</Badge> : <Badge variant="neutral">Draft</Badge>
            ),
        },
        {
            key: 'actions',
            label: 'Aksi',
            width: '120px',
            render: (a) => (
                <div className="flex gap-2">
                    <Link href={route('admin.agenda.edit', { agenda: a.id })}>
                        <Button variant="outline" size="sm" className="px-3">
                            <Edit className="w-4 h-4 text-neutral-600" />
                        </Button>
                    </Link>
                    <Button variant="danger" size="sm" className="px-3" onClick={() => setDeleteId(a.id)}>
                        <Trash className="w-4 h-4" />
                    </Button>
                </div>
            ),
        },
    ];

    // Calendar logic
    const calendarDays = useMemo(() => {
        const start = startOfMonth(currentDate);
        const end = endOfMonth(currentDate);
        const days = eachDayOfInterval({ start, end });

        // Pad beginning of month
        const firstDayOfWeek = getDay(start);
        // Adjustment to make Monday first day (0) and Sunday last day (6)
        const emptyDaysPrev = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

        const paddedDays = Array(emptyDaysPrev).fill(null);
        return [...paddedDays, ...days];
    }, [currentDate]);

    const getAgendasForDay = (date: Date) => {
        return agendas.data.filter(agenda => {
            const start = new Date(agenda.tanggal_mulai);
            const end = agenda.tanggal_selesai ? new Date(agenda.tanggal_selesai) : start;

            // Normalize time
            start.setHours(0,0,0,0);
            end.setHours(0,0,0,0);
            const current = new Date(date);
            current.setHours(0,0,0,0);

            return current >= start && current <= end;
        });
    };

    return (
        <AdminLayout title="Agenda">
            <Head title="Agenda" />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Agenda Kegiatan</h1>
                    <p className="text-sm text-gray-500 mt-1">Kelola kalender akademik dan agenda sekolah.</p>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                    <div className="hidden md:flex bg-neutral-100 p-1 rounded-lg">
                        <button
                            onClick={() => setViewMode('list')}
                            className={cn(
                                "flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                                viewMode === 'list' ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-700"
                            )}
                        >
                            <List className="w-4 h-4 mr-2" />
                            List
                        </button>
                        <button
                            onClick={() => setViewMode('calendar')}
                            className={cn(
                                "flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                                viewMode === 'calendar' ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-700"
                            )}
                        >
                            <CalendarDays className="w-4 h-4 mr-2" />
                            Kalender
                        </button>
                    </div>

                    <Link href={route('admin.agenda.create')} className="ml-auto md:ml-2">
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Buat Agenda
                        </Button>
                    </Link>
                </div>
            </div>

            {viewMode === 'list' && (
                <>
                    {agendas.data.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-12 text-center flex flex-col items-center justify-center">
                            <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4">
                                <CalendarIcon className="w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-bold text-neutral-900 mb-1">Belum ada agenda</h3>
                            <p className="text-neutral-500 mb-6 max-w-sm">
                                Anda belum membuat satu pun agenda kegiatan.
                            </p>
                            <Link href={route('admin.agenda.create')}>
                                <Button>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Buat Agenda
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <Table columns={columns} data={agendas.data} />
                            <Pagination
                                currentPage={agendas.current_page}
                                totalPages={agendas.last_page}
                                onPageChange={(page) => router.get(route('admin.agenda.index', {
                                    page,
                                    bulan: filters.bulan,
                                    tahun: filters.tahun
                                }))}
                            />
                        </div>
                    )}
                </>
            )}

            {viewMode === 'calendar' && (
                <div className="bg-white border text-center border-neutral-200 rounded-xl overflow-hidden hidden md:block">
                    <div className="flex items-center justify-between p-4 border-b border-neutral-200 bg-neutral-50/50">
                        <h2 className="text-lg font-semibold text-neutral-900 capitalize">
                            {format(currentDate, 'MMMM yyyy', { locale: id })}
                        </h2>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleMonthChange('prev')}>
                                <ChevronLeft className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => {
                                setCurrentDate(new Date());
                                router.get(route('admin.agenda.index'));
                            }}>
                                Hari Ini
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleMonthChange('next')}>
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-7 border-b border-neutral-200">
                        {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'].map((day) => (
                            <div key={day} className="py-2 text-center text-sm font-medium text-neutral-500 border-r border-neutral-200 last:border-0">
                                {day}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 auto-rows-[120px]">
                        {calendarDays.map((day, idx) => {
                            if (!day) return <div key={`empty-${idx}`} className="border-r border-b border-neutral-200 bg-neutral-50/50"></div>;

                            const isToday = isSameDay(day, new Date());
                            const dayAgendas = getAgendasForDay(day);

                            return (
                                <div key={day.toISOString()} className={cn(
                                    "border-r border-b border-neutral-200 p-2 relative last-in-row:border-r-0 hover:bg-neutral-50 transition-colors",
                                    isToday && "bg-blue-50/30"
                                )}>
                                    <div className={cn(
                                        "w-7 h-7 flex items-center justify-center rounded-full text-sm font-medium mb-1",
                                        isToday ? "bg-blue-600 text-white" : "text-neutral-700"
                                    )}>
                                        {format(day, 'd')}
                                    </div>
                                    <div className="space-y-1 overflow-y-auto max-h-[80px] no-scrollbar flex flex-col items-start gap-1">
                                        {dayAgendas.map((agenda) => (
                                            <Link
                                                key={agenda.id}
                                                href={route('admin.agenda.edit', { agenda: agenda.id })}
                                                className="block w-full text-xs text-left truncate px-1.5 py-1 rounded border overflow-hidden"
                                                style={{
                                                    backgroundColor: `${agenda.warna}15`,
                                                    borderColor: `${agenda.warna}30`,
                                                    color: agenda.warna
                                                }}
                                                title={agenda.judul_id}
                                            >
                                                <div className="flex items-center gap-1 w-full relative">
                                                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: agenda.warna }}></span>
                                                    <span className="truncate">{agenda.judul_id}</span>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            <ConfirmDialog
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Hapus Agenda"
                message="Hapus agenda ini secara permanen?"
                variant="danger"
                confirmLabel="Hapus"
            />
        </AdminLayout>
    );
}
