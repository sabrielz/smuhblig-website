import { Input } from '@/Components/UI/Input';
import { Select } from '@/Components/UI/Select';
import { ImageUpload } from '@/Components/UI/ImageUpload';
import { TagInput } from '@/Components/UI/TagInput';
import { SeoPanel } from '@/Components/Editor/SeoPanel';
import { RevisionPanel } from '@/Components/Admin/RevisionPanel';
import type { SeoAnalysisResult } from '@/Components/Editor/SeoPanel';

interface ArticleSidebarProps {
    data: {
        status: string;
        published_at: string;
        category_id: string;
        tags: string[];
        meta_title: string;
        meta_description: string;
        title_id: string;
        content_id: string;
    };
    errors: Partial<Record<string, string>>;
    allowedStatuses: string[];
    categories: Array<{ id: number; name: string; color: string }>;
    thumbnailUrl?: string | null;
    isEdit: boolean;
    articleId?: number;
    revisions?: import('@/types').ArticleRevisionItem[];
    seoResult: SeoAnalysisResult | null;
    isSeoAnalyzing: boolean;
    seoStatus: string;
    seoError: string | null;
    onFieldChange: (field: string, value: any) => void;
    onAnalyzeSeo: () => void;
}

export default function ArticleSidebar({
    data,
    errors,
    allowedStatuses,
    categories,
    thumbnailUrl,
    isEdit,
    articleId,
    revisions,
    seoResult,
    isSeoAnalyzing,
    seoStatus,
    seoError,
    onFieldChange,
    onAnalyzeSeo,
}: ArticleSidebarProps) {
    return (
        <div className="w-full md:w-[40%] lg:w-[35%] flex flex-col gap-6">
            {/* Publikasi */}
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-5 gap-4 flex flex-col">
                <h3 className="text-lg font-semibold text-neutral-900 border-b border-neutral-100 pb-3">
                    Publikasi
                </h3>

                <Select
                    label="Status"
                    value={data.status}
                    onChange={(e) => onFieldChange('status', e.target.value)}
                    options={[
                        { value: 'draft', label: 'Draft' },
                        { value: 'pending_review', label: 'Pending Review' },
                        { value: 'published', label: 'Published' },
                        { value: 'archived', label: 'Archived' },
                    ].filter((opt) => allowedStatuses.includes(opt.value))}
                    error={errors.status}
                />

                <Input
                    type="datetime-local"
                    label="Tanggal Publikasi"
                    value={data.published_at}
                    onChange={(e) => onFieldChange('published_at', e.target.value)}
                    error={errors.published_at}
                />
            </div>

            {/* Kategori */}
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-5 gap-4 flex flex-col">
                <div className="border-b border-neutral-100 pb-3">
                    <h3 className="text-lg font-semibold text-neutral-900">Kategori</h3>
                </div>

                <Select
                    value={data.category_id}
                    onChange={(e) => onFieldChange('category_id', e.target.value)}
                    options={[
                        { value: '', label: 'Pilih Kategori...' },
                        ...categories.map((c) => ({
                            value: c.id.toString(),
                            label: c.name,
                        })),
                    ]}
                    error={errors.category_id}
                    required
                />
            </div>

            {/* Tag Artikel */}
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-5 gap-3 flex flex-col">
                <div className="border-b border-neutral-100 pb-3">
                    <h3 className="text-lg font-semibold text-neutral-900">Tag Artikel</h3>
                </div>
                <TagInput
                    value={data.tags}
                    onChange={(tags) => onFieldChange('tags', tags)}
                    maxTags={10}
                    placeholder="Ketik tag lalu tekan Enter..."
                    error={errors.tags as string | undefined}
                />
            </div>

            {/* Thumbnail */}
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-5 gap-4 flex flex-col">
                <h3 className="text-lg font-semibold text-neutral-900 border-b border-neutral-100 pb-3">
                    Thumbnail
                </h3>

                <ImageUpload
                    value={thumbnailUrl ?? undefined}
                    onChange={(file) => onFieldChange('thumbnail', file)}
                    error={errors.thumbnail}
                />
                <p className="text-xs text-neutral-500 -mt-2">
                    Rasio 16:9 direkomendasikan. Maks 2MB.
                </p>
            </div>

            {/* SEO Panel — with AI analysis */}
            <div id="seo-panel">
                <SeoPanel
                    metaTitle={data.meta_title}
                    metaDescription={data.meta_description}
                    onMetaTitleChange={(val) => onFieldChange('meta_title', val)}
                    onMetaDescriptionChange={(val) => onFieldChange('meta_description', val)}
                    errors={{
                        meta_title: errors.meta_title,
                        meta_description: errors.meta_description,
                    }}
                    onAnalyze={onAnalyzeSeo}
                    isAnalyzing={isSeoAnalyzing}
                    jobStatus={isSeoAnalyzing ? 'processing' : (seoStatus as any)}
                    analysisResult={seoResult}
                    jobError={seoError}
                />
            </div>

            {/* Riwayat Revisi */}
            {isEdit && articleId && (
                <RevisionPanel
                    articleId={articleId}
                    revisions={revisions ?? []}
                    currentTitle={data.title_id}
                    currentContent={data.content_id}
                />
            )}
        </div>
    );
}
