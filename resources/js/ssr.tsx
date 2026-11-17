import { createInertiaApp } from '@inertiajs/react';
import createServer from '@inertiajs/react/server';
import ReactDOMServer from 'react-dom/server';
import { route as ziggyRoute } from 'ziggy-js';
import i18n from './i18n';

// Global route helper untuk SSR
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).route = (name: string, params?: Record<string, unknown>, absolute?: boolean, customZiggy?: any) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ziggyConfig = customZiggy || (globalThis as any).Ziggy;
    return ziggyRoute(name, params, absolute, ziggyConfig);
};

createServer((page) =>
    createInertiaApp({
        page,
        render: ReactDOMServer.renderToString,
        title: (title) => (title ? `${title} — SMK Muhammadiyah Bligo` : 'SMK Muhammadiyah Bligo'),
        resolve: (name) => {
            const pages = import.meta.glob('./Pages/**/*.tsx', { eager: true }) as Record<
                string,
                { default: React.ComponentType }
            >;
            const component = pages[`./Pages/${name}.tsx`];
            if (!component) {
                throw new Error(`Page not found: ${name}`);
            }
            return component;
        },
        setup: ({ App, props }) => {
            // Set shared Ziggy config dari props jika tersedia
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const ziggyProp = (props.initialPage.props as any)?.ziggy;
            if (ziggyProp) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (globalThis as any).Ziggy = ziggyProp;
            }

            // Inisialisasi bahasa dari initial shared props jika tersedia
            const initialLocale = (props.initialPage.props as { locale?: string })?.locale;
            if (initialLocale && i18n.language !== initialLocale) {
                void i18n.changeLanguage(initialLocale);
            }

            return <App {...props} />;
        },
    }),
);
