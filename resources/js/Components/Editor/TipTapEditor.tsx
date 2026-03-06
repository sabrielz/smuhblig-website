import React, { useCallback, useRef } from "react";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import Typography from "@tiptap/extension-typography";
import { cn } from "@/lib/utils";
import {
    Bold,
    Italic,
    Heading2,
    Heading3,
    Quote,
    Code2,
    List,
    ListOrdered,
    Link as LinkIcon,
    Image as ImageIcon,
    Undo2,
    Redo2,
    Sparkles,
} from "lucide-react";

/* ─────────────────────────────────────────────
   Props
   ───────────────────────────────────────────── */
export interface TipTapEditorProps {
    value: string;
    onChange: (html: string) => void;
    placeholder?: string;
    readOnly?: boolean;
    className?: string;
    /** Error message from form validation */
    error?: string;
    /** Called once with the Editor instance — useful for AiBubble */
    onEditorReady?: (editor: Editor | null) => void;
}

/* ─────────────────────────────────────────────
   Toolbar Button
   ───────────────────────────────────────────── */
interface ToolbarButtonProps {
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    title: string;
    children: React.ReactNode;
    className?: string;
}

function ToolbarButton({
    onClick,
    isActive = false,
    disabled = false,
    title,
    children,
    className,
}: ToolbarButtonProps) {
    return (
        <button
            type="button"
            onMouseDown={(e) => {
                // Prevent blur from editor while clicking toolbar
                e.preventDefault();
                if (!disabled) onClick();
            }}
            disabled={disabled}
            title={title}
            className={cn(
                "flex items-center justify-center w-10 h-10 md:w-8 md:h-8 rounded-md transition-all duration-150 select-none",
                isActive
                    ? "bg-[#003f87] text-white shadow-sm"
                    : "text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900",
                disabled && "opacity-40 cursor-not-allowed pointer-events-none",
                className
            )}
        >
            {children}
        </button>
    );
}

function ToolbarDivider() {
    return (
        <div className="w-px h-5 bg-neutral-200 mx-0.5 self-center flex-shrink-0" />
    );
}

/* ─────────────────────────────────────────────
   Link Dialog
   ───────────────────────────────────────────── */
function insertLink(editor: Editor) {
    const previousUrl = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Masukkan URL:", previousUrl ?? "https://");

    if (url === null) return; // user cancelled

    if (url === "") {
        editor.chain().focus().extendMarkRange("link").unsetLink().run();
        return;
    }

    editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url, target: "_blank" })
        .run();
}

/* ─────────────────────────────────────────────
   Image Upload
   ───────────────────────────────────────────── */
async function uploadAndInsertImage(
    editor: Editor,
    fileInputRef: React.RefObject<HTMLInputElement | null>,
) {
    fileInputRef.current?.click();
}

/* ─────────────────────────────────────────────
   Word + Reading time helpers
   ───────────────────────────────────────────── */
function countWords(html: string): number {
    const text = html.replace(/<[^>]+>/g, " ").trim();
    if (!text) return 0;
    return text.split(/\s+/).filter(Boolean).length;
}

function readingTime(words: number): number {
    return Math.ceil(words / 200);
}

/* ─────────────────────────────────────────────
   Main Component
   ───────────────────────────────────────────── */
export function TipTapEditor({
    value,
    onChange,
    placeholder = "Mulai menulis artikel Anda...",
    readOnly = false,
    className,
    error,
    onEditorReady,
}: TipTapEditorProps) {
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: { levels: [2, 3] },
                // Disable h1, h4, h5, h6
            }),
            Image.configure({
                HTMLAttributes: {
                    class: "rounded-lg max-w-full h-auto my-4",
                },
            }),
            Link.configure({
                openOnClick: false,
                defaultProtocol: "https",
                HTMLAttributes: {
                    target: "_blank",
                    rel: "noopener noreferrer",
                    class: "text-[#003f87] underline underline-offset-2 hover:text-[#c9a84c] transition-colors",
                },
            }),
            Placeholder.configure({
                placeholder,
                emptyEditorClass: "is-empty",
            }),
            CharacterCount,
            Typography,
        ],
        content: value,
        editable: !readOnly,
        onUpdate({ editor }) {
            onChange(editor.getHTML());
        },
        onCreate({ editor }) {
            onEditorReady?.(editor);
        },
        onDestroy() {
            onEditorReady?.(null);
        },
    });

    /* Image file handler */
    const handleImageFileChange = useCallback(
        async (e: React.ChangeEvent<HTMLInputElement>) => {
            if (!editor) return;
            const file = e.target.files?.[0];
            if (!file) return;

            const formData = new FormData();
            formData.append("image", file);

            try {
                const csrfMeta = document.querySelector<HTMLMetaElement>(
                    'meta[name="csrf-token"]',
                );
                const csrfToken = csrfMeta?.content ?? "";

                const response = await fetch("/admin/media/upload", {
                    method: "POST",
                    headers: {
                        "X-CSRF-TOKEN": csrfToken,
                        Accept: "application/json",
                    },
                    body: formData,
                });

                if (!response.ok) throw new Error("Upload gagal");

                const data = (await response.json()) as { url: string };
                editor.chain().focus().setImage({ src: data.url }).run();
            } catch {
                alert("Gagal mengupload gambar. Silakan coba lagi.");
            } finally {
                // reset so same file can be selected again
                if (fileInputRef.current) fileInputRef.current.value = "";
            }
        },
        [editor],
    );

    if (!editor) return null;

    const charCount = editor.storage.characterCount.characters() as number;
    const wordCount = countWords(editor.getHTML());
    const readMin = readingTime(wordCount);

    return (
        <div
            className={cn(
                "flex flex-col rounded-xl border overflow-hidden",
                error ? "border-red-500" : "border-neutral-200",
                className,
            )}
        >
            {/* ── Hidden file input for image upload ── */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={handleImageFileChange}
            />

            {/* ══════════════════════════════════════════
                TOOLBAR
               ══════════════════════════════════════════ */}
            {!readOnly && (
                <div className="sticky top-0 z-10 bg-neutral-50 border-b border-neutral-200 px-3 py-2 flex flex-wrap items-center gap-0.5">
                    {/* Bold */}
                    <ToolbarButton
                        title="Bold (Ctrl+B)"
                        onClick={() =>
                            editor.chain().focus().toggleBold().run()
                        }
                        isActive={editor.isActive("bold")}
                    >
                        <Bold className="w-4 h-4" strokeWidth={1.5} />
                    </ToolbarButton>

                    {/* Italic */}
                    <ToolbarButton
                        title="Italic (Ctrl+I)"
                        onClick={() =>
                            editor.chain().focus().toggleItalic().run()
                        }
                        isActive={editor.isActive("italic")}
                    >
                        <Italic className="w-4 h-4" strokeWidth={1.5} />
                    </ToolbarButton>

                    {/* H2 */}
                    <ToolbarButton
                        title="Heading 2"
                        onClick={() =>
                            editor
                                .chain()
                                .focus()
                                .toggleHeading({ level: 2 })
                                .run()
                        }
                        isActive={editor.isActive("heading", { level: 2 })}
                    >
                        <Heading2 className="w-4 h-4" strokeWidth={1.5} />
                    </ToolbarButton>

                    {/* H3 */}
                    <ToolbarButton
                        title="Heading 3"
                        onClick={() =>
                            editor
                                .chain()
                                .focus()
                                .toggleHeading({ level: 3 })
                                .run()
                        }
                        isActive={editor.isActive("heading", { level: 3 })}
                    >
                        <Heading3 className="w-4 h-4" strokeWidth={1.5} />
                    </ToolbarButton>

                    {/* Blockquote - hidden on mobile */}
                    <ToolbarButton
                        title="Blockquote"
                        onClick={() =>
                            editor.chain().focus().toggleBlockquote().run()
                        }
                        isActive={editor.isActive("blockquote")}
                        className="hidden sm:flex"
                    >
                        <Quote className="w-5 h-5 md:w-4 md:h-4" strokeWidth={1.5} />
                    </ToolbarButton>

                    {/* Inline Code - hidden on mobile */}
                    <ToolbarButton
                        title="Inline Code"
                        onClick={() =>
                            editor.chain().focus().toggleCode().run()
                        }
                        isActive={editor.isActive("code")}
                        className="hidden sm:flex"
                    >
                        <Code2 className="w-5 h-5 md:w-4 md:h-4" strokeWidth={1.5} />
                    </ToolbarButton>

                    <ToolbarDivider />

                    {/* Bullet List */}
                    <ToolbarButton
                        title="Bullet List"
                        onClick={() =>
                            editor.chain().focus().toggleBulletList().run()
                        }
                        isActive={editor.isActive("bulletList")}
                    >
                        <List className="w-4 h-4" strokeWidth={1.5} />
                    </ToolbarButton>

                    {/* Ordered List */}
                    <ToolbarButton
                        title="Ordered List"
                        onClick={() =>
                            editor.chain().focus().toggleOrderedList().run()
                        }
                        isActive={editor.isActive("orderedList")}
                    >
                        <ListOrdered className="w-4 h-4" strokeWidth={1.5} />
                    </ToolbarButton>

                    <ToolbarDivider />

                    {/* Link */}
                    <ToolbarButton
                        title="Insert Link"
                        onClick={() => insertLink(editor)}
                        isActive={editor.isActive("link")}
                    >
                        <LinkIcon className="w-4 h-4" strokeWidth={1.5} />
                    </ToolbarButton>

                    {/* Image Upload */}
                    <ToolbarButton
                        title="Insert Image"
                        onClick={() =>
                            uploadAndInsertImage(editor, fileInputRef)
                        }
                    >
                        <ImageIcon className="w-4 h-4" strokeWidth={1.5} />
                    </ToolbarButton>

                    <ToolbarDivider />

                    {/* Undo */}
                    <ToolbarButton
                        title="Undo (Ctrl+Z)"
                        onClick={() => editor.chain().focus().undo().run()}
                        disabled={!editor.can().undo()}
                    >
                        <Undo2 className="w-4 h-4" strokeWidth={1.5} />
                    </ToolbarButton>

                    {/* Redo */}
                    <ToolbarButton
                        title="Redo (Ctrl+Shift+Z)"
                        onClick={() => editor.chain().focus().redo().run()}
                        disabled={!editor.can().redo()}
                    >
                        <Redo2 className="w-4 h-4" strokeWidth={1.5} />
                    </ToolbarButton>
                </div>
            )}

            {/* ══════════════════════════════════════════
                EDITOR CONTENT AREA
               ══════════════════════════════════════════ */}
            <EditorContent
                editor={editor}
                className={cn(
                    "tiptap-editor flex-1 min-h-[400px] bg-white",
                    "[&_.ProseMirror]:min-h-[400px] [&_.ProseMirror]:p-6 [&_.ProseMirror]:outline-none",
                    "[&_.ProseMirror]:prose [&_.ProseMirror]:prose-neutral [&_.ProseMirror]:max-w-none",
                    // Heading colors
                    "[&_.ProseMirror_h2]:text-[#003f87] [&_.ProseMirror_h2]:font-bold [&_.ProseMirror_h2]:text-xl [&_.ProseMirror_h2]:mt-6 [&_.ProseMirror_h2]:mb-3",
                    "[&_.ProseMirror_h3]:text-[#003f87] [&_.ProseMirror_h3]:font-semibold [&_.ProseMirror_h3]:text-lg [&_.ProseMirror_h3]:mt-5 [&_.ProseMirror_h3]:mb-2",
                    // Paragraph
                    "[&_.ProseMirror_p]:text-neutral-700 [&_.ProseMirror_p]:leading-relaxed [&_.ProseMirror_p]:mb-3",
                    // Blockquote
                    "[&_.ProseMirror_blockquote]:border-l-4 [&_.ProseMirror_blockquote]:border-[#c9a84c] [&_.ProseMirror_blockquote]:pl-4 [&_.ProseMirror_blockquote]:italic [&_.ProseMirror_blockquote]:text-neutral-500 [&_.ProseMirror_blockquote]:my-4",
                    // Code
                    "[&_.ProseMirror_code]:bg-neutral-100 [&_.ProseMirror_code]:rounded [&_.ProseMirror_code]:px-1.5 [&_.ProseMirror_code]:py-0.5 [&_.ProseMirror_code]:text-sm [&_.ProseMirror_code]:font-mono [&_.ProseMirror_code]:text-[#c9a84c]",
                    "[&_.ProseMirror_pre]:bg-neutral-900 [&_.ProseMirror_pre]:rounded-lg [&_.ProseMirror_pre]:p-4 [&_.ProseMirror_pre]:text-sm [&_.ProseMirror_pre]:overflow-x-auto [&_.ProseMirror_pre]:my-4",
                    "[&_.ProseMirror_pre_code]:bg-transparent [&_.ProseMirror_pre_code]:text-neutral-200 [&_.ProseMirror_pre_code]:p-0",
                    // Lists
                    "[&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:pl-6 [&_.ProseMirror_ul]:mb-4 [&_.ProseMirror_ul]:space-y-1",
                    "[&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:pl-6 [&_.ProseMirror_ol]:mb-4 [&_.ProseMirror_ol]:space-y-1",
                    "[&_.ProseMirror_li]:text-neutral-700",
                    // Placeholder
                    "[&_.ProseMirror.is-empty:before]:content-[attr(data-placeholder)] [&_.ProseMirror.is-empty:before]:text-neutral-400 [&_.ProseMirror.is-empty:before]:float-left [&_.ProseMirror.is-empty:before]:pointer-events-none [&_.ProseMirror.is-empty:before]:h-0",
                )}
            />

            {/* ══════════════════════════════════════════
                INFO BAR (bottom)
               ══════════════════════════════════════════ */}
            <div className="flex items-center justify-between bg-neutral-50 border-t border-neutral-200 px-4 py-2">
                <div className="flex items-center gap-4 text-xs text-neutral-500">
                    <span>{charCount.toLocaleString("id-ID")} karakter</span>
                    <span className="text-neutral-300">•</span>
                    <span>~{wordCount.toLocaleString("id-ID")} kata</span>
                    <span className="text-neutral-300">•</span>
                    <span>{readMin} menit baca</span>
                </div>

                {/* AI Badge — informational */}
                <div className="flex items-center gap-1 text-xs text-neutral-400 select-none">
                    <Sparkles className="w-3 h-3" strokeWidth={1.5} />
                    <span>AI-powered</span>
                </div>
            </div>

            {/* Error message */}
            {error && (
                <p className="px-4 py-2 text-sm text-red-500 bg-red-50 border-t border-red-100">
                    {error}
                </p>
            )}
        </div>
    );
}

export default TipTapEditor;
