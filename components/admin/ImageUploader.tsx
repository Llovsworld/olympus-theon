"use client";

import { useState, useRef, useEffect, useId } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
    onUpload: (url: string) => void;
    label?: string;
    currentImage?: string;
}

export default function ImageUploader({ onUpload, label = "Imagen Destacada", currentImage }: ImageUploaderProps) {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(currentImage || '');
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const inputId = useId();
    const labelId = `${inputId}-label`;

    // Sync preview with prop when loading drafts
    useEffect(() => {
        if (currentImage) {
            setPreview(currentImage);
        }
    }, [currentImage]);

    async function uploadFile(file: File) {
        // Show preview immediately with local data URL
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Upload file
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.details || errorData.error || 'Upload failed');
            }

            const data = await response.json();
            // Update preview with actual Blob URL instead of data URL
            setPreview(data.url);
            onUpload(data.url);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to upload image';
            console.error('Upload error:', error);
            alert(`Error al subir imagen: ${message}`);
            setPreview(currentImage || '');
        } finally {
            setUploading(false);
        }
    }

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) {
            void uploadFile(file);
        }
    }

    function handleRemove(e: React.MouseEvent) {
        e.stopPropagation();
        setPreview('');
        onUpload('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }

    return (
        <div>
            <label id={labelId} htmlFor={inputId} className="admin-label">
                {label}
            </label>

            <div style={{ position: 'relative' }}>
                <label
                    htmlFor={inputId}
                    className={`admin-uploader ${isDragging ? 'dragging' : ''}`}
                    role="button"
                    tabIndex={uploading ? -1 : 0}
                    aria-labelledby={labelId}
                    aria-disabled={uploading}
                    style={{ display: 'block' }}
                    onKeyDown={(event) => {
                        if (!uploading && (event.key === 'Enter' || event.key === ' ')) {
                            event.preventDefault();
                            fileInputRef.current?.click();
                        }
                    }}
                    onDragOver={(event) => {
                        event.preventDefault();
                        setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(event) => {
                        event.preventDefault();
                        setIsDragging(false);
                        const file = event.dataTransfer.files[0];
                        if (file && !uploading) {
                            void uploadFile(file);
                        }
                    }}
                >
                    {uploading ? (
                        <div className="admin-uploader-loading">
                            <div className="admin-spinner"></div>
                            <p className="admin-uploader-text">Subiendo imagen...</p>
                        </div>
                    ) : preview ? (
                        <div>
                            {/* eslint-disable-next-line @next/next/no-img-element -- The preview may be a local data URL before upload. */}
                            <img
                                src={preview}
                                alt="Vista previa de la imagen seleccionada"
                                className="admin-uploader-preview"
                            />
                            <p className="admin-uploader-text" style={{ marginTop: '0.5rem' }}>
                                Haz clic para cambiar
                            </p>
                        </div>
                    ) : (
                        <div>
                            <div className="admin-uploader-icon">
                                {isDragging ? <Upload size={48} /> : <ImageIcon size={48} />}
                            </div>
                            <p className="admin-uploader-text">
                                {isDragging ? 'Suelta la imagen aquí' : 'Haz clic o arrastra una imagen'}
                            </p>
                            <p className="admin-uploader-hint">
                                Máx. 5 MB · JPG, PNG, GIF, WEBP
                            </p>
                        </div>
                    )}
                </label>

                {preview && !uploading ? (
                    <button
                        type="button"
                        className="admin-uploader-remove"
                        onClick={handleRemove}
                        aria-label="Eliminar imagen"
                        title="Eliminar imagen"
                        style={{ opacity: 1 }}
                    >
                        <X size={16} aria-hidden="true" />
                    </button>
                ) : null}
            </div>

            <input
                id={inputId}
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={uploading}
                aria-labelledby={labelId}
                style={{
                    position: 'absolute',
                    width: '1px',
                    height: '1px',
                    padding: 0,
                    margin: '-1px',
                    overflow: 'hidden',
                    clip: 'rect(0, 0, 0, 0)',
                    whiteSpace: 'nowrap',
                    border: 0,
                }}
            />
        </div>
    );
}
