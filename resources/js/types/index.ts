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
