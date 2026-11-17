import { createInertiaApp, router } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import { route as ziggyRoute } from 'ziggy-js';
import i18n from './i18n';

// ---------------------------------------------------------------------------
// Ziggy route() helper — reads from window.Ziggy injected by @routes blade
// ---------------------------------------------------------------------------
declare global {
    interface Window {
        Ziggy: Record<string, unknown>;
    }
    function route(name: string, params?: Record<string, unknown>, absolute?: boolean): string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).route = (name: string, params?: Record<string, unknown>, absolute?: boolean) =>
    ziggyRoute(name, params, absolute, window.Ziggy as any);

// ---------------------------------------------------------------------------
// Inertia App Bootstrap
// ---------------------------------------------------------------------------
createInertiaApp({
    title: (title) => (title ? `${title} — SMK Muhammadiyah Bligo` : 'SMK Muhammadiyah Bligo'),

    resolve: (name) => {
        const pages = import.meta.glob('./Pages/**/*.tsx', { eager: true }) as Record<
            string,
            { default: React.ComponentType }
        >;
        const page = pages[`./Pages/${name}.tsx`];
        if (!page) {
            throw new Error(`Page not found: ${name}`);
        }
        return page;
    },

    setup({ el, App, props }) {
        // Inisialisasi bahasa dari initial shared props jika tersedia
        const initialLocale = (props.initialPage.props as { locale?: string })?.locale;
        if (initialLocale && i18n.language !== initialLocale) {
            void i18n.changeLanguage(initialLocale);
        }

        // Sinkronisasi bahasa setiap navigasi Inertia
        router.on('navigate', (event) => {
            const currentLocale = (event.detail.page.props as { locale?: string })?.locale;
            if (currentLocale && i18n.language !== currentLocale) {
                void i18n.changeLanguage(currentLocale);
            }
        });

        createRoot(el).render(<App {...props} />);
    },

    progress: {
        color: '#003f87',
        showSpinner: true,
    },
});
