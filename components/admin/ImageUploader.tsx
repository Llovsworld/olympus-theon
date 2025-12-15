"use client";

import { useState, useRef, useEffect } from 'react';

interface ImageUploaderProps {
    onUpload: (url: string) => void;
    label?: string;
    currentImage?: string;
}

export default function ImageUploader({ onUpload, label = "Upload Image", currentImage }: ImageUploaderProps) {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(currentImage || '');
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

        // Show preview
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
            onUpload(data.url);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to upload image';
            console.error('Upload error:', error);
            alert(`Failed to upload image: ${message}`);
            setPreview(currentImage || '');
        } finally {
            setUploading(false);
        }
    }

    return (
        <div>
            <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontSize: '0.9rem',
                color: '#888',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
            }}>
                {label}
            </label>

            <div style={{
                border: '2px dashed var(--border)',
                borderRadius: '4px',
                padding: '2rem',
                textAlign: 'center',
                background: 'rgba(255, 255, 255, 0.02)',
                cursor: 'pointer',
                transition: 'all 0.3s'
            }}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                    e.preventDefault();
                    e.currentTarget.style.borderColor = 'var(--foreground)';
                }}
                onDragLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border)';
                }}
                onDrop={(e) => {
                    e.preventDefault();
                    e.currentTarget.style.borderColor = 'var(--border)';
                    const file = e.dataTransfer.files[0];
                    if (file) {
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
                {preview ? (
                    <div>
                        <img
                            src={preview}
                            alt="Preview"
                            style={{
                                maxWidth: '100%',
                                maxHeight: '300px',
                                borderRadius: '4px',
                                marginBottom: '1rem'
                            }}
                        />
                        <p style={{ color: '#888', fontSize: '0.9rem' }}>
                            Click to change image
                        </p>
                    </div>
                ) : (
                    <div>
                        <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📸</p>
                        <p style={{ color: '#888', marginBottom: '0.5rem' }}>
                            {uploading ? 'Uploading...' : 'Click or drag image here'}
                        </p>
                        <p style={{ color: '#666', fontSize: '0.85rem' }}>
                            Max 5MB • JPG, PNG, GIF, WEBP
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
