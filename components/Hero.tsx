"use client";

import { useEffect, useRef } from 'react';
import Link from 'next/link';

export default function Hero() {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.playbackRate = 0.8; // Slow motion effect
            videoRef.current.play().catch(error => {
                console.error("Video autoplay failed:", error);
            });
        }
    }, []);

    return (
        <section className="hero" style={{ position: 'relative', overflow: 'hidden', isolation: 'isolate', minHeight: '100vh' }}>
            {/* Video Background */}
            <video
                ref={videoRef}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                className="ken-burns"
                poster="/hero-gym.png" // Fallback image for faster LCP perception
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    zIndex: -1,
                }}
            >
                <source src="/hero-video.mp4?v=1" type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            {/* Overlay for readability */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.6) 70%, #000000 100%)',
                zIndex: 0
            }}></div>

            <div className="container hero-content" style={{ position: 'relative', zIndex: 1 }}>
                <h1 className="hero-title">FORJANDO HOMBRES DE ÉLITE</h1>
                <p className="hero-subtitle">Potenciando la masculinidad y la filosofía del esfuerzo absoluto.</p>

                <div className="hero-actions">
                    <a href="#method" className="btn btn-primary" onClick={(e) => {
                        e.preventDefault();
                        document.getElementById('method')?.scrollIntoView({ behavior: 'smooth' });
                    }}>
                        DESCUBRIR EL MÉTODO
                    </a>
                    <Link href="/programas" className="btn btn-secondary">
                        VER PROGRAMAS
                    </Link>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="scroll-indicator" onClick={() => {
                document.getElementById('method')?.scrollIntoView({ behavior: 'smooth' });
            }}>
                <div className="scroll-indicator-line"></div>
                <div className="scroll-indicator-arrows">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="7 13 12 18 17 13"></polyline>
                        <polyline points="7 6 12 11 17 6"></polyline>
                    </svg>
                </div>
                <span className="scroll-indicator-text">SCROLL</span>
            </div>
        </section>
    );
}
