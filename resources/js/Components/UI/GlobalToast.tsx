import { Toaster } from 'react-hot-toast';

export function GlobalToast() {
    return (
        <Toaster
            position="top-right"
            toastOptions={{
                className: 'font-sans text-sm rounded-xl shadow-lg border border-neutral-100',
                style: {
                    background: 'var(--color-neutral-0)',
                    color: 'var(--color-neutral-900)',
                    padding: '16px',
                },
                success: {
                    iconTheme: {
                        primary: 'var(--color-success)',
                        secondary: 'var(--color-neutral-0)',
                    },
                },
                error: {
                    iconTheme: {
                        primary: 'var(--color-error)',
                        secondary: 'var(--color-neutral-0)',
                    },
                },
            }}
        />
    );
}
