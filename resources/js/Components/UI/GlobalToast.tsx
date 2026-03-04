import { Toaster } from 'react-hot-toast';

export function GlobalToast() {
    return (
        <Toaster
            position="top-right"
            toastOptions={{
                className: 'font-sans text-sm rounded-xl shadow-lg border border-neutral-100',
                style: {
                    background: '#ffffff',
                    color: '#111111',
                    padding: '16px',
                },
                success: {
                    iconTheme: {
                        primary: '#30d158',
                        secondary: '#ffffff',
                    },
                },
                error: {
                    iconTheme: {
                        primary: '#ff453a',
                        secondary: '#ffffff',
                    },
                },
            }}
        />
    );
}
