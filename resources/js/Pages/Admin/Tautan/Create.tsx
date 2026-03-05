import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import TautanForm from './Form';
import { Button } from '@/Components/UI/Button';
import { ArrowLeft } from 'lucide-react';

export default function Create() {
    return (
        <AdminLayout title="Buat Tautan">
            <Head title="Tambah Tautan Baru" />

            <div className="mb-6 flex items-center gap-4">
                <Link href={route('admin.tautan.index')}>
                    <Button variant="outline" size="sm" className="px-3 text-neutral-600 hover:text-neutral-900">
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Tambah Tautan Baru</h1>
                    <p className="text-gray-500 text-sm mt-1">Buat tautan eksternal baru.</p>
                </div>
            </div>

            <TautanForm />
        </AdminLayout>
    );
}
