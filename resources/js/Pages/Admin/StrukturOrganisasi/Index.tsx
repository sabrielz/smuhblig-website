import { useState, useMemo } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Plus, Edit2, Trash2, Network, User, ChevronDown, ChevronRight } from 'lucide-react';
import { Modal } from '@/Components/UI/Modal';
import { Select } from '@/Components/UI/Select';
import { ImageUpload } from '@/Components/UI/ImageUpload';
import { ConfirmDialog } from '@/Components/UI/ConfirmDialog';
import { cn } from '@/lib/utils';
import { SharedProps } from '@/types';

interface NodeItem {
    id: number;
    parent_id: number | null;
    nama: string;
    jabatan: string;
    jabatan_en: string | null;
    foto_url: string | null;
    urutan: number;
    is_active: boolean;
    level: number;
    children?: NodeItem[];
}

interface AllNode {
    id: number;
    nama: string;
    jabatan: string;
    level: number;
    parent_id: number | null;
}

interface Props extends SharedProps {
    strukturTree: NodeItem[];
    allNodes: AllNode[];
}

export default function StrukturIndex({ strukturTree, allNodes }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [editingNode, setEditingNode] = useState<NodeItem | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    // Mobile Accordion state
    const [expandedNodes, setExpandedNodes] = useState<Set<number>>(new Set());

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm<{
        parent_id: number | string | null;
        nama: string;
        jabatan: string;
        jabatan_en: string;
        level: number | string;
        is_active: boolean;
        foto: File | null;
        remove_foto: boolean;
    }>({
        parent_id: '',
        nama: '',
        jabatan: '',
        jabatan_en: '',
        level: 0,
        is_active: true,
        foto: null,
        remove_foto: false,
    });

    const openCreateModal = () => {
        setEditingNode(null);
        clearErrors();
        reset();
        setIsModalOpen(true);
    };

    const openEditModal = (node: NodeItem) => {
        setEditingNode(node);
        clearErrors();
        setData({
            parent_id: node.parent_id || '',
            nama: node.nama,
            jabatan: node.jabatan,
            jabatan_en: node.jabatan_en || '',
            level: node.level,
            is_active: node.is_active,
            foto: null,
            remove_foto: false,
        });
        setIsModalOpen(true);
    };

    const confirmDelete = (id: number) => {
        setDeletingId(id);
        setIsConfirmOpen(true);
    };

    const handleDelete = () => {
        if (!deletingId) return;
        destroy(route('admin.struktur-organisasi.destroy', deletingId), {
            preserveScroll: true,
            onSuccess: () => {
                setIsConfirmOpen(false);
                setDeletingId(null);
            },
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Convert empty string parent_id to null
        const submitData = {
            ...data,
            parent_id: data.parent_id === '' ? null : Number(data.parent_id),
            level: Number(data.level)
        };

        if (editingNode) {
            // Inertia doesn't support PUT with File uploads directly well via form data in v2 without method spoofing
            router.post(route('admin.struktur-organisasi.update', editingNode.id), {
                _method: 'put',
                ...submitData
            }, {
                preserveScroll: true,
                onSuccess: () => setIsModalOpen(false)
            });
        } else {
            router.post(route('admin.struktur-organisasi.store'), submitData as any, {
                preserveScroll: true,
                onSuccess: () => setIsModalOpen(false)
            });
        }
    };

    const parentOptions = useMemo(() => {
        const options = [{ value: '', label: 'Tidak ada (puncak)' }];
        allNodes.forEach(node => {
            // Prevent setting self as parent
            if (editingNode && node.id === editingNode.id) return;
            options.push({ value: node.id.toString(), label: `${node.nama} - ${node.jabatan}` });
        });
        return options;
    }, [allNodes, editingNode]);

    const levelOptions = [
        { value: "0", label: 'Level 0 (Kepala/Puncak)' },
        { value: "1", label: 'Level 1 (Wakil/Manajemen)' },
        { value: "2", label: 'Level 2 (Staf/Koordinator)' },
    ];

    const toggleNodeContent = (id: number) => {
        const newExpanded = new Set(expandedNodes);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedNodes(newExpanded);
    };

    const NodeCard = ({ node }: { node: NodeItem }) => (
        <div className={cn(
            "relative group flex flex-col items-center p-4 bg-white rounded-xl shadow-sm border border-gray-200 w-[240px] transition-all hover:shadow-md",
            !node.is_active && "opacity-60"
        )}>
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={() => openEditModal(node)}
                    className="p-1.5 bg-gray-100 text-gray-600 rounded hover:bg-primary-100 hover:text-primary-600 transition-colors"
                >
                    <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                    onClick={() => confirmDelete(node.id)}
                    className="p-1.5 bg-gray-100 text-gray-600 rounded hover:bg-red-100 hover:text-red-600 transition-colors"
                >
                    <Trash2 className="w-3.5 h-3.5" />
                </button>
            </div>

            <div className="w-20 h-20 rounded-full bg-gray-100 p-1 border-2 border-primary-100 shadow-inner mb-3 overflow-hidden">
                {node.foto_url ? (
                    <img src={node.foto_url} alt={node.nama} className="w-full h-full object-cover rounded-full" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-primary-300">
                        <User className="w-8 h-8" />
                    </div>
                )}
            </div>

            <h4 className="font-bold text-gray-900 text-center leading-tight">{node.nama}</h4>
            <p className="text-xs text-primary-600 font-medium text-center mt-1 uppercase tracking-wide">{node.jabatan}</p>
        </div>
    );

    // Recursive render for visual tree (Desktop)
    const renderNodeTree = (node: NodeItem) => {
        const hasChildren = node.children && node.children.length > 0;

        return (
            <div key={node.id} className="flex flex-col items-center">
                <NodeCard node={node} />

                {hasChildren && (
                    <>
                        <div className="w-px h-8 bg-gray-300"></div>
                        <div className="flex gap-8 relative pt-4 border-t border-gray-300">
                            {/* Lines connecting siblings */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[calc(100%-240px)] h-px bg-white"></div>

                            {node.children!.map((child, index) => (
                                <div key={child.id} className="relative">
                                    {/* Vertical line connecting to border-t */}
                                    <div className="absolute top-[-16px] left-1/2 -translate-x-1/2 w-px h-4 bg-gray-300"></div>
                                    {renderNodeTree(child)}
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        );
    };

    // Recursive render for mobile accordion list
    const renderMobileList = (nodes: NodeItem[], levelIndex = 0) => {
        return (
            <div className="space-y-3 pl-4 border-l-2 border-gray-100">
                {nodes.map(node => {
                    const hasChildren = node.children && node.children.length > 0;
                    const isExpanded = expandedNodes.has(node.id);

                    return (
                        <div key={node.id} className="w-full">
                            <div className="flex items-center gap-3 bg-white p-3 rounded-lg border shadow-sm">
                                {hasChildren ? (
                                    <button
                                        onClick={() => toggleNodeContent(node.id)}
                                        className="p-1 bg-gray-50 rounded hover:bg-gray-100"
                                    >
                                        {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                    </button>
                                ) : (
                                    <div className="w-6" /> // spacer
                                )}

                                <div className="w-10 h-10 rounded-full bg-gray-100 shrink-0 overflow-hidden">
                                    {node.foto_url ? (
                                        <img src={node.foto_url} alt={node.nama} className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-5 h-5 m-2.5 text-gray-400" />
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className="font-semibold text-gray-900 truncate">{node.nama}</p>
                                        {!node.is_active && <span className="px-1.5 py-0.5 bg-red-100 text-red-700 text-[10px] font-bold rounded">Off</span>}
                                    </div>
                                    <p className="text-xs text-primary-600 font-medium truncate">{node.jabatan}</p>
                                </div>

                                <div className="flex flex-col gap-1 shrink-0">
                                    <button
                                        onClick={() => openEditModal(node)}
                                        className="p-1.5 bg-gray-50 text-gray-600 rounded hover:bg-primary-100 hover:text-primary-600 transition-colors"
                                    >
                                        <Edit2 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                        onClick={() => confirmDelete(node.id)}
                                        className="p-1.5 bg-gray-50 text-gray-600 rounded hover:bg-red-100 hover:text-red-600 transition-colors"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>

                            {hasChildren && isExpanded && (
                                <div className="mt-3">
                                    {renderMobileList(node.children!, levelIndex + 1)}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <AdminLayout>
            <Head title="Struktur Organisasi" />

            <div className="max-w-full mx-auto py-6 sm:px-6 lg:px-8">
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-4 sm:px-0">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                            <Network className="w-7 h-7 text-primary-600" />
                            Struktur Organisasi
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Kelola bagan struktur pengurus dan guru SMK.
                        </p>
                    </div>
                    <button
                        onClick={openCreateModal}
                        className="inline-flex flex-shrink-0 items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all"
                    >
                        <Plus className="w-5 h-5 mr-1" />
                        Tambah Anggota
                    </button>
                </div>

                {strukturTree.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 flex flex-col items-center justify-center">
                        <Network className="w-16 h-16 text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">Belum ada data</h3>
                        <p className="text-gray-500 mt-1 mb-6 text-center">Mulai dengan menambahkan anggota di posisi level 0 (Puncak).</p>
                        <button
                            onClick={openCreateModal}
                            className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                            <Plus className="w-5 h-5 mr-1 text-gray-400" />
                            Tambah Sekarang
                        </button>
                    </div>
                ) : (
                    <>
                        {/* DESKTOP TREE VISUAL */}
                        <div className="hidden lg:block overflow-x-auto pb-10 custom-scrollbar">
                            <div className="min-w-max p-8 bg-gray-50 border rounded-2xl flex justify-center items-start">
                                <div className="flex flex-col items-center">
                                    {/* Render all level 0 nodes side by side if there are multiple root nodes */}
                                    <div className="flex gap-12 relative">
                                        {strukturTree.map(rootNode => renderNodeTree(rootNode))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* MOBILE / TABLET ACCORDION */}
                        <div className="lg:hidden px-4 sm:px-0">
                            <div className="bg-gray-50 p-4 border rounded-xl">
                                {renderMobileList(strukturTree)}
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* FORM MODAL */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingNode ? "Edit Anggota Struktur" : "Tambah Anggota Struktur"}
                size="lg"
            >
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 flex gap-4">
                        <div className="w-24 shrink-0">
                            <ImageUpload
                                value={editingNode?.foto_url || undefined}
                                onChange={(file) => setData('foto', file)}
                                aspectRatio="aspect-square"
                                maxSizeMB={2}
                                error={errors.foto}
                                label="Foto"
                            />
                            {editingNode?.foto_url && (
                                <button
                                    type="button"
                                    onClick={() => setData('remove_foto', true)}
                                    className="mt-2 text-xs text-red-600 hover:text-red-700 w-full text-center"
                                >
                                    Hapus Foto
                                </button>
                            )}
                        </div>
                        <div className="flex-1 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                                <input
                                    type="text"
                                    required
                                    value={data.nama}
                                    onChange={(e) => setData('nama', e.target.value)}
                                    className={cn(
                                        "block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500",
                                        errors.nama && "border-red-500 focus:border-red-500 focus:ring-red-500"
                                    )}
                                    placeholder="Contoh: Drs. H. Ahmad, M.Pd"
                                />
                                {errors.nama && <p className="mt-1 text-sm text-red-600">{errors.nama}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Jabatan (Utama)</label>
                            <input
                                type="text"
                                required
                                value={data.jabatan}
                                onChange={(e) => setData('jabatan', e.target.value)}
                                className={cn(
                                    "block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500",
                                    errors.jabatan && "border-red-500 focus:border-red-500 focus:ring-red-500"
                                )}
                                placeholder="Contoh: Kepala Sekolah"
                            />
                            {errors.jabatan && <p className="mt-1 text-sm text-red-600">{errors.jabatan}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Jabatan (Inggris)</label>
                            <input
                                type="text"
                                value={data.jabatan_en}
                                onChange={(e) => setData('jabatan_en', e.target.value)}
                                className={cn(
                                    "block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500",
                                    errors.jabatan_en && "border-red-500 focus:border-red-500 focus:ring-red-500"
                                )}
                                placeholder="Contoh: Principal"
                            />
                            {errors.jabatan_en && <p className="mt-1 text-sm text-red-600">{errors.jabatan_en}</p>}
                        </div>

                        <Select
                            label="Atasan Langsung (Parent)"
                            options={parentOptions}
                            value={data.parent_id || ''}
                            onChange={(e) => setData('parent_id', e.target.value)}
                            error={errors.parent_id}
                        />

                        <Select
                            label="Level Hirarki"
                            options={levelOptions}
                            value={data.level.toString()}
                            onChange={(e) => setData('level', e.target.value)}
                            error={errors.level}
                        />
                    </div>

                    <div className="flex items-center bg-gray-50 p-3 rounded-lg border">
                        <label className="flex items-center gap-3 cursor-pointer w-full">
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    className="sr-only"
                                    checked={data.is_active}
                                    onChange={(e) => setData('is_active', e.target.checked)}
                                />
                                <div className={cn(
                                    "block w-10 h-6 rounded-full transition-colors",
                                    data.is_active ? "bg-primary-600" : "bg-gray-300"
                                )}></div>
                                <div className={cn(
                                    "dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform",
                                    data.is_active ? "transform translate-x-4" : ""
                                )}></div>
                            </div>
                            <div>
                                <span className="text-sm font-bold text-gray-900 block">Status Aktif</span>
                                <span className="text-xs text-gray-500 block">Tampilkan di halaman publik</span>
                            </div>
                        </label>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan Anggota'}
                        </button>
                    </div>
                </form>
            </Modal>

            <ConfirmDialog
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleDelete}
                title="Hapus Anggota"
                message="Apakah Anda yakin ingin menghapus data ini? Jika memiliki bawahan, data bawahan akan otomatis naik hierarki ke atasannya."
                confirmLabel={processing ? "Menghapus..." : "Ya, Hapus"}
                cancelLabel="Batal"
                variant="danger"
            />
        </AdminLayout>
    );
}
