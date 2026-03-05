import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import PenggunaForm from './Form';
import { Button } from '@/Components/UI/Button';
import { ArrowLeft } from 'lucide-react';

export default function Edit({ pengguna }: { pengguna: any }) {
    return (
        <AdminLayout title="Edit Pengguna">
            <Head title={`Edit Pengguna ${pengguna.name}`} />

            <div className="mb-6 flex items-center gap-4">
                <Link href={route('admin.pengguna.index')}>
                    <Button variant="outline" size="sm" className="px-3">
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Edit Akses Pengguna</h1>
                    <p className="text-gray-500 text-sm mt-1">Perbarui akses CMS atas nama <b>{pengguna.name}</b>.</p>
                </div>
            </div>

            <PenggunaForm pengguna={pengguna} isEdit={true} />
        </AdminLayout>
    );
}
