import { useCallback, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { useAiJob } from '@/hooks/useAiJob';
import type { GenerateDraftParams } from '@/Components/Editor/AiToolbar';
import type { AiPanelMode } from '@/Components/Editor/AiPanel';
import type { SeoAnalysisResult } from '@/Components/Editor/SeoPanel';

function getCsrf(): string {
    if (typeof document === 'undefined') return '';
    return document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content ?? '';
}

async function aiPost(path: string, body: Record<string, unknown>): Promise<{ job_id: string }> {
    const res = await fetch(path, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'X-CSRF-TOKEN': getCsrf(),
        },
        body: JSON.stringify(body),
    });
    if (!res.ok) {
        const err = (await res.json().catch(() => ({}))) as { message?: string };
        throw new Error(err.message ?? 'Request gagal');
    }
    return res.json() as Promise<{ job_id: string }>;
}

interface UseArticleAiParams {
    activeTab: 'id' | 'en';
    titleId: string;
    excerptId: string;
    contentId: string;
    contentEn: string;
    metaDescription: string;
    setField: (field: string, val: any) => void;
    setEnTranslationStatus: (status: any) => void;
    editorId: any;
    setPanelOpen: (open: boolean) => void;
    setPanelMode: (mode: AiPanelMode) => void;
    setPanelSummary: (summary?: string) => void;
    setSeoResult: (res: SeoAnalysisResult | null) => void;
    generateJobId: string | null;
    setGenerateJobId: (id: string | null) => void;
    correctJobId: string | null;
    setCorrectJobId: (id: string | null) => void;
    translateJobId: string | null;
    setTranslateJobId: (id: string | null) => void;
    seoJobId: string | null;
    setSeoJobId: (id: string | null) => void;
    revisionJobId: string | null;
    setRevisionJobId: (id: string | null) => void;
}

export function useArticleAi({
    activeTab,
    titleId,
    excerptId,
    contentId,
    contentEn,
    metaDescription,
    setField,
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
}: UseArticleAiParams) {
    const generateJob = useAiJob(generateJobId);
    const correctJob = useAiJob(correctJobId);
    const translateJob = useAiJob(translateJobId);
    const seoJob = useAiJob(seoJobId);
    const revisionJob = useAiJob(revisionJobId);

    const prevSeoStatus = useRef<string | null>(null);
    if (seoJob.status === 'done' && seoJob.result && prevSeoStatus.current !== 'done') {
        prevSeoStatus.current = 'done';
        try {
            setSeoResult(JSON.parse(seoJob.result) as SeoAnalysisResult);
        } catch {
            toast.error('Gagal parse hasil analisis SEO.');
        }
    }

    const prevGenStatus = useRef<string | null>(null);
    if (generateJob.status === 'done' && generateJob.result && prevGenStatus.current !== 'done') {
        prevGenStatus.current = 'done';
        setPanelOpen(true);
    }
    if (generateJob.status === 'failed' && prevGenStatus.current !== 'failed') {
        prevGenStatus.current = 'failed';
        toast.error(generateJob.error ?? 'Generate draft gagal.');
    }

    const prevCorrectStatus = useRef<string | null>(null);
    if (correctJob.status === 'done' && correctJob.result && prevCorrectStatus.current !== 'done') {
        prevCorrectStatus.current = 'done';
        const words = correctJob.result.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).filter(Boolean).length;
        setPanelSummary(`Artikel telah diproses (${words} kata)`);
        setPanelOpen(true);
    }
    if (correctJob.status === 'failed' && prevCorrectStatus.current !== 'failed') {
        prevCorrectStatus.current = 'failed';
        toast.error(correctJob.error ?? 'Koreksi grammar gagal.');
    }

    const prevTranslateStatus = useRef<string | null>(null);
    if (translateJob.status === 'done' && translateJob.result && prevTranslateStatus.current !== 'done') {
        prevTranslateStatus.current = 'done';
        try {
            const parsed = JSON.parse(translateJob.result) as { title: string; excerpt: string; content: string };
            setField('title_en', parsed.title ?? '');
            setField('excerpt_en', parsed.excerpt ?? '');
            setField('content_en', parsed.content ?? '');
            setEnTranslationStatus('ai_translated');
            toast.success('Terjemahan AI selesai! Silakan review konten EN.');
        } catch {
            toast.error('Gagal parse hasil terjemahan.');
        }
    }
    if (translateJob.status === 'failed' && prevTranslateStatus.current !== 'failed') {
        prevTranslateStatus.current = 'failed';
        toast.error(translateJob.error ?? 'Terjemahan gagal.');
    }

    const isAnyLoading = generateJob.isPolling || correctJob.isPolling || translateJob.isPolling || seoJob.isPolling;

    const handleGenerate = useCallback(async (params: GenerateDraftParams) => {
        prevGenStatus.current = null;
        setPanelMode('generate');
        setPanelSummary(undefined);
        setPanelOpen(false);
        try {
            const { job_id } = await aiPost('/admin/ai/generate', { ...params });
            setGenerateJobId(job_id);
            setPanelOpen(true);
        } catch (err) {
            toast.error((err as Error).message ?? 'Gagal memulai generate draft.');
        }
    }, [setGenerateJobId, setPanelMode, setPanelOpen, setPanelSummary]);

    const handleCorrect = useCallback(async () => {
        prevCorrectStatus.current = null;
        const content = activeTab === 'id' ? contentId : (contentEn ?? '');
        if (!content.replace(/<[^>]*>/g, '').trim()) {
            toast.error('Tidak ada konten untuk dikoreksi.');
            return;
        }
        setPanelMode('correct');
        setPanelSummary(undefined);
        setPanelOpen(false);
        try {
            const { job_id } = await aiPost('/admin/ai/correct', { content });
            setCorrectJobId(job_id);
            setPanelOpen(true);
        } catch (err) {
            toast.error((err as Error).message ?? 'Gagal memulai koreksi grammar.');
        }
    }, [activeTab, contentId, contentEn, setCorrectJobId, setPanelMode, setPanelOpen, setPanelSummary]);

    const handleSeoAnalyze = useCallback(async () => {
        prevSeoStatus.current = null;
        setSeoResult(null);
        try {
            const { job_id } = await aiPost('/admin/ai/seo', {
                title: titleId,
                content: contentId.replace(/<[^>]+>/g, ' ').trim(),
                meta_description: metaDescription,
            });
            setSeoJobId(job_id);
        } catch (err) {
            toast.error((err as Error).message ?? 'Gagal memulai analisis SEO.');
        }
    }, [contentId, titleId, metaDescription, setSeoJobId, setSeoResult]);

    const handleTranslate = useCallback(async () => {
        prevTranslateStatus.current = null;
        if (!titleId || !contentId.replace(/<[^>]*>/g, '').trim()) {
            toast.error('Isi konten Indonesia terlebih dahulu sebelum menerjemahkan.');
            return;
        }
        try {
            const { job_id } = await aiPost('/admin/ai/translate', {
                title_id: titleId,
                content_id: contentId,
                excerpt_id: excerptId,
            });
            setTranslateJobId(job_id);
            toast('✦ Terjemahan AI dimulai...', { icon: '🌐' });
        } catch (err) {
            toast.error((err as Error).message ?? 'Gagal memulai terjemahan.');
        }
    }, [titleId, contentId, excerptId, setTranslateJobId]);

    const handleRevise = useCallback(async (text: string, instruction: string): Promise<string | null> => {
        setRevisionJobId(null);
        try {
            const { job_id } = await aiPost('/admin/ai/revise', { text, instruction });
            setRevisionJobId(job_id);
            return job_id;
        } catch (err) {
            toast.error((err as Error).message ?? 'Gagal memulai revisi teks.');
            return null;
        }
    }, [setRevisionJobId]);

    const handleApplyRevision = useCallback((_originalText: string, newText: string) => {
        if (!editorId) return;
        const { from, to } = editorId.state.selection;
        editorId.chain().focus().deleteRange({ from, to }).insertContent(newText).run();
        setRevisionJobId(null);
        toast.success('Revisi diterapkan.');
    }, [editorId, setRevisionJobId]);

    const handleDiscardRevision = useCallback(() => {
        setRevisionJobId(null);
    }, [setRevisionJobId]);

    return {
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
    };
}
