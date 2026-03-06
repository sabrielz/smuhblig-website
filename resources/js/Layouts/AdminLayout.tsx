import { Head } from '@inertiajs/react';
import React, { useState } from 'react';
import AdminSidebar from '@/Components/Admin/AdminSidebar';
import AdminTopbar from '@/Components/Admin/AdminTopbar';
import { GlobalToast } from '@/Components/UI/GlobalToast';

interface AdminLayoutProps {
    children: React.ReactNode;
    title: string;
}

export default function AdminLayout({ children, title }: AdminLayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-neutral-50 flex font-sans text-neutral-900">
            <Head title={`${title} - CMS Admin SMK Muh Bligo`} />
            <GlobalToast />

            <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            {/* Main content wrapper */}
            <div className="flex-1 flex flex-col lg:ml-[240px] min-h-screen overflow-hidden">
                <AdminTopbar title={title} onMenuClick={() => setIsSidebarOpen(true)} />

                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-neutral-50 px-4 sm:px-6 lg:px-8 py-6 custom-scrollbar">
                    <div className="w-full max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
