import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { cn } from '@/lib/utils';
import { cardHover } from '@/lib/motion';

interface JurusanCardProps {
    jurusan: {
        kode: string;
        slug: string;
        nama: string;
        tagline: string;
        color_start: string;
        color_end: string;
        icon_name: string;
    };
    className?: string;
}

export function JurusanCard({ jurusan, className }: JurusanCardProps) {
    // Resolve Lucide icon
    const IconComponent = (Icons[jurusan.icon_name as keyof typeof Icons] || Icons.GraduationCap) as React.ElementType;

    return (
        <motion.div
            whileHover={{ y: -6, transition: { duration: 0.25, ease: 'easeOut' } }}
            className={cn(
                "relative group overflow-hidden rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 bg-[#001f4d]",
                className
            )}
            style={
                jurusan.color_start && jurusan.color_end
                    ? { backgroundImage: `linear-gradient(135deg, ${jurusan.color_start} 0%, ${jurusan.color_end} 100%)` }
                    : undefined
            }
        >
            <Link href={`/jurusan/${jurusan.slug}`} className="block p-8 h-full">
                {/* Background Pattern / Glow (Optional) */}
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-colors duration-500" />

                {/* Icon */}
                <div className="mb-12 relative">
                    <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/20 group-hover:scale-110 transition-transform duration-300">
                        <IconComponent className="w-8 h-8 text-white/90" strokeWidth={1.5} />
                    </div>
                </div>

                {/* Content */}
                <div className="relative">
                    <span className="block text-white/60 text-sm font-mono uppercase tracking-widest mb-3">
                        {jurusan.kode}
                    </span>
                    <h3 className="text-white font-bold text-xl tracking-tight mb-2 pr-8 leading-tight">
                        {jurusan.nama}
                    </h3>
                    <p className="text-white/80 text-sm leading-relaxed max-w-[90%]">
                        {jurusan.tagline}
                    </p>
                </div>

                {/* Bottom Action Icon */}
                <div className="absolute bottom-8 right-8 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:bg-white/20 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                    <Icons.ArrowRight className="w-5 h-5 text-white" strokeWidth={1.5} />
                </div>
            </Link>
        </motion.div>
    );
}
