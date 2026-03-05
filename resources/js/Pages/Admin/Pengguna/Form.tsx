import { Input } from '@/Components/UI/Input';
import { Button } from '@/Components/UI/Button';
import { Select } from '@/Components/UI/Select';
import { Link, useForm, usePage } from '@inertiajs/react';
import { Save } from 'lucide-react';

export default function PenggunaForm({ pengguna = null, isEdit = false }: { pengguna?: any, isEdit?: boolean }) {
    const { auth } = usePage<any>().props;

    const { data, setData, post, put, processing, errors } = useForm({
        name: pengguna?.name || '',
        email: pengguna?.email || '',
        password: '',
        role: pengguna?.role || 'author',
        is_active: pengguna?.is_active ?? true,
    });

    const isSelfEdit = isEdit && auth.user.id === pengguna?.id;

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit) {
            put(route('admin.pengguna.update', pengguna.id));
        } else {
            post(route('admin.pengguna.store'));
        }
    };

    return (
        <form onSubmit={submit} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm max-w-3xl mx-auto space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                    label="Nama Lengkap"
                    value={data.name}
                    onChange={e => setData('name', e.target.value)}
                    error={errors.name}
                    required
                />

                <Input
                    label="Email"
                    type="email"
                    value={data.email}
                    onChange={e => setData('email', e.target.value)}
                    error={errors.email}
                    required
                />

                <Input
                    label={`Password ${isEdit ? '(Isi jika ingin diubah)' : ''}`}
                    type="password"
                    value={data.password}
                    onChange={e => setData('password', e.target.value)}
                    error={errors.password}
                    required={!isEdit}
                />

                <Select
                    label="Role Pengguna"
                    value={data.role}
                    onChange={e => setData('role', e.target.value)}
                    error={errors.role}
                    disabled={isSelfEdit}
                    options={[
                        { label: 'Admin (Developer/Super)', value: 'admin' },
                        { label: 'Editor (Verifikasi & Publikasi Konten)', value: 'editor' },
                        { label: 'Author (Hanya Menulis)', value: 'author' },
                    ]}
                />

                <div className="flex items-center gap-3 md:col-span-2">
                    <input
                        type="checkbox"
                        id="is_active"
                        checked={data.is_active}
                        onChange={e => setData('is_active', e.target.checked)}
                        className="rounded border-gray-300 text-primary-navy focus:ring-primary-navy"
                        disabled={isSelfEdit}
                    />
                    <label
                        htmlFor="is_active"
                        className={`text-sm font-medium ${isSelfEdit ? 'text-gray-400' : 'text-gray-700 cursor-pointer'}`}
                    >
                        Aktif (Pengguna dapat login ke CMS)
                        {isSelfEdit && <span className="ml-2 italic">(Tidak dapat menonaktifkan diri sendiri)</span>}
                    </label>
                </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                <Link href={route('admin.pengguna.index')}>
                    <Button variant="outline" type="button">Batal</Button>
                </Link>
                <Button type="submit" disabled={processing}>
                    <Save className="w-4 h-4 mr-2" />
                    Simpan
                </Button>
            </div>
        </form>
    );
}
