import { Bell } from 'lucide-react';
import { usePage } from '@inertiajs/react';
import { SharedProps } from '@/types';

interface AdminTopbarProps {
    title: string;
}

export default function AdminTopbar({ title }: AdminTopbarProps) {
    const { props } = usePage<SharedProps>();
    const user = props.auth.user;

    return (
        <header className="h-16 bg-white border-b border-neutral-200 sticky top-0 z-10 w-full">
            <div className="flex items-center justify-between h-full px-6 max-w-7xl mx-auto w-full">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-semibold text-neutral-800 tracking-tight">{title}</h1>
                </div>

                <div className="flex items-center gap-6">
                    <button type="button" className="relative text-neutral-500 hover:text-neutral-800 transition-colors">
                        <Bell className="w-5 h-5" strokeWidth={1.5} />
                        <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                    </button>

                    <div className="flex items-center gap-3 border-l border-neutral-200 pl-6 cursor-pointer hover:bg-neutral-50 p-2 -mr-2 rounded-lg transition-colors">
                        <div className="flex flex-col text-right">
                            <span className="text-sm font-medium text-neutral-800">{user?.name || 'Admin'}</span>
                            <span className="text-xs text-neutral-500 capitalize">{user?.role || 'Admin'}</span>
                        </div>
                        {user?.avatar_url ? (
                            <img src={user.avatar_url} alt={user.name} className="w-9 h-9 rounded-full object-cover ring-2 ring-neutral-100" />
                        ) : (
                            <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center ring-2 ring-neutral-100">
                                <span className="text-primary-700 font-medium">{user?.name?.charAt(0) || 'A'}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
