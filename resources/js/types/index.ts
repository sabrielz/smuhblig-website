export interface User {
    id: number;
    name: string;
    email: string;
    avatar: string | null;
    is_active: boolean;
    last_login_at: string | null;
    role?: string;
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
