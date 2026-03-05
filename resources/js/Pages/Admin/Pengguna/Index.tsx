import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { Table, Column } from '@/Components/UI/Table';
import { Button } from '@/Components/UI/Button';
import { Badge } from '@/Components/UI/Badge';
import { ConfirmDialog } from '@/Components/UI/ConfirmDialog';
import { Plus, Pen, Trash2 } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function Index() {
    const { penggunas, auth } = usePage<{ penggunas: any[], auth: any }>().props;
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const handleDelete = () => {
        if (deleteId) {
            router.delete(route('admin.pengguna.destroy', { pengguna: deleteId } as any), {
                onSuccess: () => {
                    toast.success('Pengguna berhasil dihapus');
                    setDeleteId(null);
                }
            });
        }
    };

    const columns: Column[] = [
        {
            key: 'name',
            label: 'Nama',
            render: (item: any) => (
                <div className="flex items-center gap-3">
                    <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&color=7F9CF5&background=EBF4FF`}
                        alt={item.name}
                        className="w-8 h-8 rounded-full"
                    />
                    <div>
                        <div className="font-medium text-gray-900">{item.name}</div>
                    </div>
                </div>
            )
        },
        { key: 'email', label: 'Email' },
        {
            key: 'role',
            label: 'Role',
            render: (item: any) => {
                const variants: Record<string, 'neutral' | 'primary' | 'info'> = {
                    admin: 'primary',
                    editor: 'info',
                    author: 'neutral'
                };
                return <Badge variant={variants[String(item.role)] || 'neutral'} className="uppercase text-xs">{item.role}</Badge>;
            }
        },
        {
            key: 'is_active',
            label: 'Status',
            render: (item: any) => item.is_active ? <Badge variant="success">Aktif</Badge> : <Badge variant="danger">Nonaktif</Badge>
        },
        { key: 'last_login_at', label: 'Terakhir Login', render: (item: any) => item.last_login_at || '-' },
        {
            key: 'aksi',
            label: 'Aksi',
            render: (item: any) => (
                <div className="flex items-center gap-2">
                    <Link href={route('admin.pengguna.edit', { pengguna: item.id } as any)}>
                        <Button variant="ghost" size="sm" className="px-2 text-blue-600">
                            <Pen className="w-4 h-4" />
                        </Button>
                    </Link>
                    {item.id !== auth.user.id && (
                        <Button variant="ghost" size="sm" className="px-2 text-red-600" onClick={() => setDeleteId(Number(item.id))}>
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    )}
                </div>
            )
        }
    ];

    return (
        <AdminLayout title="Kelola Pengguna CMS">
            <Head title="Kelola Pengguna CMS" />

            <div className="mb-6 flex justify-between items-center flex-wrap gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Pengguna Sistem</h1>
                    <p className="text-gray-500 text-sm mt-1">Kelola akses staff untuk admin panel.</p>
                </div>
                <Link href={route('admin.pengguna.create')}>
                    <Button className="gap-2">
                        <Plus className="w-4 h-4" />
                        Tambah Pengguna
                    </Button>
                </Link>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <Table columns={columns} data={penggunas} />
            </div>

            <ConfirmDialog
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Hapus Pengguna"
                message="Hati-hati! Menghapus pengguna akan membekukan aksesnya ke sistem. Lanjutkan?"
                variant="danger"
                confirmLabel="Hapus"
            />
        </AdminLayout>
    );
}
