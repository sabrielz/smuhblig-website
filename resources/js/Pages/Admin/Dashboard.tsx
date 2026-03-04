import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <AdminLayout title="Dashboard">
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-8 h-[400px] flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-neutral-800 mb-2">Selamat Datang di CMS</h2>
                    <p className="text-neutral-500">Pilih menu di samping untuk mulai mengelola website Anda.</p>
                </div>
            </div>
        </AdminLayout>
    );
}
