import { Link } from '@inertiajs/react';
import { Button } from '@/Components/UI/Button';
import { Save, Send, ArrowLeft, ExternalLink } from 'lucide-react';

interface ArticleHeaderProps {
    isEdit: boolean;
    articleId?: number;
    status: string;
    processing: boolean;
    onSubmit: (statusToSave?: string) => void;
}

export default function ArticleHeader({
    isEdit,
    articleId,
    status,
    processing,
    onSubmit,
}: ArticleHeaderProps) {
    return (
        <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <Link href={route('admin.artikel.index')}>
                    <Button variant="ghost" className="px-2">
                        <ArrowLeft className="w-5 h-5 text-neutral-500" />
                    </Button>
                </Link>
                <h1 className="text-2xl font-bold text-neutral-900">
                    {isEdit ? 'Edit Artikel' : 'Tulis Artikel Baru'}
                </h1>
            </div>

            <div className="flex items-center gap-3">
                {isEdit && articleId && (
                    <a href={route('admin.artikel.preview', { artikel: articleId })} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" type="button">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Pratinjau
                        </Button>
                    </a>
                )}
                <Button variant="outline" onClick={() => onSubmit('draft')} disabled={processing}>
                    <Save className="w-4 h-4 mr-2" />
                    Simpan Draft
                </Button>
                <Button variant="primary" onClick={() => onSubmit(status === 'draft' ? 'published' : status)} disabled={processing}>
                    <Send className="w-4 h-4 mr-2" />
                    {status === 'published' ? 'Simpan' : 'Publish'}
                </Button>
            </div>
        </div>
    );
}
