import { Bell, Menu } from 'lucide-react';
import { usePage } from '@inertiajs/react';
import { SharedProps } from '@/types';

interface AdminTopbarProps {
    title: string;
    onMenuClick: () => void;
}

export default function AdminTopbar({ title, onMenuClick }: AdminTopbarProps) {
    const { props } = usePage<SharedProps>();
    const user = props.auth.user;

    return (
        <header className="h-16 bg-white border-b border-neutral-200 sticky top-0 z-10 w-full">
            <div className="flex items-center justify-between h-full px-4 sm:px-6 max-w-7xl mx-auto w-full gap-4">
                <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
                    <button
                        type="button"
                        onClick={onMenuClick}
                        className="lg:hidden p-2 -ml-2 text-neutral-500 hover:text-neutral-800 rounded-lg hover:bg-neutral-100 min-h-[44px] min-w-[44px] flex items-center justify-center"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <h1 className="text-lg md:text-xl font-semibold text-neutral-800 tracking-tight truncate max-w-[150px] sm:max-w-xs md:max-w-md">{title}</h1>
                </div>

                <div className="flex items-center gap-3 sm:gap-6 shrink-0">
                    <button type="button" className="relative p-2 text-neutral-500 hover:text-neutral-800 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center">
                        <Bell className="w-5 h-5" strokeWidth={1.5} />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                    </button>

                    <div className="flex items-center gap-3 sm:border-l sm:border-neutral-200 sm:pl-6 cursor-pointer hover:bg-neutral-50 p-2 sm:-mr-2 rounded-lg transition-colors">
                        <div className="hidden sm:flex flex-col text-right">
                            <span className="text-sm font-medium text-neutral-800">{user?.name || 'Admin'}</span>
                            <span className="text-xs text-neutral-500 capitalize">{user?.role || 'Admin'}</span>
                        </div>
                        {user?.avatar_url ? (
                            <img src={user.avatar_url} alt={user.name} className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover ring-2 ring-neutral-100 shrink-0" />
                        ) : (
                            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary-100 flex items-center justify-center ring-2 ring-neutral-100 shrink-0">
                                <span className="text-primary-700 font-medium">{user?.name?.charAt(0) || 'A'}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
