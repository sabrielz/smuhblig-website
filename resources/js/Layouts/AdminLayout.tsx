import { Head } from '@inertiajs/react';
import React from 'react';
import AdminSidebar from '@/Components/Admin/AdminSidebar';
import AdminTopbar from '@/Components/Admin/AdminTopbar';

interface AdminLayoutProps {
    children: React.ReactNode;
    title: string;
}

export default function AdminLayout({ children, title }: AdminLayoutProps) {
    return (
        <div className="min-h-screen bg-neutral-50 flex font-sans text-neutral-900">
            <Head title={`${title} - CMS Admin SMK Muh Bligo`} />

            <AdminSidebar />

            {/* Main content wrapper */}
            <div className="flex-1 flex flex-col ml-[240px] min-h-screen overflow-hidden">
                <AdminTopbar title={title} />

                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-neutral-50 p-6 custom-scrollbar">
                    <div className="w-full max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
