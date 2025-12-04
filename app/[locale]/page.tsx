import Hero from '@/components/Hero';
import AuthorityBar from '@/components/AuthorityBar';
import Story from '@/components/Story';
import MethodSection from '@/components/MethodSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import CTASection from '@/components/CTASection';

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
