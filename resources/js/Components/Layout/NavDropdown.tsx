import React, { useState, useRef, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

export interface NavChildItem {
    labelKey: string;
    href: string;
}

export interface NavDropdownProps {
    labelKey: string;
    items: NavChildItem[];
    currentPath: string;
    isScrolled: boolean;
}

export function NavDropdown({
    labelKey,
    items,
    currentPath,
    isScrolled,
}: NavDropdownProps) {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    const isChildActive = items.some((item) =>
        item.href === '/' ? currentPath === '/' : currentPath.startsWith(item.href)
    );

    // Toggle dropdown
    const handleToggle = () => {
        setIsOpen((prev) => !prev);
    };

    // Keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
            e.preventDefault();
            setIsOpen(true);
            setTimeout(() => {
                const firstLink = menuRef.current?.querySelector('a');
                firstLink?.focus();
            }, 50);
        } else if (e.key === 'Escape' && isOpen) {
            e.preventDefault();
            setIsOpen(false);
            triggerRef.current?.focus();
        }
    };

    const handleMenuKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Escape') {
            e.preventDefault();
            setIsOpen(false);
            triggerRef.current?.focus();
        } else if (e.key === 'Tab') {
            const links = menuRef.current?.querySelectorAll('a');
            if (links && links.length > 0) {
                const lastLink = links[links.length - 1];
                if (e.shiftKey && document.activeElement === links[0]) {
                    setIsOpen(false);
                } else if (!e.shiftKey && document.activeElement === lastLink) {
                    setIsOpen(false);
                }
            }
        }
    };

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(e.target as Node) &&
                triggerRef.current &&
                !triggerRef.current.contains(e.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div
            className="relative"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
            onKeyDown={handleMenuKeyDown}
        >
            <button
                ref={triggerRef}
                type="button"
                onClick={handleToggle}
                onKeyDown={handleKeyDown}
                aria-expanded={isOpen}
                aria-haspopup="true"
                className={cn(
                    'group relative inline-flex items-center gap-1 py-1 text-sm font-medium transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 rounded-md px-1',
                    isChildActive
                        ? isScrolled
                            ? 'text-primary-600 font-semibold'
                            : 'text-white font-semibold'
                        : isScrolled
                            ? 'text-neutral-700 hover:text-primary-600'
                            : 'text-white/80 hover:text-white'
                )}
            >
                <span>{t(labelKey)}</span>
                <ChevronDown
                    className={cn(
                        'w-4 h-4 transition-transform duration-200',
                        isOpen ? 'rotate-180' : 'rotate-0'
                    )}
                />
                {isChildActive && (
                    <span
                        className={cn(
                            'absolute bottom-0 left-1 right-1 h-0.5 rounded-full',
                            isScrolled ? 'bg-primary-600' : 'bg-gold-500'
                        )}
                        aria-hidden="true"
                    />
                )}
            </button>

            {isOpen && (
                <div
                    ref={menuRef}
                    role="menu"
                    aria-orientation="vertical"
                    className="absolute left-0 mt-2 w-56 rounded-2xl bg-white shadow-xl border border-neutral-100 py-2 z-50 focus:outline-none transition-all duration-200"
                >
                    {items.map((item) => {
                        const active =
                            item.href === '/' ? currentPath === '/' : currentPath.startsWith(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                role="menuitem"
                                tabIndex={0}
                                onClick={() => setIsOpen(false)}
                                className={cn(
                                    'flex items-center justify-between px-4 py-2.5 text-sm transition-colors duration-150',
                                    active
                                        ? 'bg-primary-50 text-primary-700 font-semibold'
                                        : 'text-neutral-700 hover:bg-neutral-50 hover:text-primary-600'
                                )}
                            >
                                <span>{t(item.labelKey)}</span>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default NavDropdown;
