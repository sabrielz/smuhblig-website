import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import PenggunaForm from './Form';
import { Button } from '@/Components/UI/Button';
import { ArrowLeft } from 'lucide-react';

export default function Create() {
    return (
        <AdminLayout title="Tambah Pengguna">
            <Head title="Tambah Pengguna Baru" />

            <div className="mb-6 flex items-center gap-4">
                <Link href={route('admin.pengguna.index')}>
                    <Button variant="outline" size="sm" className="px-3">
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Tambah Pengguna</h1>
                    <p className="text-gray-500 text-sm mt-1">Buat akun akses CMS baru untuk tim internal.</p>
                </div>
            </div>

            <PenggunaForm />
        </AdminLayout>
    );
}
