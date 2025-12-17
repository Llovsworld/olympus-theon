import Hero from '@/components/Hero';
import AuthorityBar from '@/components/AuthorityBar';
import Story from '@/components/Story';
import MethodSection from '@/components/MethodSection';
import dynamic from 'next/dynamic';

// Dynamic imports for below-the-fold components to reduce initial bundle
const TestimonialsSection = dynamic(() => import('@/components/TestimonialsSection'), {
    loading: () => <div style={{ minHeight: '400px' }} />,
});
const CTASection = dynamic(() => import('@/components/CTASection'), {
    loading: () => <div style={{ minHeight: '300px' }} />,
});

export default function Home() {
    return (
        <main>
            <Hero />
            <AuthorityBar />
            <Story />
            <div id="method">
                <MethodSection />
            </div>
            <TestimonialsSection />
            <CTASection />
        </main>
    );
}
