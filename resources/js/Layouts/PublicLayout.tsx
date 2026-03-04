import { Head } from '@inertiajs/react';
import Navbar from '@/Components/Layout/Navbar';
import Footer from '@/Components/Layout/Footer';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
interface PublicLayoutProps {
    children: React.ReactNode;
    seoTitle?: string;
    seoDescription?: string;
    seoImage?: string;
}

// ---------------------------------------------------------------------------
// PublicLayout
// ---------------------------------------------------------------------------
export default function PublicLayout({
    children,
    seoTitle,
    seoDescription,
    seoImage,
}: PublicLayoutProps) {
    const appName = 'SMK Muhammadiyah Bligo';
    const pageTitle = seoTitle ? `${seoTitle} — ${appName}` : appName;

    return (
        <>
            {/* ── SEO Head tags ── */}
            <Head>
                {seoTitle && <title>{pageTitle}</title>}

                {seoDescription && (
                    <meta name="description" content={seoDescription} />
                )}

                {/* Open Graph */}
                <meta property="og:site_name" content={appName} />
                {seoTitle && <meta property="og:title" content={pageTitle} />}
                {seoDescription && (
                    <meta property="og:description" content={seoDescription} />
                )}
                {seoImage && <meta property="og:image" content={seoImage} />}
                <meta property="og:type" content="website" />

                {/* Twitter Card */}
                <meta name="twitter:card" content="summary_large_image" />
                {seoTitle && <meta name="twitter:title" content={pageTitle} />}
                {seoDescription && (
                    <meta name="twitter:description" content={seoDescription} />
                )}
                {seoImage && <meta name="twitter:image" content={seoImage} />}
            </Head>

            {/* ── Layout shell ── */}
            <div className="flex min-h-screen flex-col">
                <Navbar />
                <main className="flex-1">{children}</main>
                <Footer />
            </div>
        </>
    );
}
