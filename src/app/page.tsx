import Navbar from '@/components/landing/Navbar'
import Hero from '@/components/landing/Hero'
import ProcessSection from '@/components/landing/ProcessSection'
import ComparisonSection from '@/components/landing/ComparisonSection'
import ModelCards from '@/components/landing/ModelCards'
import FAQ from '@/components/landing/FAQ'
import CTASection from '@/components/landing/CTASection'
import Footer from '@/components/landing/Footer'

export default function HomePage() {
  return (
    <main style={{ background: 'var(--bg-base)', position: 'relative', zIndex: 1 }}>
      <Navbar />
      <Hero />
      <ProcessSection />
      <ComparisonSection />
      <ModelCards />
      <FAQ />
      <CTASection />
      <Footer />
    </main>
  )
}
