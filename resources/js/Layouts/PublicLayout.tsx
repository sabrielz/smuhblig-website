import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import parse from 'html-react-parser';
import Navbar from '@/Components/Layout/Navbar';
import Footer from '@/Components/Layout/Footer';
import { GlobalToast } from '@/Components/UI/GlobalToast';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
interface PublicLayoutProps {
    children: React.ReactNode;
}

// ---------------------------------------------------------------------------
// PublicLayout
// ---------------------------------------------------------------------------
export default function PublicLayout({ children }: PublicLayoutProps) {
    const { seo, pengaturan, url } = usePage<any>().props;
    const { url: currentUrl } = usePage();
    const currentPath = currentUrl.split('?')[0];

    // Structured Data (JSON-LD)
    const baseUrl = 'https://smkmuhbligo.sch.id';
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'EducationalOrganization',
        name: pengaturan?.site_name || 'SMK Muhammadiyah Bligo',
        url: baseUrl,
        description: pengaturan?.site_tagline || 'Mencetak Generasi Unggul dan Berakhlak',
        address: {
            '@type': 'PostalAddress',
            streetAddress: pengaturan?.site_address || 'Jl. Raya Bligo',
            addressLocality: 'Pekalongan',
            addressRegion: 'Jawa Tengah',
            addressCountry: 'ID',
        },
    };

    return (
        <>
            {/* ── SEO Head tags ── */}
            <Head>
                {/* Parse SEO tags dynamically from Artesaos SEOTools, filtering out raw text nodes like newlines */}
                {seo ? (
                    (() => {
                        const parsed = parse(seo);
                        const elements = Array.isArray(parsed) ? parsed : [parsed];
                        return elements.filter(React.isValidElement);
                    })()
                ) : (
                    <title>{pengaturan?.site_name || 'SMK Muhammadiyah Bligo'}</title>
                )}
                <link rel="alternate" hrefLang="id" href={`${baseUrl}${currentPath}?lang=id`} />
                <link rel="alternate" hrefLang="en" href={`${baseUrl}${currentPath}?lang=en`} />
                <script type="application/ld+json">
                    {JSON.stringify(jsonLd)}
                </script>
            </Head>

            {/* ── Layout shell ── */}
            <div className="flex min-h-screen flex-col">
                <GlobalToast />
                <Navbar />
                <main className="flex-1">{children}</main>
                <Footer />
            </div>
        </>
    );
}
