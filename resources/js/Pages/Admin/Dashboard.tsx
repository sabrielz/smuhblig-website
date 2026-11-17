import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import {
    FileCheck,
    Images,
    Users,
    BookOpen,
    Plus,
    Clock,
    Bell,
    Mail,
    TrendingUp,
    Sparkles,
    Eye,
} from 'lucide-react';
import { Badge } from '@/Components/UI/Badge';
import { MiniBarChart, type MiniBarChartData } from '@/Components/Admin/MiniBarChart';

interface AuthorArticleItem {
    id: number;
    title: string;
    status: string;
    created_at: string;
}

interface PendingArticleItem {
    id: number;
    title: string;
    author: string;
    created_at: string;
}

interface PopularContentItem {
    id: number;
    title: string;
    view_count: number;
    slug: string;
}

interface AiJobItem {
    id: number;
    job_type: string;
    status: string;
    created_at: string;
}

interface DashboardProps {
    role: 'author' | 'editor' | 'admin';
    authorStats?: {
        draft: number;
        pending: number;
        published: number;
        archived: number;
    } | null;
    authorArticles?: AuthorArticleItem[] | null;
    editorStats?: {
        pending_review: number;
        pengumuman_aktif: number;
        pesan_baru: number;
    } | null;
    pendingArticles?: PendingArticleItem[] | null;
    adminStats?: {
        total_artikel: number;
        total_galeri: number;
        total_pengguna: number;
        total_jurusan: number;
    } | null;
    kunjungan30Hari?: MiniBarChartData[] | null;
    kontenTerpopuler?: PopularContentItem[] | null;
    aiJobsTerbaru?: AiJobItem[] | null;
}

export default function Dashboard({
    role,
    authorStats,
    authorArticles,
    editorStats,
    pendingArticles,
    adminStats,
    kunjungan30Hari,
    kontenTerpopuler,
    aiJobsTerbaru,
}: DashboardProps) {
    const getArticleStatusVariant = (status: string) => {
        switch (status) {
            case 'published': return 'success';
            case 'pending_review': return 'warning';
            case 'archived': return 'neutral';
            case 'draft': return 'neutral';
            default: return 'neutral';
        }
    };

    const getAiJobStatusVariant = (status: string) => {
        switch (status) {
            case 'done': return 'success';
            case 'processing': return 'info';
            case 'failed': return 'danger';
            case 'pending': return 'warning';
            default: return 'neutral';
        }
    };

    return (
        <AdminLayout title="Dashboard">
            <Head title="Dashboard" />

            {/* ============================================================== */}
            {/* 1. ADMIN STATS & KUNJUNGAN */}
            {/* ============================================================== */}
            {role === 'admin' && adminStats && (
                <div className="space-y-6 mb-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        <div className="bg-white rounded-xl border border-neutral-200 p-5 flex items-center justify-between shadow-xs">
                            <div>
                                <p className="text-xs font-medium text-neutral-500 mb-1">Total Artikel</p>
                                <p className="text-2xl font-bold text-neutral-900">{adminStats.total_artikel}</p>
                            </div>
                            <div className="h-11 w-11 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
                                <FileCheck className="h-5 w-5" />
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-neutral-200 p-5 flex items-center justify-between shadow-xs">
                            <div>
                                <p className="text-xs font-medium text-neutral-500 mb-1">Total Galeri</p>
                                <p className="text-2xl font-bold text-neutral-900">{adminStats.total_galeri}</p>
                            </div>
                            <div className="h-11 w-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                <Images className="h-5 w-5" />
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-neutral-200 p-5 flex items-center justify-between shadow-xs">
                            <div>
                                <p className="text-xs font-medium text-neutral-500 mb-1">Total Pengguna</p>
                                <p className="text-2xl font-bold text-neutral-900">{adminStats.total_pengguna}</p>
                            </div>
                            <div className="h-11 w-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                                <Users className="h-5 w-5" />
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-neutral-200 p-5 flex items-center justify-between shadow-xs">
                            <div>
                                <p className="text-xs font-medium text-neutral-500 mb-1">Jurusan Aktif</p>
                                <p className="text-2xl font-bold text-neutral-900">{adminStats.total_jurusan}</p>
                            </div>
                            <div className="h-11 w-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                                <BookOpen className="h-5 w-5" />
                            </div>
                        </div>
                    </div>

                    {/* Grafik Kunjungan 30 Hari */}
                    <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-xs">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-base font-bold text-neutral-900">Tren Kunjungan 30 Hari Terakhir</h3>
                                <p className="text-xs text-neutral-500">Jumlah kunjungan konten publik dari pengunjung asli</p>
                            </div>
                            <div className="p-2 rounded-lg bg-primary-50 text-primary-600">
                                <TrendingUp className="w-5 h-5" />
                            </div>
                        </div>
                        <MiniBarChart data={kunjungan30Hari ?? []} height={180} />
                    </div>
                </div>
            )}

            {/* ============================================================== */}
            {/* 2. EDITOR STATS & ANTREAN REVIEW */}
            {/* ============================================================== */}
            {(role === 'editor' || role === 'admin') && editorStats && (
                <div className="space-y-6 mb-8">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                        <div className="bg-white rounded-xl border border-neutral-200 p-5 flex items-center justify-between shadow-xs">
                            <div>
                                <p className="text-xs font-medium text-neutral-500 mb-1">Menunggu Review</p>
                                <p className="text-2xl font-bold text-amber-600">{editorStats.pending_review}</p>
                            </div>
                            <div className="h-11 w-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                                <Clock className="h-5 w-5" />
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-neutral-200 p-5 flex items-center justify-between shadow-xs">
                            <div>
                                <p className="text-xs font-medium text-neutral-500 mb-1">Pengumuman Aktif</p>
                                <p className="text-2xl font-bold text-neutral-900">{editorStats.pengumuman_aktif}</p>
                            </div>
                            <div className="h-11 w-11 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
                                <Bell className="h-5 w-5" />
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-neutral-200 p-5 flex items-center justify-between shadow-xs">
                            <div>
                                <p className="text-xs font-medium text-neutral-500 mb-1">Pesan Kontak Baru</p>
                                <p className="text-2xl font-bold text-emerald-600">{editorStats.pesan_baru}</p>
                            </div>
                            <div className="h-11 w-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                <Mail className="h-5 w-5" />
                            </div>
                        </div>
                    </div>

                    {/* Antrean Pending Review */}
                    <div className="bg-white rounded-xl border border-neutral-200 shadow-xs overflow-hidden">
                        <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
                            <div>
                                <h3 className="text-base font-bold text-neutral-900">Antrean Artikel Menunggu Review</h3>
                                <p className="text-xs text-neutral-500">Artikel yang diajukan oleh penulis dan perlu ditinjau</p>
                            </div>
                            <Link
                                href="/admin/artikel?status=pending_review"
                                className="text-xs font-semibold text-primary-600 hover:text-primary-700"
                            >
                                Lihat Semua
                            </Link>
                        </div>
                        <div className="divide-y divide-neutral-100">
                            {!pendingArticles || pendingArticles.length === 0 ? (
                                <p className="text-xs text-neutral-400 p-5 text-center">Tidak ada artikel yang menunggu review saat ini.</p>
                            ) : (
                                pendingArticles.map((art) => (
                                    <div key={art.id} className="p-4 flex items-center justify-between gap-4">
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-neutral-900 truncate">{art.title}</p>
                                            <p className="text-xs text-neutral-500">Oleh: {art.author} • {art.created_at}</p>
                                        </div>
                                        <Link
                                            href={`/admin/artikel/${art.id}/edit`}
                                            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-primary-50 text-primary-700 hover:bg-primary-100 shrink-0"
                                        >
                                            Tinjau
                                        </Link>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ============================================================== */}
            {/* 3. AUTHOR STATS & ARTIKEL SAYA */}
            {/* ============================================================== */}
            {authorStats && (
                <div className="space-y-6 mb-8">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-xs">
                            <p className="text-xs text-neutral-500">Draft Saya</p>
                            <p className="text-xl font-bold text-neutral-800 mt-1">{authorStats.draft}</p>
                        </div>
                        <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-xs">
                            <p className="text-xs text-neutral-500">Menunggu Review</p>
                            <p className="text-xl font-bold text-amber-600 mt-1">{authorStats.pending}</p>
                        </div>
                        <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-xs">
                            <p className="text-xs text-neutral-500">Terbit</p>
                            <p className="text-xl font-bold text-emerald-600 mt-1">{authorStats.published}</p>
                        </div>
                        <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-xs">
                            <p className="text-xs text-neutral-500">Arsip</p>
                            <p className="text-xl font-bold text-neutral-500 mt-1">{authorStats.archived}</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-neutral-200 shadow-xs overflow-hidden">
                        <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
                            <div>
                                <h3 className="text-base font-bold text-neutral-900">Artikel Terbaru Saya</h3>
                                <p className="text-xs text-neutral-500">Status perkembangan artikel yang Anda tulis</p>
                            </div>
                            <Link
                                href="/admin/artikel/create"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary-600 text-white hover:bg-primary-700"
                            >
                                <Plus className="w-3.5 h-3.5" />
                                Tulis Artikel
                            </Link>
                        </div>
                        <div className="divide-y divide-neutral-100">
                            {!authorArticles || authorArticles.length === 0 ? (
                                <p className="text-xs text-neutral-400 p-5 text-center">Belum ada artikel yang ditulis.</p>
                            ) : (
                                authorArticles.map((art) => (
                                    <div key={art.id} className="p-4 flex items-center justify-between gap-4">
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-neutral-900 truncate">{art.title}</p>
                                            <p className="text-xs text-neutral-500">{art.created_at}</p>
                                        </div>
                                        <div className="flex items-center gap-3 shrink-0">
                                            <Badge variant={getArticleStatusVariant(art.status)}>
                                                {art.status}
                                            </Badge>
                                            <Link
                                                href={`/admin/artikel/${art.id}/edit`}
                                                className="text-xs font-medium text-primary-600 hover:text-primary-800"
                                            >
                                                Edit
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ============================================================== */}
            {/* 4. ADMIN EXTRA: KONTEN TERPOPULER & AI JOBS */}
            {/* ============================================================== */}
            {role === 'admin' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* 5 Konten Terpopuler */}
                    <div className="bg-white rounded-xl border border-neutral-200 shadow-xs overflow-hidden">
                        <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
                            <div>
                                <h3 className="text-base font-bold text-neutral-900">5 Konten Terpopuler</h3>
                                <p className="text-xs text-neutral-500">Artikel dengan pembaca terbanyak</p>
                            </div>
                            <Eye className="w-5 h-5 text-primary-600" />
                        </div>
                        <div className="divide-y divide-neutral-100">
                            {!kontenTerpopuler || kontenTerpopuler.length === 0 ? (
                                <p className="text-xs text-neutral-400 p-5 text-center">Belum ada data tayangan konten.</p>
                            ) : (
                                kontenTerpopuler.map((konten, idx) => (
                                    <div key={konten.id} className="p-4 flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <span className="w-6 h-6 rounded-full bg-neutral-100 text-neutral-600 text-xs font-bold flex items-center justify-center shrink-0">
                                                {idx + 1}
                                            </span>
                                            <p className="text-sm font-medium text-neutral-800 truncate">{konten.title}</p>
                                        </div>
                                        <span className="text-xs font-bold text-primary-700 bg-primary-50 px-2.5 py-1 rounded-full shrink-0">
                                            {konten.view_count.toLocaleString()} tayangan
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* AI Jobs Terbaru */}
                    <div className="bg-white rounded-xl border border-neutral-200 shadow-xs overflow-hidden">
                        <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
                            <div>
                                <h3 className="text-base font-bold text-neutral-900">Aktivitas Asisten AI Terbaru</h3>
                                <p className="text-xs text-neutral-500">Pemrosesan tugas generatif & optimasi konten</p>
                            </div>
                            <Sparkles className="w-5 h-5 text-amber-500" />
                        </div>
                        <div className="divide-y divide-neutral-100">
                            {!aiJobsTerbaru || aiJobsTerbaru.length === 0 ? (
                                <p className="text-xs text-neutral-400 p-5 text-center">Belum ada tugas AI yang dijalankan.</p>
                            ) : (
                                aiJobsTerbaru.map((job) => (
                                    <div key={job.id} className="p-4 flex items-center justify-between gap-3">
                                        <div>
                                            <p className="text-sm font-semibold text-neutral-800 uppercase tracking-wide">
                                                {job.job_type}
                                            </p>
                                            <p className="text-xs text-neutral-400">{job.created_at}</p>
                                        </div>
                                        <Badge variant={getAiJobStatusVariant(job.status)}>
                                            {job.status}
                                        </Badge>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
