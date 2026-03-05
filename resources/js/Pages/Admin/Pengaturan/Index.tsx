import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import { Input } from '@/Components/UI/Input';
import { Button } from '@/Components/UI/Button';
import { Textarea } from '@/Components/UI/Textarea';
import { Select } from '@/Components/UI/Select';
import { ImageUpload } from '@/Components/UI/ImageUpload';
import { Save, Globe, Share2, Search, Settings, Cpu } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Index({ settings, aiStats }: { settings: Record<string, any>, aiStats: any }) {
    const [activeTab, setActiveTab] = useState('umum');

    const { data, setData, post, processing, errors } = useForm({
        _method: 'POST',
        // Tab Umum
        site_name: settings.site_name || '',
        site_tagline: settings.site_tagline || '',
        site_email: settings.site_email || '',
        site_phone: settings.site_phone || '',
        site_address: settings.site_address || '',
        spmb_url: settings.spmb_url || '',
        site_logo_file: null as File | null,
        site_favicon_file: null as File | null,

        // Tab Sosial Media
        sosmed_instagram: settings.sosmed_instagram || '',
        sosmed_youtube: settings.sosmed_youtube || '',
        sosmed_facebook: settings.sosmed_facebook || '',
        sosmed_tiktok: settings.sosmed_tiktok || '',
        sosmed_twitter: settings.sosmed_twitter || '',

        // Tab SEO
        seo_meta_description: settings.seo_meta_description || '',
        seo_google_analytics: settings.seo_google_analytics || '',

        // Tab Fitur
        fitur_artikel_approval: settings.fitur_artikel_approval === 'true' || settings.fitur_artikel_approval === true,
        fitur_artikel_ai_enabled: settings.fitur_artikel_ai_enabled === 'true' || settings.fitur_artikel_ai_enabled === true,
        fitur_multibahasa_enabled: settings.fitur_multibahasa_enabled === 'true' || settings.fitur_multibahasa_enabled === true,

        // Tab AI
        ai_provider: settings.ai_provider || 'openai',
        ai_translate_auto: settings.ai_translate_auto === 'true' || settings.ai_translate_auto === true,
        ai_monthly_budget: settings.ai_monthly_budget || 100000,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.pengaturan.store'), {
            preserveScroll: true,
            onSuccess: () => toast.success('Pengaturan berhasil disimpan!'),
            onError: () => toast.error('Terjadi kesalahan, periksa form kembali.'),
        });
    };

    const tabs = [
        { id: 'umum', label: 'Umum', icon: Globe },
        { id: 'sosmed', label: 'Sosial Media', icon: Share2 },
        { id: 'seo', label: 'SEO & Analytics', icon: Search },
        { id: 'fitur', label: 'Fitur Sistem', icon: Settings },
        { id: 'ai', label: 'Kecerdasan Buatan (AI)', icon: Cpu },
    ];

    return (
        <AdminLayout title="Pengaturan Sistem">
            <Head title="Pengaturan Sistem" />

            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Pengaturan Web</h1>
                    <p className="text-gray-500 text-sm mt-1">Konfigurasi pengaturan utama untuk website Anda.</p>
                </div>
                <Button onClick={submit} disabled={processing} className="w-full sm:w-auto">
                    <Save className="w-4 h-4 mr-2" />
                    Simpan Pengaturan
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
                <div className="md:col-span-1 space-y-1">
                    {tabs.map(tab => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors text-left ${
                                    isActive
                                    ? 'bg-primary-navy text-white shadow-sm'
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                }`}
                            >
                                <Icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                <div className="md:col-span-3 bg-white shadow-sm border border-gray-100 rounded-xl overflow-hidden">
                    <form onSubmit={submit} className="p-6">
                        {activeTab === 'umum' && (
                            <div className="space-y-6 animate-in fade-in duration-300">
                                <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Identitas Sekolah</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Input label="Nama Sekolah" value={data.site_name} onChange={e => setData('site_name', e.target.value)} required />
                                    <Input label="Tagline" value={data.site_tagline} onChange={e => setData('site_tagline', e.target.value)} />
                                    <Input label="Email Utama" type="email" value={data.site_email} onChange={e => setData('site_email', e.target.value)} />
                                    <Input label="Nomor Telepon/WA" value={data.site_phone} onChange={e => setData('site_phone', e.target.value)} />
                                    <div className="md:col-span-2">
                                        <Textarea label="Alamat Lengkap" value={data.site_address} onChange={e => setData('site_address', e.target.value)} rows={3} />
                                    </div>
                                    <div className="md:col-span-2">
                                        <Input label="URL Pendaftaran (SPMB/PPDB)" type="url" placeholder="https://" value={data.spmb_url} onChange={e => setData('spmb_url', e.target.value)} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Logo Web</label>
                                        <ImageUpload
                                            value={settings.site_logo ? '/' + settings.site_logo : ''}
                                            onChange={(file: File) => setData('site_logo_file', file)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Favicon (Ikon Tab Browser)</label>
                                        <ImageUpload
                                            value={settings.site_favicon ? '/' + settings.site_favicon : ''}
                                            onChange={(file: File) => setData('site_favicon_file', file)}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'sosmed' && (
                            <div className="space-y-6 animate-in fade-in duration-300">
                                <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Tautan Media Sosial</h2>
                                <p className="text-sm text-gray-500 mb-4">Kosongkan URL jika tidak ingin menampilkan media sosial terkait.</p>
                                <div className="space-y-4">
                                    <Input label="Instagram URL" type="url" value={data.sosmed_instagram} onChange={e => setData('sosmed_instagram', e.target.value)} placeholder="https://instagram.com/..." />
                                    <Input label="YouTube URL" type="url" value={data.sosmed_youtube} onChange={e => setData('sosmed_youtube', e.target.value)} placeholder="https://youtube.com/..." />
                                    <Input label="Facebook URL" type="url" value={data.sosmed_facebook} onChange={e => setData('sosmed_facebook', e.target.value)} placeholder="https://facebook.com/..." />
                                    <Input label="TikTok URL" type="url" value={data.sosmed_tiktok} onChange={e => setData('sosmed_tiktok', e.target.value)} placeholder="https://tiktok.com/@..." />
                                    <Input label="Twitter / X URL" type="url" value={data.sosmed_twitter} onChange={e => setData('sosmed_twitter', e.target.value)} placeholder="https://x.com/..." />
                                </div>
                            </div>
                        )}

                        {activeTab === 'seo' && (
                            <div className="space-y-6 animate-in fade-in duration-300">
                                <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Konfigurasi SEO Canggih</h2>
                                <Textarea
                                    label="Meta Deskripsi Default (Global)"
                                    value={data.seo_meta_description}
                                    onChange={e => setData('seo_meta_description', e.target.value)}
                                    rows={4}
                                    hint="Akan digunakan sebagai fallback deskripsi jika halaman tidak memiliki deskripsi khusus."
                                />
                                <Input
                                    label="Google Analytics Measurement ID"
                                    value={data.seo_google_analytics}
                                    onChange={e => setData('seo_google_analytics', e.target.value)}
                                    placeholder="G-XXXXXXXXXX"
                                    hint="Kosongkan jika tidak menggunakan Google Analytics."
                                />
                            </div>
                        )}

                        {activeTab === 'fitur' && (
                            <div className="space-y-6 animate-in fade-in duration-300">
                                <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Toggle Fitur</h2>

                                <div className="flex items-start gap-4 p-4 border rounded-xl border-gray-100 bg-gray-50/50">
                                    <input type="checkbox" id="f1" checked={data.fitur_artikel_approval} onChange={e => setData('fitur_artikel_approval', e.target.checked)} className="mt-1 rounded border-gray-300 text-primary-navy focus:ring-primary-navy" />
                                    <div>
                                        <label htmlFor="f1" className="font-medium text-gray-900 block select-none">Persetujuan Editor (Approval)</label>
                                        <p className="text-sm text-gray-500 mt-1">Artikel yang ditulis oleh Author harus disetujui Editor atau Admin sebelum tampil.</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-4 border rounded-xl border-gray-100 bg-gray-50/50">
                                    <input type="checkbox" id="f2" checked={data.fitur_multibahasa_enabled} onChange={e => setData('fitur_multibahasa_enabled', e.target.checked)} className="mt-1 rounded border-gray-300 text-primary-navy focus:ring-primary-navy" />
                                    <div>
                                        <label htmlFor="f2" className="font-medium text-gray-900 block select-none">Fitur Multibahasa (ID/EN)</label>
                                        <p className="text-sm text-gray-500 mt-1">Izinkan pengunjung untuk beralih bahasa antara Indonesia dan Inggris.</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-4 border rounded-xl border-gray-100 bg-gray-50/50">
                                    <input type="checkbox" id="f3" checked={data.fitur_artikel_ai_enabled} onChange={e => setData('fitur_artikel_ai_enabled', e.target.checked)} className="mt-1 rounded border-gray-300 text-primary-navy focus:ring-primary-navy" />
                                    <div>
                                        <label htmlFor="f3" className="font-medium text-gray-900 block select-none">AI Writing Assistant</label>
                                        <p className="text-sm text-gray-500 mt-1">Aktifkan modul TipTap AI untuk mereview dan generate artikel secara otomatis.</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'ai' && (
                            <div className="space-y-6 animate-in fade-in duration-300">
                                <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Pengaturan Kecerdasan Buatan (AI)</h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                    <div className="bg-primary-navy/5 border border-primary-navy/10 rounded-xl p-4">
                                        <span className="text-xs font-bold text-primary-navy uppercase">Total Job & Status</span>
                                        <div className="mt-2 text-2xl font-bold">{aiStats.total_jobs} <span className="text-sm font-normal text-gray-500">jobs bulan ini</span></div>
                                        <div className="flex gap-4 mt-2 text-sm text-gray-600">
                                            <span className="text-green-600 font-medium">✓ {aiStats.completed} Sukses</span>
                                            <span className="text-red-500 font-medium">× {aiStats.failed} Gagal</span>
                                        </div>
                                    </div>
                                    <div className="bg-gold-accent/10 border border-gold-accent/20 rounded-xl p-4">
                                        <span className="text-xs font-bold text-amber-700 uppercase">Estimasi Biaya / Tokens</span>
                                        <div className="mt-2 text-2xl font-bold text-amber-900">
                                            Rp {Number(aiStats.cost_estimate).toLocaleString('id-ID')}
                                        </div>
                                        <div className="mt-2 text-sm text-amber-700/80">Anggaran: Rp {Number(data.ai_monthly_budget).toLocaleString('id-ID')}</div>
                                    </div>
                                </div>

                                <Select
                                    label="Provider AI Utama"
                                    value={data.ai_provider}
                                    onChange={e => setData('ai_provider', e.target.value)}
                                    options={[
                                        { label: 'OpenAI (GPT-4o)', value: 'openai' },
                                        { label: 'Anthropic (Claude 3.5 Sonnet)', value: 'anthropic' },
                                        { label: 'Google (Gemini 1.5 Pro)', value: 'google' },
                                    ]}
                                />

                                <Input
                                    label="Batas Anggaran Bulanan (Rp)"
                                    type="number"
                                    value={data.ai_monthly_budget}
                                    onChange={e => setData('ai_monthly_budget', e.target.value)}
                                    hint="Sistem akan mengirim peringatan jika penggunaan API bulan ini melebihi nominal ini."
                                />

                                <div className="flex items-start gap-4 p-4 border rounded-xl border-gray-100 bg-gray-50/50 mt-4">
                                    <input type="checkbox" id="a1" checked={data.ai_translate_auto} onChange={e => setData('ai_translate_auto', e.target.checked)} className="mt-1 rounded border-gray-300 text-primary-navy focus:ring-primary-navy" />
                                    <div>
                                        <label htmlFor="a1" className="font-medium text-gray-900 block select-none">Auto-Translate via Background Job</label>
                                        <p className="text-sm text-gray-500 mt-1">Setiap kali artikel atau jurusan disimpan, otomatis masukkan antrean queue (Redis) untuk terjemahan ke bahasa Inggris.</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
