import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import { FileCheck, Images, Users, BookOpen, Plus, Edit } from 'lucide-react';
import { Badge } from '@/Components/UI/Badge';

interface ArticleItem {
    id: number;
    title: string;
    status: string;
    author: string;
    created_at: string;
}

interface AiJobItem {
    id: number;
    job_type: string;
    status: string;
    created_at: string;
}

interface DashboardProps {
    totalArtikel: {
        draft: number;
        pending: number;
        published: number;
        archived: number;
        total: number;
    };
    totalGaleri: number;
    totalPengguna: number;
    totalJurusanAktif: number;
    artikelTerbaru: ArticleItem[];
    aiJobsTerbaru: AiJobItem[];
}

export default function Dashboard({
    totalArtikel,
    totalGaleri,
    totalPengguna,
    totalJurusanAktif,
    artikelTerbaru,
    aiJobsTerbaru,
}: DashboardProps) {
    const getArticleStatusVariant = (status: string) => {
        switch (status) {
            case 'published': return 'success';
            case 'pending': return 'warning';
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
            {/* Row 1: Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Total Artikel Published */}
                <div className="bg-white rounded-xl border border-neutral-200 p-6 flex items-center justify-between shadow-sm">
                    <div>
                        <p className="text-sm font-medium text-neutral-500 mb-1">Total Artikel Published</p>
                        <p className="text-3xl font-bold text-neutral-900">{totalArtikel.published}</p>
                    </div>
                    <div className="h-12 w-12 rounded-xl bg-[#003f87]/10 flex items-center justify-center">
                        <FileCheck className="h-6 w-6 text-[#003f87]" />
                    </div>
                </div>

                {/* Total Galeri */}
                <div className="bg-white rounded-xl border border-neutral-200 p-6 flex items-center justify-between shadow-sm">
                    <div>
                        <p className="text-sm font-medium text-neutral-500 mb-1">Total Galeri</p>
                        <p className="text-3xl font-bold text-neutral-900">{totalGaleri}</p>
                    </div>
                    <div className="h-12 w-12 rounded-xl bg-indigo-100 flex items-center justify-center">
                        <Images className="h-6 w-6 text-indigo-600" />
                    </div>
                </div>

                {/* Total Pengguna */}
                <div className="bg-white rounded-xl border border-neutral-200 p-6 flex items-center justify-between shadow-sm">
                    <div>
                        <p className="text-sm font-medium text-neutral-500 mb-1">Total Pengguna</p>
                        <p className="text-3xl font-bold text-neutral-900">{totalPengguna}</p>
                    </div>
                    <div className="h-12 w-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                        <Users className="h-6 w-6 text-emerald-600" />
                    </div>
                </div>

                {/* Total Jurusan Aktif */}
                <div className="bg-white rounded-xl border border-neutral-200 p-6 flex items-center justify-between shadow-sm">
                    <div>
                        <p className="text-sm font-medium text-neutral-500 mb-1">Total Jurusan Aktif</p>
                        <p className="text-3xl font-bold text-neutral-900">{totalJurusanAktif}</p>
                    </div>
                    <div className="h-12 w-12 rounded-xl bg-amber-100 flex items-center justify-center">
                        <BookOpen className="h-6 w-6 text-amber-600" />
                    </div>
                </div>
            </div>

            {/* Row 2: Tables & Lists */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
                {/* Left: 60% (3/5) - Artikel Terbaru table */}
                <div className="col-span-1 lg:col-span-3 bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden flex flex-col">
                    <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-50/50 flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-neutral-900">Artikel Terbaru</h3>
                    </div>
                    <div className="flex-1 overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[600px]">
                            <thead>
                                <tr className="border-b border-neutral-200 text-xs text-neutral-500 bg-white uppercase tracking-wider">
                                    <th className="px-6 py-3 font-medium">Judul</th>
                                    <th className="px-6 py-3 font-medium">Status</th>
                                    <th className="px-6 py-3 font-medium">Penulis</th>
                                    <th className="px-6 py-3 font-medium">Tanggal</th>
                                    <th className="px-6 py-3 font-medium text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100">
                                {artikelTerbaru.length > 0 ? (
                                    artikelTerbaru.map((artikel) => (
                                        <tr key={artikel.id} className="hover:bg-neutral-50 transition-colors">
                                            <td className="px-6 py-4 text-sm font-medium text-neutral-900 max-w-[200px] truncate">
                                                {artikel.title}
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge variant={getArticleStatusVariant(artikel.status) as any}>
                                                    {artikel.status.charAt(0).toUpperCase() + artikel.status.slice(1)}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-neutral-500">
                                                {artikel.author}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-neutral-500 whitespace-nowrap">
                                                {artikel.created_at}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Link
                                                    href={`/admin/artikel/${artikel.id}/edit`}
                                                    className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-neutral-100 text-neutral-600 hover:bg-[#003f87]/10 hover:text-[#003f87] transition-colors"
                                                    title="Edit Artikel"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-sm text-neutral-500">
                                            Belum ada artikel.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right: 40% (2/5) - AI Jobs Terbaru list */}
                <div className="col-span-1 lg:col-span-2 bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden flex flex-col">
                    <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-50/50">
                        <h3 className="text-lg font-semibold text-neutral-900">AI Jobs Terbaru</h3>
                    </div>
                    <div className="flex-1 p-0">
                        <ul className="divide-y divide-neutral-100">
                            {aiJobsTerbaru.length > 0 ? (
                                aiJobsTerbaru.map((job) => (
                                    <li key={job.id} className="px-6 py-4 hover:bg-neutral-50 transition-colors flex items-center justify-between">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-sm font-medium text-neutral-900 capitalize">
                                                {job.job_type.replace(/_/g, ' ')}
                                            </span>
                                            <span className="text-xs text-neutral-500">
                                                {job.created_at}
                                            </span>
                                        </div>
                                        <Badge variant={getAiJobStatusVariant(job.status) as any}>
                                            {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                                        </Badge>
                                    </li>
                                ))
                            ) : (
                                <li className="px-6 py-8 text-center text-sm text-neutral-500">
                                    Belum ada history AI Job.
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Row 3: Shortcut CTA */}
            <div className="flex flex-wrap items-center gap-4">
                <Link
                    href="/admin/artikel/buat"
                    className="inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed bg-[#003f87] text-white hover:bg-[#002d6b] focus:ring-[#003f87]/50 border border-transparent px-6 py-3 text-base rounded-xl"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Tulis Artikel Baru
                </Link>
                <Link
                    href="/admin/galeri/buat"
                    className="inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-[#003f87] text-[#003f87] hover:bg-[#eef5fc] focus:ring-[#003f87]/50 px-6 py-3 text-base rounded-xl"
                >
                    <Images className="w-5 h-5 mr-2" />
                    Upload Galeri
                </Link>
            </div>
        </AdminLayout>
    );
}
