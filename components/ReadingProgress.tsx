'use client';

import { useEffect, useState } from 'react';

export default function ReadingProgress() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const updateProgress = () => {
            const currentProgress = window.scrollY;
            const scrollHeight = document.body.scrollHeight - window.innerHeight;
            if (scrollHeight) {
                setProgress(Number((currentProgress / scrollHeight).toFixed(2)) * 100);
            }
        };

        window.addEventListener('scroll', updateProgress);
        return () => window.removeEventListener('scroll', updateProgress);
    }, []);

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '4px',
            zIndex: 9999,
            background: 'transparent'
        }}>
            <div style={{
                height: '100%',
                background: '#FFD700',
                width: `${progress}%`,
                transition: 'width 0.1s ease-out',
                boxShadow: '0 0 10px rgba(255, 215, 0, 0.5)'
            }} />
        </div>
    );
}
