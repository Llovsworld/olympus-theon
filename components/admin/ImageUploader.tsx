"use client";

import { useState, useRef, useEffect } from 'react';
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

    // Sync preview with prop when loading drafts
    useEffect(() => {
        if (currentImage) {
            setPreview(currentImage);
        }
    }, [currentImage]);

    async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

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
            <label className="admin-label">
                {label}
            </label>

            <div
                className={`admin-uploader ${isDragging ? 'dragging' : ''}`}
                onClick={() => !uploading && fileInputRef.current?.click()}
                onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    const file = e.dataTransfer.files[0];
                    if (file && !uploading) {
                        const input = fileInputRef.current;
                        if (input) {
                            const dataTransfer = new DataTransfer();
                            dataTransfer.items.add(file);
                            input.files = dataTransfer.files;
                            handleFileChange({ target: input } as any);
                        }
                    }
                }}
            >
                {uploading ? (
                    <div className="admin-uploader-loading">
                        <div className="admin-spinner"></div>
                        <p className="admin-uploader-text">Subiendo imagen...</p>
                    </div>
                ) : preview ? (
                    <div style={{ position: 'relative' }}>
                        <img
                            src={preview}
                            alt="Preview"
                            className="admin-uploader-preview"
                        />
                        <p className="admin-uploader-text" style={{ marginTop: '0.5rem' }}>
                            Haz click para cambiar
                        </p>
                        <button
                            type="button"
                            className="admin-uploader-remove"
                            onClick={handleRemove}
                            title="Eliminar imagen"
                        >
                            <X size={16} />
                        </button>
                    </div>
                ) : (
                    <div>
                        <div className="admin-uploader-icon">
                            {isDragging ? <Upload size={48} /> : <ImageIcon size={48} />}
                        </div>
                        <p className="admin-uploader-text">
                            {isDragging ? 'Suelta la imagen aquí' : 'Click o arrastra una imagen'}
                        </p>
                        <p className="admin-uploader-hint">
                            Max 5MB · JPG, PNG, GIF, WEBP
                        </p>
                    </div>
                )}
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
            />
        </div>
    );
}
