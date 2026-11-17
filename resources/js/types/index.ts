export interface UserCan {
    kelola_galeri: boolean;
    kelola_pengumuman: boolean;
    kelola_agenda: boolean;
    publish_artikel: boolean;
    hapus_artikel: boolean;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar: string | null;
    avatar_url: string;
    is_active: boolean;
    last_login_at: string | null;
    role?: string | null;
    roles: string[];
    permissions: string[];
    is_admin: boolean;
    is_editor: boolean;
    is_author: boolean;
    can: UserCan;
    artikel_status_options: string[];
    created_at: string;
    updated_at: string;
}

export interface Pengaturan {
    site_name: string;
    site_tagline: string;
    site_email: string;
    site_phone: string;
    site_address: string;
    site_logo: string | null;
    site_favicon: string | null;
    artikel_approval: boolean;
    artikel_ai_enabled: boolean;
    multibahasa_enabled: boolean;
    sosial_instagram: string;
    sosial_youtube: string;
    sosial_facebook: string;
    sosial_tiktok: string;
    seo_meta_description: string;
    seo_google_analytics: string;
    ai_provider: string;
    ai_translate_auto: boolean;
    spmb_url: string;
}

export interface FlashMessages {
    success?: string;
    error?: string;
    warning?: string;
    info?: string;
}

export interface SharedProps {
    locale: string;
    availableLocales: string[];
    auth: {
        user: User | null;
    };
    pengaturan: Pengaturan;
    flash: FlashMessages;
    notifikasi_count: number;
    pesan_baru_count: number;
    seo?: string;
    csp_nonce?: string;
    [key: string]: unknown;
}

export interface PaginatedData<T> {
    data: T[];
    links: {
        first: string | null;
        last: string | null;
        prev: string | null;
        next: string | null;
    };
    meta: {
        current_page: number;
        from: number | null;
        last_page: number;
        path: string;
        per_page: number;
        to: number | null;
        total: number;
    };
}

export interface Article {
    id: number;
    slug: string;
    title: string;
    excerpt: string | null;
    content: string;
    status: 'draft' | 'pending_review' | 'published' | 'archived';
    is_featured: boolean;
    view_count: number;
    published_at: string | null;
    meta_title: string | null;
    meta_description: string | null;
    og_image: string | null;
    thumbnail: string | null;
    author: Pick<User, 'id' | 'name' | 'avatar'> | null;
    category: Category | null;
    tags: Tag[];
    has_english: boolean;
    created_at: string;
    updated_at: string;
}

export interface Category {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    color: string;
    is_active: boolean;
    sort_order?: number;
    articles_count?: number;
    translations?: {
        id?: { name: string; description: string | null };
        en?: { name: string; description: string | null };
    };
}

export interface Tag {
    id: number;
    name: string;
    slug: string;
}

export interface Jurusan {
    id: number;
    kode: string;
    slug: string;
    nama: string;
    tagline: string | null;
    deskripsi_singkat: string | null;
    deskripsi_lengkap: string | null;
    kompetensi: string[] | null;
    prospek_karir: string[] | null;
    fasilitas: string[] | null;
    color_start: string;
    color_end: string;
    icon_name: string | null;
    cover_image: string | null;
    is_active: boolean;
}

export interface Galeri {
    id: number;
    slug: string;
    judul: string;
    deskripsi: string | null;
    event_date: string | null;
    is_featured: boolean;
    is_active: boolean;
    photos: MediaItem[];
}

export interface MediaItem {
    id: number;
    url: string;
    thumbnail: string;
    name: string;
    caption: string | null;
}

export interface Tautan {
    id: number;
    label: string;
    url: string;
    deskripsi: string | null;
    icon_name: string | null;
    kategori: string | null;
    is_active: boolean;
    buka_tab_baru: boolean;
}

export interface Pengumuman {
    id: number;
    slug: string;
    judul: string;
    konten: string;
    tipe: 'info' | 'penting' | 'urgent';
    tanggal_mulai: string | null;
    tanggal_selesai: string | null;
    is_active: boolean;
}

export interface AiJob {
    id: number;
    job_type: 'generate' | 'revise' | 'translate' | 'seo';
    status: 'pending' | 'processing' | 'done' | 'failed';
    output: string | null;
    error_message: string | null;
    tokens_used: number | null;
    duration_ms: number | null;
    created_at: string;
}

export interface NotifikasiAdmin {
    id: number;
    tipe: 'artikel_pending' | 'pesan_kontak' | 'ai_selesai' | string;
    judul: string;
    pesan: string | null;
    url: string | null;
    dibaca: boolean;
    dibaca_at: string | null;
    created_at: string;
}

export interface PesanKontak {
    id: number;
    nama: string;
    email: string;
    nomor_telepon: string | null;
    subjek: string;
    pesan: string;
    status: 'baru' | 'dibaca' | 'dibalas' | 'diarsip';
    ip_address: string | null;
    user_agent: string | null;
    dibaca_at: string | null;
    dibaca_oleh: string | null;
    created_at: string;
}

export interface Guru {
    id: number;
    nama: string;
    nama_lengkap: string;
    gelar_depan: string | null;
    gelar_belakang: string | null;
    kelompok: 'guru' | 'tendik';
    jurusan_id: number | null;
    jurusan?: {
        id: number;
        nama: string;
        slug: string;
    } | null;
    urutan: number;
    is_active: boolean;
    foto_url: string | null;
    translations: {
        id: {
            jabatan: string;
            mapel: string | null;
        };
        en: {
            jabatan: string;
            mapel: string | null;
        };
    };
    created_at?: string;
}

export interface FasilitasMedia {
    id: number;
    url: string;
    thumb_url: string;
    file_name: string;
    size: number;
}

export interface Fasilitas {
    id: number;
    slug: string;
    kategori: 'ruang_praktik' | 'umum' | 'olahraga' | 'ibadah';
    urutan: number;
    is_active: boolean;
    media: FasilitasMedia[];
    cover_url: string | null;
    translations: {
        id: {
            nama: string;
            deskripsi: string | null;
        };
        en: {
            nama: string | null;
            deskripsi: string | null;
        };
    };
    created_at?: string;
}

export interface Ekstrakurikuler {
    id: number;
    slug: string;
    pembina_guru_id: number | null;
    pembina?: {
        id: number;
        nama: string;
        nama_lengkap: string;
    } | null;
    urutan: number;
    is_active: boolean;
    foto_url: string | null;
    translations: {
        id: {
            nama: string;
            deskripsi: string | null;
            jadwal: string | null;
        };
        en: {
            nama: string | null;
            deskripsi: string | null;
            jadwal: string | null;
        };
    };
    created_at?: string;
}

export interface Prestasi {
    id: number;
    slug: string;
    tingkat: 'sekolah' | 'kabupaten' | 'provinsi' | 'nasional' | 'internasional';
    tingkat_label?: string;
    kategori: 'akademik' | 'non_akademik';
    kategori_label?: string;
    tahun: number;
    tanggal: string | null;
    jurusan_id: number | null;
    jurusan?: {
        id: number;
        nama: string;
        slug: string;
    } | null;
    is_active: boolean;
    foto_url: string | null;
    translations: {
        id: {
            judul: string;
            ringkasan: string | null;
        };
        en: {
            judul: string | null;
            ringkasan: string | null;
        };
    };
    created_at?: string;
}

export interface UnduhanFile {
    id: number;
    file_name: string;
    mime_type: string;
    extension: string;
    size: number;
    human_size: string;
}

export interface Unduhan {
    id: number;
    slug: string;
    kategori: 'brosur' | 'kalender' | 'formulir' | 'sk' | 'lainnya';
    tanggal_terbit: string | null;
    jumlah_unduh: number;
    is_active: boolean;
    file?: UnduhanFile | null;
    translations: {
        id: {
            judul: string;
            deskripsi: string | null;
        };
        en: {
            judul: string | null;
            deskripsi: string | null;
        };
    };
    judul?: string;
    deskripsi?: string | null;
    created_at?: string;
    updated_at?: string;
}

export interface Faq {
    id: number;
    kategori: 'umum' | 'pendaftaran' | 'akademik' | 'fasilitas';
    urutan: number;
    is_active: boolean;
    translations: {
        id: {
            pertanyaan: string;
            jawaban: string;
        };
        en: {
            pertanyaan: string | null;
            jawaban: string | null;
        };
    };
    pertanyaan?: string;
    jawaban?: string;
    created_at?: string;
    updated_at?: string;
}

export interface Testimoni {
    id: number;
    nama: string;
    peran: 'alumni' | 'orang_tua' | 'mitra';
    keterangan: string;
    persetujuan_tampil: boolean;
    is_active: boolean;
    urutan: number;
    foto_url: string | null;
    translations: {
        id: {
            kutipan: string;
        };
        en: {
            kutipan: string | null;
        };
    };
    kutipan?: string;
    created_at?: string;
    updated_at?: string;
}

export interface Mitra {
    id: number;
    nama: string;
    bidang: string;
    url: string | null;
    urutan: number;
    is_active: boolean;
    logo_url: string | null;
    jurusan_ids?: number[];
    jurusans?: Array<{
        id: number;
        kode: string;
        nama: string;
    }>;
    created_at?: string;
    updated_at?: string;
}

export interface VideoItem {
    id: number;
    youtube_id: string;
    thumbnail_url: string;
    watch_url: string;
    galeri_id: number | null;
    galeri?: {
        id: number;
        judul: string;
    } | null;
    urutan: number;
    is_active: boolean;
    translations: {
        id: {
            judul: string;
        };
        en: {
            judul: string | null;
        };
    };
    judul?: string;
    created_at?: string;
    updated_at?: string;
}
