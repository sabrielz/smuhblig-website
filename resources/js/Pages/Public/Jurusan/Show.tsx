import { Head } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import JurusanHero, { type JurusanData } from '@/Components/Public/Jurusan/JurusanHero';
import JurusanOverview from '@/Components/Public/Jurusan/JurusanOverview';
import JurusanFeatures from '@/Components/Public/Jurusan/JurusanFeatures';
import JurusanGallery from '@/Components/Public/Jurusan/JurusanGallery';
import JurusanOthers from '@/Components/Public/Jurusan/JurusanOthers';

interface Props {
    jurusan: { data: JurusanData };
    jurusanLain: JurusanData[];
    pengaturan: {
        spmb_url: string;
    };
    jsonLd?: Record<string, any>[];
}

export default function JurusanShow({ jurusan: response, jurusanLain, pengaturan, jsonLd }: Props) {
    const jurusan = response.data;
    const spmbUrl = pengaturan.spmb_url && pengaturan.spmb_url !== '#' ? pengaturan.spmb_url : '/kontak';

    return (
        <PublicLayout jsonLd={jsonLd}>
            <Head>
                <title>{`${jurusan.nama} - SMK Muhammadiyah Bligo`}</title>
            </Head>

            {/* SECTION 1: HERO JURUSAN */}
            <JurusanHero jurusan={jurusan} spmbUrl={spmbUrl} />

            {/* SECTION 2: OVERVIEW */}
            <JurusanOverview jurusan={jurusan} />

            {/* SECTION 3, 4, 5: KOMPETENSI, KARIR, FASILITAS */}
            <JurusanFeatures jurusan={jurusan} />

            {/* SECTION 6: GALERI FOTO */}
            <JurusanGallery images={jurusan.gallery_images} />

            {/* SECTION 7: MITRA, JURUSAN LAIN & FINAL CTA */}
            <JurusanOthers jurusan={jurusan} jurusanLain={jurusanLain} spmbUrl={spmbUrl} />
        </PublicLayout>
    );
}
