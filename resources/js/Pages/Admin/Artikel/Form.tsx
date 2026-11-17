import { useState, useCallback } from 'react';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { AiToolbar } from '@/Components/Editor/AiToolbar';
import { AiBubble } from '@/Components/Editor/AiBubble';
import { AiPanel } from '@/Components/Editor/AiPanel';
import ArticleHeader from '@/Components/Admin/Artikel/ArticleHeader';
import ArticleEditorCard from '@/Components/Admin/Artikel/ArticleEditorCard';
import ArticleSidebar from '@/Components/Admin/Artikel/ArticleSidebar';
import LanguageTabs from '@/Components/Admin/Artikel/LanguageTabs';
import { useArticleAi } from '@/Components/Admin/Artikel/useArticleAi';
import { toast } from 'react-hot-toast';
import type { Editor } from '@tiptap/react';
import type { AiPanelMode } from '@/Components/Editor/AiPanel';
import type { SeoAnalysisResult } from '@/Components/Editor/SeoPanel';
import type { TranslationStatus } from '@/Components/Editor/AiStatusBadge';
import { SharedProps } from '@/types';

interface ArticleData {
    id: number;
    category_id: string | number;
    status: string;
    published_at: string | null;
    meta_title: string | null;
    meta_description: string | null;
    thumbnail_url: string | null;
    title_id: string;
    excerpt_id: string | null;
    content_id: string;
    title_en: string | null;
    excerpt_en: string | null;
    content_en: string | null;
    en_ai_translated?: boolean;
    en_reviewed?: boolean;
    tags?: string[];
    revisions?: import('@/types').ArticleRevisionItem[];
    catatan_review?: string | null;
}

interface Props {
    article: ArticleData | null;
    categories: Array<{ id: number; name: string; color: string }>;
}

export default function Form({ article, categories }: Props) {
    const { auth, pengaturan } = usePage<SharedProps>().props;
    const aiEnabled = pengaturan?.artikel_ai_enabled ?? true;
    const multibahasaEnabled = pengaturan?.multibahasa_enabled ?? true;
    const allowedStatuses = auth.user?.artikel_status_options ?? ['draft', 'pending_review'];
    const isEdit = !!article;
    const [activeTab, setActiveTab] = useState<'id' | 'en'>('id');

    const { data, setData, post, processing, errors } = useForm({
        _method: isEdit ? 'put' : 'post',
        category_id: article?.category_id?.toString() ?? '',
        status: article?.status ?? 'draft',
        published_at: article?.published_at ? article.published_at.slice(0, 16) : '',
        meta_title: article?.meta_title ?? '',
        meta_description: article?.meta_description ?? '',
        thumbnail: null as File | null,
        title_id: article?.title_id ?? '',
        excerpt_id: article?.excerpt_id ?? '',
        content_id: article?.content_id ?? '',
        title_en: article?.title_en ?? '',
        excerpt_en: article?.excerpt_en ?? '',
        content_en: article?.content_en ?? '',
        tags: (article?.tags ?? []) as string[],
    });

    const [enTranslationStatus, setEnTranslationStatus] = useState<TranslationStatus>(
        article?.en_reviewed ? 'reviewed' : article?.en_ai_translated ? 'ai_translated' : null,
    );
    const [isMarkingReviewed, setIsMarkingReviewed] = useState(false);
    const [editorId, setEditorId] = useState<Editor | null>(null);

    const [generateJobId, setGenerateJobId] = useState<string | null>(null);
    const [correctJobId, setCorrectJobId] = useState<string | null>(null);
    const [translateJobId, setTranslateJobId] = useState<string | null>(null);
    const [seoJobId, setSeoJobId] = useState<string | null>(null);
    const [revisionJobId, setRevisionJobId] = useState<string | null>(null);

    const [panelOpen, setPanelOpen] = useState(false);
    const [panelMode, setPanelMode] = useState<AiPanelMode>('generate');
    const [panelSummary, setPanelSummary] = useState<string | undefined>(undefined);
    const [seoResult, setSeoResult] = useState<SeoAnalysisResult | null>(null);

    const {
        generateJob,
        correctJob,
        translateJob,
        seoJob,
        revisionJob,
        isAnyLoading,
        handleGenerate,
        handleCorrect,
        handleSeoAnalyze,
        handleTranslate,
        handleRevise,
        handleApplyRevision,
        handleDiscardRevision,
    } = useArticleAi({
        activeTab,
        titleId: data.title_id,
        excerptId: data.excerpt_id,
        contentId: data.content_id,
        contentEn: data.content_en ?? '',
        metaDescription: data.meta_description,
        setField: (f, v) => setData(f as any, v),
        setEnTranslationStatus,
        editorId,
        setPanelOpen,
        setPanelMode,
        setPanelSummary,
        setSeoResult,
        generateJobId,
        setGenerateJobId,
        correctJobId,
        setCorrectJobId,
        translateJobId,
        setTranslateJobId,
        seoJobId,
        setSeoJobId,
        revisionJobId,
        setRevisionJobId,
    });

    const handlePanelAccept = useCallback((result: string) => {
        setData((prev) => ({
            ...prev,
            [activeTab === 'id' ? 'content_id' : 'content_en']: result,
        }));
        if (panelMode === 'generate') setGenerateJobId(null);
        else setCorrectJobId(null);
        setPanelOpen(false);
        toast.success('Konten berhasil diperbarui.');
    }, [panelMode, activeTab, setData]);

    const handleMarkReviewed = useCallback(() => {
        if (!article?.id) return;
        setIsMarkingReviewed(true);
        router.patch(
            route('admin.artikel.translation.reviewed', { artikel: article.id }),
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    setEnTranslationStatus('reviewed');
                    toast.success('Terjemahan ditandai sudah direview.');
                },
                onError: () => toast.error('Gagal menandai review.'),
                onFinish: () => setIsMarkingReviewed(false),
            },
        );
    }, [article?.id]);

    const handleSubmit = (statusToSave?: string) => {
        if (statusToSave) setData('status', statusToSave);
        const url = isEdit ? route('admin.artikel.update', { artikel: article!.id }) : route('admin.artikel.store');
        post(url, {
            preserveScroll: true,
            forceFormData: true,
            onError: (err) => {
                if (Object.keys(err).length > 0) {
                    toast.error('Mohon periksa kembali form yang Anda isikan.');
                }
            },
        });
    };

    const activePanelJob = panelMode === 'generate' ? generateJob : correctJob;
    const editorEmpty = (activeTab === 'id' ? data.content_id.replace(/<[^>]*>/g, '').trim() : data.content_en?.replace(/<[^>]*>/g, '').trim() ?? '').length < 100;

    return (
        <AdminLayout title={isEdit ? 'Edit Artikel' : 'Tulis Artikel Baru'}>
            <Head title={isEdit ? 'Edit Artikel' : 'Tulis Artikel'} />

            {aiEnabled && (
                <AiPanel
                    open={panelOpen}
                    mode={panelMode}
                    isLoading={activePanelJob.isPolling}
                    result={activePanelJob.result}
                    error={activePanelJob.error}
                    summary={panelSummary}
                    onAccept={handlePanelAccept}
                    onClose={() => setPanelOpen(false)}
                    onRetry={() => {
                        if (panelMode === 'correct') void handleCorrect();
                    }}
                />
            )}

            {aiEnabled && (
                <AiBubble
                    editor={editorId}
                    onRevise={handleRevise}
                    revisionResult={revisionJob.result}
                    isRevising={revisionJob.isPolling}
                    onApply={handleApplyRevision}
                    onDiscard={handleDiscardRevision}
                />
            )}

            <ArticleHeader
                isEdit={isEdit}
                articleId={article?.id}
                status={data.status}
                processing={processing}
                onSubmit={handleSubmit}
            />

            <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-[60%] lg:w-[65%] flex flex-col gap-6">
                    {article?.catatan_review && (
                        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
                            <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                            <div className="text-xs">
                                <p className="font-bold text-amber-900">Catatan Review dari Editor:</p>
                                <p className="text-amber-800 mt-1 whitespace-pre-wrap">{article.catatan_review}</p>
                            </div>
                        </div>
                    )}

                    {multibahasaEnabled && (
                        <LanguageTabs
                            activeTab={activeTab}
                            onChangeTab={setActiveTab}
                            enStatus={enTranslationStatus}
                            isEdit={isEdit}
                            isMarkingReviewed={isMarkingReviewed}
                            onMarkReviewed={handleMarkReviewed}
                        />
                    )}

                    <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
                        {aiEnabled && (
                            <AiToolbar
                                onGenerate={(p) => void handleGenerate(p)}
                                onCorrect={() => void handleCorrect()}
                                onOpenSeo={() => document.getElementById('seo-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                                isLoading={isAnyLoading}
                                editorEmpty={editorEmpty}
                                locale={activeTab}
                            />
                        )}

                        <ArticleEditorCard
                            activeTab={activeTab}
                            data={{
                                title_id: data.title_id,
                                excerpt_id: data.excerpt_id,
                                content_id: data.content_id,
                                title_en: data.title_en ?? '',
                                excerpt_en: data.excerpt_en ?? '',
                                content_en: data.content_en ?? '',
                            }}
                            errors={errors}
                            onChange={(field, val) => setData(field as any, val)}
                            setEditorId={setEditorId}
                            aiEnabled={aiEnabled}
                            onTranslate={() => void handleTranslate()}
                            isTranslating={translateJob.isPolling}
                        />
                    </div>
                </div>

                <ArticleSidebar
                    data={{
                        status: data.status,
                        published_at: data.published_at,
                        category_id: data.category_id,
                        tags: data.tags,
                        meta_title: data.meta_title,
                        meta_description: data.meta_description,
                        title_id: data.title_id,
                        content_id: data.content_id,
                    }}
                    errors={errors}
                    allowedStatuses={allowedStatuses}
                    categories={categories}
                    thumbnailUrl={article?.thumbnail_url}
                    isEdit={isEdit}
                    articleId={article?.id}
                    revisions={article?.revisions}
                    seoResult={seoResult}
                    isSeoAnalyzing={seoJob.isPolling}
                    seoStatus={seoJob.status}
                    seoError={seoJob.error}
                    onFieldChange={(field, val) => setData(field as any, val)}
                    onAnalyzeSeo={() => void handleSeoAnalyze()}
                />
            </div>
        </AdminLayout>
    );
}
