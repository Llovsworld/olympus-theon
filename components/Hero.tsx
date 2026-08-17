"use client";

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function Hero() {
    const t = useTranslations('Hero');
    const videoRef = useRef<HTMLVideoElement>(null);
    const [videoReady, setVideoReady] = useState(false);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        // Set playback rate
        video.playbackRate = 0.8;

        // Function to mark video as ready
        const handleVideoReady = () => {
            setVideoReady(true);
        };

        // Listen for multiple events that indicate video is ready
        video.addEventListener('canplay', handleVideoReady);
        video.addEventListener('loadeddata', handleVideoReady);
        video.addEventListener('playing', handleVideoReady);

        // Check if video is already ready (for cached videos)
        if (video.readyState >= 3) {
            handleVideoReady();
        }

        let interactionCleanup: (() => void) | undefined;

        // Try to play the video
        const playPromise = video.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.warn("Video autoplay blocked by browser policy:", error);
                setVideoReady(true);
                
                // Fallback for strict in-app browsers (Instagram, low power iOS)
                // We listen for the very first interaction to forcefully play the video
                const forcePlay = () => {
                    video.play().catch(() => {});
                    interactionCleanup?.();
                };

                interactionCleanup = () => {
                    document.removeEventListener('touchstart', forcePlay);
                    document.removeEventListener('scroll', forcePlay);
                    document.removeEventListener('click', forcePlay);
                };

                document.addEventListener('touchstart', forcePlay, { passive: true });
                document.addEventListener('scroll', forcePlay, { passive: true });
                document.addEventListener('click', forcePlay);
            });
        }

        // Fallback: show video after 2 seconds regardless
        const fallbackTimeout = setTimeout(() => {
            setVideoReady(true);
        }, 2000);

        return () => {
            video.removeEventListener('canplay', handleVideoReady);
            video.removeEventListener('loadeddata', handleVideoReady);
            video.removeEventListener('playing', handleVideoReady);
            interactionCleanup?.();
            clearTimeout(fallbackTimeout);
        };
    }, []);

    return (
        <section className="hero hero-premium">
            {/* Video Background */}
            <video
                ref={videoRef}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                className="ken-burns"
                poster="/hero-gym.png"
                src="/hero-video.mp4"
                style={{ opacity: videoReady ? 1 : 0 }}
            />

            {/* Overlay for readability */}
            <div className="hero-overlay" aria-hidden="true" />

            <div className="container hero-content">
                <p className="hero-eyebrow">{t('eyebrow')}</p>
                <h1 className="hero-title">{t('title')}</h1>
                <p className="hero-subtitle">{t('subtitle')}</p>

                <div className="hero-actions">
                    <a href="#method" className="btn btn-primary" onClick={(e) => {
                        e.preventDefault();
                        document.getElementById('method')?.scrollIntoView({ behavior: 'smooth' });
                    }}>
                        {t('primaryCta')}
                    </a>
                    <Link href="/programas" className="btn btn-secondary">
                        {t('secondaryCta')}
                    </Link>
                </div>
            </div>

            {/* Scroll Indicator */}
            <button type="button" className="scroll-indicator" onClick={() => {
                document.getElementById('method')?.scrollIntoView({ behavior: 'smooth' });
            }} aria-label={t('scroll')}>
                <div className="scroll-indicator-line"></div>
                <div className="scroll-indicator-arrows">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="7 13 12 18 17 13"></polyline>
                        <polyline points="7 6 12 11 17 6"></polyline>
                    </svg>
                </div>
                <span className="scroll-indicator-text">{t('scroll')}</span>
            </button>
        </section>
    );
}
