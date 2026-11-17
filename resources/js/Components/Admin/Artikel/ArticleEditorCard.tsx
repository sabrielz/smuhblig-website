import { Input } from '@/Components/UI/Input';
import { Textarea } from '@/Components/UI/Textarea';
import { TipTapEditor } from '@/Components/Editor/TipTapEditor';
import { Sparkles } from 'lucide-react';
import type { Editor } from '@tiptap/react';

interface ArticleEditorCardProps {
    activeTab: 'id' | 'en';
    data: {
        title_id: string;
        excerpt_id: string;
        content_id: string;
        title_en: string;
        excerpt_en: string;
        content_en: string;
    };
    errors: Partial<Record<string, string>>;
    onChange: (field: string, value: string) => void;
    setEditorId: (editor: Editor | null) => void;
    aiEnabled: boolean;
    onTranslate: () => void;
    isTranslating: boolean;
}

export default function ArticleEditorCard({
    activeTab,
    data,
    errors,
    onChange,
    setEditorId,
    aiEnabled,
    onTranslate,
    isTranslating,
}: ArticleEditorCardProps) {
    return (
        <div className="p-6 flex flex-col gap-6">
            {/* ── ID Tab ── */}
            {activeTab === 'id' && (
                <>
                    <Input
                        label="Judul Artikel (ID)"
                        placeholder="Masukkan judul artikel..."
                        value={data.title_id}
                        onChange={(e) => onChange('title_id', e.target.value)}
                        error={errors.title_id}
                        className="text-lg font-medium"
                        required
                    />

                    <Textarea
                        label="Ringkasan / Excerpt (ID)"
                        placeholder="Ringkasan singkat artikel (tampil di listing berita)..."
                        rows={3}
                        value={data.excerpt_id}
                        onChange={(e) => onChange('excerpt_id', e.target.value)}
                        error={errors.excerpt_id}
                    />

                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                            Isi Konten (ID) <span className="text-red-500">*</span>
                        </label>
                        <TipTapEditor
                            value={data.content_id}
                            onChange={(html) => onChange('content_id', html)}
                            placeholder="Mulai menulis artikel Anda di sini..."
                            error={errors.content_id}
                            onEditorReady={setEditorId}
                            aiEnabled={aiEnabled}
                        />
                    </div>
                </>
            )}

            {/* ── EN Tab ── */}
            {activeTab === 'en' && (
                <>
                    {/* Translate button */}
                    <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-primary-900/5 to-primary-600/5 border border-primary-600/10">
                        <div>
                            <p className="text-sm font-semibold text-primary-600">
                                Gunakan AI untuk menerjemahkan
                            </p>
                            <p className="text-xs text-neutral-500 mt-0.5">
                                Terjemahkan otomatis dari konten Indonesia ke English
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={onTranslate}
                            disabled={isTranslating}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary-900 to-primary-600 text-white text-sm font-semibold hover:from-primary-800 hover:to-primary-500 transition-all shadow-md shadow-primary-600/20 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 whitespace-nowrap"
                        >
                            {isTranslating ? (
                                <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                            ) : (
                                <Sparkles className="w-3.5 h-3.5" strokeWidth={1.5} />
                            )}
                            ✦ Terjemahkan dengan AI
                        </button>
                    </div>

                    <Input
                        label="Article Title (EN)"
                        placeholder="Enter article title..."
                        value={data.title_en}
                        onChange={(e) => onChange('title_en', e.target.value)}
                        error={errors.title_en}
                        className="text-lg font-medium"
                    />

                    <Textarea
                        label="Excerpt (EN)"
                        placeholder="Short summary of the article (shown in news listing)..."
                        rows={3}
                        value={data.excerpt_en}
                        onChange={(e) => onChange('excerpt_en', e.target.value)}
                        error={errors.excerpt_en}
                    />

                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                            Content (EN)
                        </label>
                        <TipTapEditor
                            value={data.content_en}
                            onChange={(html) => onChange('content_en', html)}
                            placeholder="Start writing the article content here..."
                            error={errors.content_en}
                            onEditorReady={setEditorId}
                            aiEnabled={aiEnabled}
                        />
                    </div>
                </>
            )}
        </div>
    );
}
