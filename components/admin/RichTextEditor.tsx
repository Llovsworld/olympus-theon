"use client";

import { useEditor, EditorContent, ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Youtube from '@tiptap/extension-youtube';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import { useCallback, useState, useRef, useMemo } from 'react';
import type { NodeViewProps } from '@tiptap/react';

interface RichTextEditorProps {
    content: string;
    onChange: (content: string) => void;
    placeholder?: string;
}

type PromptConfig = {
    title: string;
    placeholder: string;
    helperText?: string;
    defaultValue?: string;
    confirmLabel?: string;
    onSubmit: (value: string) => void;
};

export default function RichTextEditor({ content, onChange, placeholder = "Start writing..." }: RichTextEditorProps) {
    const [promptConfig, setPromptConfig] = useState<PromptConfig | null>(null);
    const [promptValue, setPromptValue] = useState('');
    const [imageModalOpen, setImageModalOpen] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState('');
    const [imageWidth, setImageWidth] = useState('');
    const [imageHeight, setImageHeight] = useState('');
    const [uploadingImage, setUploadingImage] = useState(false);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                // Disable extensions we configure manually to avoid duplicates
                link: false,
                underline: false,
            }),
            EditorImage,
            Link.configure({
                openOnClick: false,
            }),
            Youtube.configure({
                controls: true,
                nocookie: true,
            }),
            Table.configure({
                resizable: true,
            }),
            TableRow,
            TableHeader,
            TableCell,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Underline,
            Highlight.configure({
                multicolor: false,
            }),
            Placeholder.configure({
                placeholder,
            }),
        ],
        content,
        immediatelyRender: false,
        editable: true,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-lg max-w-none focus:outline-none min-h-[400px] p-6',
                style: 'color: #ededed; line-height: 1.8; font-size: 1.05rem;'
            },
        },
    });

    // Word and character count
    const wordCount = useMemo(() => {
        if (!editor) return 0;
        const text = editor.state.doc.textContent;
        return text.trim() ? text.trim().split(/\s+/).length : 0;
    }, [editor?.state.doc.textContent]);

    const charCount = useMemo(() => {
        if (!editor) return 0;
        return editor.state.doc.textContent.length;
    }, [editor?.state.doc.textContent]);

    const openPrompt = useCallback((config: PromptConfig) => {
        setPromptConfig(config);
        setPromptValue(config.defaultValue ?? '');
    }, []);

    const closePrompt = useCallback(() => {
        setPromptConfig(null);
        setPromptValue('');
    }, []);

    const handlePromptSubmit = useCallback(() => {
        if (!promptConfig) return;
        promptConfig.onSubmit(promptValue.trim());
        closePrompt();
    }, [promptConfig, promptValue, closePrompt]);

    const resetImageModal = useCallback(() => {
        setImageFile(null);
        setImageUrl('');
        setImageWidth('');
        setImageHeight('');
        setUploadingImage(false);
    }, []);

    const addImage = useCallback(() => {
        if (!editor) return;
        setImageModalOpen(true);
        resetImageModal();
    }, [editor, resetImageModal]);

    const closeImageModal = useCallback(() => {
        setImageModalOpen(false);
        resetImageModal();
    }, [resetImageModal]);

    const handleInsertImage = useCallback(async () => {
        if (!editor) return;
        try {
            setUploadingImage(true);
            let src = imageUrl.trim();

            if (imageFile) {
                const formData = new FormData();
                formData.append('file', imageFile);
                const uploadRes = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });
                if (!uploadRes.ok) {
                    const errorData = await uploadRes.json().catch(() => ({}));
                    throw new Error(errorData.details || errorData.error || 'Upload failed');
                }
                const data = await uploadRes.json();
                src = data.url;
            }

            if (!src) {
                alert('Selecciona un archivo o pega un enlace.');
                return;
            }

            const numericWidth = imageWidth ? parseInt(imageWidth, 10) : undefined;
            const numericHeight = imageHeight ? parseInt(imageHeight, 10) : undefined;

            const stylePieces = ['max-width:100%;height:auto;'];
            if (numericWidth) {
                stylePieces.push(`width:${numericWidth}px;`);
            }
            if (numericHeight) {
                stylePieces.push(`height:${numericHeight}px;`);
            }

            const imageAttrs: Record<string, unknown> = {
                src,
                style: stylePieces.join(''),
            };

            if (numericWidth) {
                imageAttrs.width = numericWidth;
            }
            if (numericHeight) {
                imageAttrs.height = numericHeight;
            }

            editor.chain().focus().setImage(imageAttrs as any).run();

            closeImageModal();
        } catch (error) {
            const message = error instanceof Error ? error.message : 'No se pudo insertar la imagen.';
            console.error('Image insert error:', error);
            alert(`Error: ${message}`);
        } finally {
            setUploadingImage(false);
        }
    }, [editor, imageFile, imageUrl, imageWidth, imageHeight, closeImageModal]);

    const addYouTubeVideo = useCallback(() => {
        if (!editor) return;
        openPrompt({
            title: 'Embed YouTube Video',
            placeholder: 'https://www.youtube.com/watch?v=...',
            helperText: 'Use a full YouTube URL. Autoplay is disabled.',
            confirmLabel: 'Embed Video',
            onSubmit: (value) => {
                if (!value) {
                    return;
                }
                editor.commands.setYoutubeVideo({
                    src: value,
                    width: 640,
                    height: 360,
                });
            },
        });
    }, [editor, openPrompt]);

    const addLink = useCallback(() => {
        if (!editor) return;
        const previousUrl = editor.getAttributes('link').href as string | undefined;
        openPrompt({
            title: 'Insert Link',
            placeholder: 'https://example.com',
            helperText: 'Leave blank to remove the current link.',
            confirmLabel: previousUrl ? 'Update Link' : 'Add Link',
            defaultValue: previousUrl ?? '',
            onSubmit: (value) => {
                if (!value) {
                    editor.chain().focus().extendMarkRange('link').unsetLink().run();
                    return;
                }
                editor.chain().focus().extendMarkRange('link').setLink({ href: value }).run();
            },
        });
    }, [editor, openPrompt]);

    if (!editor) {
        return null;
    }

    return (
        <>
            <div style={{
                border: '1px solid #2a2a2a',
                borderRadius: '8px',
                background: 'rgba(10, 10, 10, 0.95)',
                overflow: 'hidden'
            }}>
                {/* Toolbar */}
                <div style={{
                    borderBottom: '1px solid #2a2a2a',
                    padding: '0.5rem 0.75rem',
                    display: 'flex',
                    gap: '0.25rem',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    background: 'rgba(255, 255, 255, 0.02)'
                }}>
                    {/* Undo/Redo */}
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().undo().run()}
                        disabled={!editor.can().undo()}
                        style={buttonStyle(false)}
                        title="Deshacer (Ctrl+Z)"
                    >
                        ↶
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().redo().run()}
                        disabled={!editor.can().redo()}
                        style={buttonStyle(false)}
                        title="Rehacer (Ctrl+Y)"
                    >
                        ↷
                    </button>

                    <div style={{ width: '1px', height: '24px', background: '#333' }}></div>

                    {/* Text Formatting */}
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        disabled={!editor.can().chain().focus().toggleBold().run()}
                        style={buttonStyle(editor.isActive('bold'))}
                        title="Negrita (Ctrl+B)"
                    >
                        <strong>B</strong>
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        disabled={!editor.can().chain().focus().toggleItalic().run()}
                        style={buttonStyle(editor.isActive('italic'))}
                        title="Cursiva (Ctrl+I)"
                    >
                        <em>I</em>
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                        style={buttonStyle(editor.isActive('underline'))}
                        title="Subrayado (Ctrl+U)"
                    >
                        <span style={{ textDecoration: 'underline' }}>U</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                        style={buttonStyle(editor.isActive('strike'))}
                        title="Tachado"
                    >
                        <span style={{ textDecoration: 'line-through' }}>S</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleHighlight().run()}
                        style={buttonStyle(editor.isActive('highlight'))}
                        title="Resaltar"
                    >
                        <span style={{ background: '#ffb703', color: '#000', padding: '0 3px', borderRadius: '2px' }}>H</span>
                    </button>

                    <div style={{ width: '1px', height: '24px', background: '#333' }}></div>

                    {/* Headings */}
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        style={buttonStyle(editor.isActive('heading', { level: 1 }))}
                        title="Título 1"
                    >
                        H1
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        style={buttonStyle(editor.isActive('heading', { level: 2 }))}
                        title="Título 2"
                    >
                        H2
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                        style={buttonStyle(editor.isActive('heading', { level: 3 }))}
                        title="Título 3"
                    >
                        H3
                    </button>

                    <div style={{ width: '1px', height: '24px', background: '#333' }}></div>

                    {/* Alignment */}
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().setTextAlign('left').run()}
                        style={buttonStyle(editor.isActive({ textAlign: 'left' }))}
                        title="Alinear izquierda"
                    >
                        ⫷
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().setTextAlign('center').run()}
                        style={buttonStyle(editor.isActive({ textAlign: 'center' }))}
                        title="Centrar"
                    >
                        ☰
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().setTextAlign('right').run()}
                        style={buttonStyle(editor.isActive({ textAlign: 'right' }))}
                        title="Alinear derecha"
                    >
                        ⫸
                    </button>

                    <div style={{ width: '1px', height: '24px', background: '#333' }}></div>

                    {/* Lists */}
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        style={buttonStyle(editor.isActive('bulletList'))}
                        title="Lista con viñetas"
                    >
                        • ≡
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        style={buttonStyle(editor.isActive('orderedList'))}
                        title="Lista numerada"
                    >
                        1. ≡
                    </button>

                    <div style={{ width: '1px', height: '24px', background: '#333' }}></div>

                    {/* Quote & Code & HR */}
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        style={buttonStyle(editor.isActive('blockquote'))}
                        title="Cita"
                    >
                        ❝
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                        style={buttonStyle(editor.isActive('codeBlock'))}
                        title="Bloque de código"
                    >
                        {'</>'}
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().setHorizontalRule().run()}
                        style={buttonStyle(false)}
                        title="Línea separadora"
                    >
                        ―
                    </button>
                </div>

                {/* Secondary Toolbar - Media & Tables */}
                <div style={{
                    borderBottom: '1px solid #2a2a2a',
                    padding: '0.5rem 0.75rem',
                    display: 'flex',
                    gap: '0.5rem',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    background: 'rgba(255, 255, 255, 0.01)'
                }}>
                    {/* Media */}
                    <button
                        type="button"
                        onClick={addImage}
                        style={buttonStyle(false)}
                        title="Insertar imagen"
                    >
                        🖼️ Imagen
                    </button>
                    <button
                        type="button"
                        onClick={addYouTubeVideo}
                        style={buttonStyle(false)}
                        title="Insertar video de YouTube"
                    >
                        ▶️ Video
                    </button>
                    <button
                        type="button"
                        onClick={addLink}
                        style={buttonStyle(editor.isActive('link'))}
                        title="Insertar enlace"
                    >
                        🔗 Enlace
                    </button>

                    <div style={{ width: '1px', height: '24px', background: '#333' }}></div>

                    {/* Table */}
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
                        style={buttonStyle(false)}
                        title="Insertar tabla 3x3"
                    >
                        📊 Tabla
                    </button>

                    {editor.isActive('table') && (
                        <>
                            <button
                                type="button"
                                onClick={() => editor.chain().focus().addColumnAfter().run()}
                                style={{ ...buttonStyle(false), fontSize: '0.75rem', padding: '0.3rem 0.5rem' }}
                                title="Añadir columna"
                            >
                                +Col
                            </button>
                            <button
                                type="button"
                                onClick={() => editor.chain().focus().addRowAfter().run()}
                                style={{ ...buttonStyle(false), fontSize: '0.75rem', padding: '0.3rem 0.5rem' }}
                                title="Añadir fila"
                            >
                                +Fila
                            </button>
                            <button
                                type="button"
                                onClick={() => editor.chain().focus().deleteColumn().run()}
                                style={{ ...buttonStyle(false), fontSize: '0.75rem', padding: '0.3rem 0.5rem' }}
                                title="Eliminar columna"
                            >
                                -Col
                            </button>
                            <button
                                type="button"
                                onClick={() => editor.chain().focus().deleteRow().run()}
                                style={{ ...buttonStyle(false), fontSize: '0.75rem', padding: '0.3rem 0.5rem' }}
                                title="Eliminar fila"
                            >
                                -Fila
                            </button>
                            <button
                                type="button"
                                onClick={() => editor.chain().focus().deleteTable().run()}
                                style={{ ...buttonStyle(false), color: '#ef4444' }}
                                title="Eliminar tabla"
                            >
                                🗑️
                            </button>
                        </>
                    )}

                    {/* Word Count - Right aligned */}
                    <div style={{ marginLeft: 'auto', display: 'flex', gap: '1rem', fontSize: '0.75rem', color: '#666' }}>
                        <span>{wordCount} palabras</span>
                        <span>{charCount} caracteres</span>
                    </div>
                </div>

                {/* Editor Content */}
                <EditorContent editor={editor} />

                {promptConfig && (
                    <div style={promptOverlayStyle}>
                        <div
                            role="dialog"
                            aria-modal="true"
                            style={promptModalStyle}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handlePromptSubmit();
                                }
                            }}
                        >
                            <h3 style={{ marginBottom: '1rem' }}>{promptConfig.title}</h3>
                            <input
                                type="url"
                                value={promptValue}
                                onChange={(e) => setPromptValue(e.target.value)}
                                placeholder={promptConfig.placeholder}
                                style={promptInputStyle}
                                autoFocus
                            />
                            {promptConfig.helperText && (
                                <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#aaa' }}>
                                    {promptConfig.helperText}
                                </p>
                            )}
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                                <button
                                    type="button"
                                    onClick={closePrompt}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        border: '1px solid var(--border)',
                                        background: 'transparent',
                                        color: '#aaa',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handlePromptSubmit}
                                    className="btn"
                                    style={{ padding: '0.5rem 1rem' }}
                                >
                                    {promptConfig.confirmLabel ?? 'Insert'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {imageModalOpen && (
                    <div style={promptOverlayStyle}>
                        <div
                            role="dialog"
                            aria-modal="true"
                            style={promptModalStyle}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleInsertImage();
                                }
                            }}
                        >
                            <h3 style={{ marginBottom: '1rem' }}>Insertar imagen</h3>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={modalLabelStyle}>Subir archivo</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                                    style={{ color: '#ccc' }}
                                />
                                {imageFile && (
                                    <p style={helperTextStyle}>
                                        Archivo seleccionado: {imageFile.name}
                                    </p>
                                )}
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={modalLabelStyle}>o pegar enlace</label>
                                <input
                                    type="url"
                                    value={imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                    placeholder="https://ejemplo.com/imagen.jpg"
                                    style={promptInputStyle}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={modalLabelStyle}>Ancho (px)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={imageWidth}
                                        onChange={(e) => setImageWidth(e.target.value)}
                                        placeholder="Auto"
                                        style={promptInputStyle}
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={modalLabelStyle}>Alto (px)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={imageHeight}
                                        onChange={(e) => setImageHeight(e.target.value)}
                                        placeholder="Auto"
                                        style={promptInputStyle}
                                    />
                                </div>
                            </div>
                            <p style={helperTextStyle}>
                                Tu imagen se subirá a <code>/public/uploads</code> y podrás ajustar sus dimensiones manualmente.
                            </p>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                                <button
                                    type="button"
                                    onClick={closeImageModal}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        border: '1px solid var(--border)',
                                        background: 'transparent',
                                        color: '#aaa',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                    }}
                                    disabled={uploadingImage}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="button"
                                    onClick={handleInsertImage}
                                    className="btn"
                                    style={{ padding: '0.5rem 1rem', opacity: uploadingImage ? 0.6 : 1 }}
                                    disabled={uploadingImage}
                                >
                                    {uploadingImage ? 'Insertando...' : 'Insertar imagen'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <style jsx global>{`
            .ProseMirror .resizable-image-wrapper {
                position: relative;
                display: inline-block;
                border: 2px solid transparent;
                border-radius: 6px;
            }
            .ProseMirror .resizable-image-wrapper[data-selected='true'] {
                border-color: rgba(255, 255, 255, 0.6);
            }
            .ProseMirror .resizable-image-wrapper img {
                border-radius: 4px;
                display: block;
            }
            .ProseMirror .resizable-image-wrapper .resize-handle {
                position: absolute;
                bottom: 8px;
                right: 8px;
                width: 22px;
                height: 22px;
                border-radius: 4px;
                background: #ffb703;
                border: 2px solid #111;
                cursor: nwse-resize;
                box-shadow: 0 0 6px rgba(0, 0, 0, 0.35);
                color: #111;
                font-size: 0.65rem;
                font-weight: 700;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 1;
            }
            .ProseMirror .resizable-image-wrapper .resize-handle::after {
                content: '↔';
            }
            
            @media (max-width: 768px) {
                .ProseMirror .resizable-image-wrapper {
                    float: none !important;
                    display: block !important;
                    margin: 0 auto 1rem auto !important;
                    text-align: center !important;
                    width: 100% !important;
                }
                .ProseMirror .resizable-image-wrapper img {
                    margin: 0 auto !important;
                    max-width: 100% !important;
                    height: auto !important;
                }
            }

            /* Table Styles */
            .ProseMirror table {
                border-collapse: collapse;
                margin: 1.5rem 0;
                overflow: hidden;
                width: 100%;
                table-layout: fixed;
            }
            .ProseMirror table td,
            .ProseMirror table th {
                border: 1px solid #333;
                box-sizing: border-box;
                min-width: 1em;
                padding: 0.75rem 1rem;
                position: relative;
                vertical-align: top;
            }
            .ProseMirror table th {
                background-color: rgba(255, 255, 255, 0.08);
                font-weight: 600;
                text-align: left;
                color: #ededed;
            }
            .ProseMirror table td {
                background-color: rgba(255, 255, 255, 0.02);
            }
            .ProseMirror table .selectedCell:after {
                background: rgba(255, 183, 3, 0.2);
                content: "";
                left: 0;
                right: 0;
                top: 0;
                bottom: 0;
                pointer-events: none;
                position: absolute;
                z-index: 2;
            }
            .ProseMirror table .column-resize-handle {
                background-color: #ffb703;
                bottom: -2px;
                pointer-events: none;
                position: absolute;
                right: -2px;
                top: 0;
                width: 4px;
            }
            .ProseMirror .tableWrapper {
                overflow-x: auto;
            }
            
            /* Highlight mark */
            .ProseMirror mark {
                background-color: #ffb703;
                color: #000;
                padding: 0.1em 0.2em;
                border-radius: 2px;
            }
            
            /* Horizontal rule */
            .ProseMirror hr {
                border: none;
                border-top: 2px solid #333;
                margin: 2rem 0;
            }
        `}</style>
        </>
    );
}

function buttonStyle(isActive: boolean) {
    return {
        padding: '0.4rem 0.6rem',
        background: isActive ? 'rgba(255, 183, 3, 0.15)' : 'transparent',
        border: '1px solid ' + (isActive ? '#ffb703' : '#444'),
        color: isActive ? '#ffb703' : '#aaa',
        fontSize: '0.85rem',
        borderRadius: '4px',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
    };
}

const EditorImage = Image.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            width: {
                default: null,
                parseHTML: (element) => element.getAttribute('width'),
                renderHTML: (attributes) =>
                    attributes.width ? { width: attributes.width } : {},
            },
            height: {
                default: null,
                parseHTML: (element) => element.getAttribute('height'),
                renderHTML: (attributes) =>
                    attributes.height ? { height: attributes.height } : {},
            },
            align: {
                default: 'center',
                parseHTML: (element) => element.getAttribute('data-align'),
                renderHTML: (attributes) =>
                    attributes.align ? { 'data-align': attributes.align } : {},
            },
            style: {
                default: 'display: block; margin: 0 auto; max-width: 100%; height: auto;',
                parseHTML: (element) => element.getAttribute('style'),
                renderHTML: (attributes) =>
                    attributes.style ? { style: attributes.style } : {},
            },
        };
    },
    addNodeView() {
        return ReactNodeViewRenderer(ResizableImage);
    },
});

function ResizableImage({ node, updateAttributes, selected }: NodeViewProps) {
    const imgRef = useRef<HTMLImageElement>(null);
    const [resizeDims, setResizeDims] = useState<{ w: number; h: number } | null>(null);

    const startResize = (event: React.MouseEvent<HTMLSpanElement>) => {
        event.preventDefault();
        event.stopPropagation();
        const imgEl = imgRef.current;
        if (!imgEl) return;

        const startX = event.clientX;
        const startWidth = imgEl.offsetWidth;
        const startHeight = imgEl.offsetHeight;
        const aspectRatio = startHeight / (startWidth || 1);

        const handleMouseMove = (moveEvent: MouseEvent) => {
            moveEvent.preventDefault();
            const deltaX = moveEvent.clientX - startX;
            const newWidth = Math.max(80, startWidth + deltaX);
            const newHeight = Math.round(newWidth * aspectRatio);

            imgEl.style.width = `${newWidth}px`;
            imgEl.style.height = `${newHeight}px`;

            setResizeDims({ w: newWidth, h: newHeight });
        };

        const handleMouseUp = (upEvent: MouseEvent) => {
            upEvent.preventDefault();
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            setResizeDims(null);

            const imgWidth = imgEl.offsetWidth;
            const imgHeight = imgEl.offsetHeight;

            // Preserve existing alignment styles
            const currentAlign = node.attrs.align || 'center';
            let styleString = `width:${Math.round(imgWidth)}px;height:${Math.round(imgHeight)}px;max-width:100%;`;

            if (currentAlign === 'left') {
                styleString += 'float:left;margin-right:1rem;margin-bottom:0.5rem;';
            } else if (currentAlign === 'right') {
                styleString += 'float:right;margin-left:1rem;margin-bottom:0.5rem;';
            } else {
                styleString += 'display:block;margin:0 auto;';
            }

            updateAttributes({
                width: Math.round(imgWidth),
                height: Math.round(imgHeight),
                style: styleString,
            });
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const setAlign = (align: 'left' | 'center' | 'right') => {
        const width = node.attrs.width;
        const height = node.attrs.height;

        let styleString = 'max-width:100%;height:auto;';
        if (width) styleString += `width:${width}px;`;
        if (height) styleString += `height:${height}px;`;

        if (align === 'left') {
            styleString += 'float:left;margin-right:1rem;margin-bottom:0.5rem;';
        } else if (align === 'right') {
            styleString += 'float:right;margin-left:1rem;margin-bottom:0.5rem;';
        } else {
            styleString += 'display:block;margin:0 auto;';
        }

        updateAttributes({
            align,
            style: styleString
        });
    };

    const resetSize = () => {
        updateAttributes({
            width: null,
            height: null,
            style: 'display:block;margin:0 auto;max-width:100%;height:auto;',
            align: 'center'
        });
    };

    return (
        <NodeViewWrapper
            className="resizable-image-wrapper"
            data-selected={selected ? 'true' : 'false'}
            style={{
                display: node.attrs.align === 'center' ? 'block' : 'inline-block',
                textAlign: node.attrs.align === 'center' ? 'center' : undefined,
                float: node.attrs.align === 'left' ? 'left' : node.attrs.align === 'right' ? 'right' : 'none',
                marginRight: node.attrs.align === 'left' ? '1rem' : undefined,
                marginLeft: node.attrs.align === 'right' ? '1rem' : undefined,
                marginBottom: '0.5rem',
                position: 'relative',
                lineHeight: 0,
            }}
        >
            <div style={{ position: 'relative', display: 'inline-block' }}>
                <img
                    ref={imgRef}
                    src={node.attrs.src}
                    alt={node.attrs.alt || ''}
                    className="content-image"
                    style={{
                        maxWidth: '100%',
                        height: 'auto',
                        width: node.attrs.width ? `${node.attrs.width}px` : undefined,
                        ...(node.attrs.height ? { height: `${node.attrs.height}px` } : {}),
                        display: 'block',
                    }}
                />
                {selected && (
                    <>
                        <span
                            className="resize-handle"
                            onMouseDown={startResize}
                            title="Arrastra para redimensionar"
                        />
                        {resizeDims && (
                            <div style={{
                                position: 'absolute',
                                bottom: '10px',
                                right: '35px',
                                background: 'rgba(0,0,0,0.8)',
                                color: 'white',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                fontSize: '12px',
                                pointerEvents: 'none',
                                whiteSpace: 'nowrap',
                                zIndex: 20,
                            }}>
                                {Math.round(resizeDims.w)} x {Math.round(resizeDims.h)}
                            </div>
                        )}
                        <div className="image-actions" style={{
                            position: 'absolute',
                            top: '12px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            background: 'rgba(15, 15, 15, 0.9)',
                            borderRadius: '8px',
                            padding: '6px',
                            display: 'flex',
                            gap: '6px',
                            zIndex: 10,
                            border: '1px solid rgba(255,255,255,0.1)',
                            backdropFilter: 'blur(8px)',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                        }}>
                            <button
                                onClick={() => setAlign('left')}
                                className={node.attrs.align === 'left' ? 'is-active' : ''}
                                style={actionButtonStyle(node.attrs.align === 'left')}
                                title="Align Left"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="21" y1="6" x2="3" y2="6"></line><line x1="15" y1="12" x2="3" y2="12"></line><line x1="17" y1="18" x2="3" y2="18"></line></svg>
                            </button>
                            <button
                                onClick={() => setAlign('center')}
                                className={node.attrs.align === 'center' ? 'is-active' : ''}
                                style={actionButtonStyle(node.attrs.align === 'center' || !node.attrs.align)}
                                title="Align Center"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="12" x2="3" y2="12"></line><line x1="21" y1="18" x2="3" y2="18"></line></svg>
                            </button>
                            <button
                                onClick={() => setAlign('right')}
                                className={node.attrs.align === 'right' ? 'is-active' : ''}
                                style={actionButtonStyle(node.attrs.align === 'right')}
                                title="Align Right"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="12" x2="9" y2="12"></line><line x1="21" y1="18" x2="7" y2="18"></line></svg>
                            </button>
                            <div style={{ width: '1px', background: 'rgba(255,255,255,0.2)', margin: '0 2px' }}></div>
                            <button
                                onClick={resetSize}
                                style={actionButtonStyle(false)}
                                title="Reset Size & Align"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>
                            </button>
                        </div>
                    </>
                )}
            </div>
        </NodeViewWrapper>
    );
}

function actionButtonStyle(isActive: boolean) {
    return {
        background: isActive ? 'rgba(255,255,255,0.15)' : 'transparent',
        border: 'none',
        color: isActive ? '#fff' : '#aaa',
        cursor: 'pointer',
        padding: '4px',
        borderRadius: '4px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s',
    };
}

const promptOverlayStyle = {
    position: 'fixed' as const,
    inset: 0,
    background: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50,
    padding: '1rem',
};

const promptModalStyle = {
    width: '100%',
    maxWidth: '420px',
    background: '#0f0f0f',
    border: '1px solid var(--border)',
    borderRadius: '6px',
    padding: '1.5rem',
    boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
};

const promptInputStyle = {
    width: '100%',
    padding: '0.75rem',
    borderRadius: '4px',
    border: '1px solid var(--border)',
    background: 'rgba(255,255,255,0.05)',
    color: 'var(--foreground)',
    fontSize: '1rem',
};

const modalLabelStyle = {
    display: 'block',
    marginBottom: '0.35rem',
    fontSize: '0.85rem',
    color: '#bbb',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
};

const helperTextStyle = {
    marginTop: '0.35rem',
    fontSize: '0.85rem',
    color: '#888',
};
