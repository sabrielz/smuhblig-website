import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { Badge } from '@/Components/UI/Badge';
import { Button } from '@/Components/UI/Button';
import { Pen } from 'lucide-react';

export default function Index() {
    const { jurusans } = usePage<{ jurusans: any[] }>().props;

    return (
        <AdminLayout title="Kelola Jurusan">
            <Head title="Kelola Jurusan" />

            <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">Program Keahlian (Jurusan)</h1>
                <p className="text-gray-500 text-sm mt-1">
                    Kelola konten 5 jurusan yang tersedia.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jurusans.map((jurusan) => (
                    <div key={jurusan.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                        <div
                            className="h-24 w-full"
                            style={{ background: jurusan.color_gradient || 'linear-gradient(to right, #003f87, #001f4d)' }}
                        />
                        <div className="p-5 flex-1 flex flex-col pl-6">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-gray-900 text-lg uppercase">{jurusan.kode}</h3>
                                {jurusan.is_active ? (
                                    <Badge variant="success">Aktif</Badge>
                                ) : (
                                    <Badge variant="neutral">Draft</Badge>
                                )}
                            </div>
                            <p className="text-gray-600 text-sm font-medium mb-4">{jurusan.nama}</p>

                            <div className="mt-auto pt-4 border-t border-gray-100 flex justify-end">
                                <Link href={route('admin.jurusan.edit', jurusan.id)}>
                                    <Button variant="outline" size="sm" className="gap-2">
                                        <Pen className="w-4 h-4" />
                                        Edit Konten
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </AdminLayout>
    );
}
