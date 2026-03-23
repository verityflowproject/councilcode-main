import Navbar from '@/components/landing/Navbar'
import Hero from '@/components/landing/Hero'
import ProcessSection from '@/components/landing/ProcessSection'
import ModelCards from '@/components/landing/ModelCards'
import FAQ from '@/components/landing/FAQ'
import Footer from '@/components/landing/Footer'

export default function HomePage() {
  return (
    <main style={{ background: 'var(--background)' }}>
      <Navbar />
      <Hero />
      <ProcessSection />
      <ModelCards />
      <FAQ />
      <Footer />
    </main>
  )
}
