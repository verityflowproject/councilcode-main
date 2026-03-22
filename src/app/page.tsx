import Navbar from '@/components/landing/Navbar'
import Hero from '@/components/landing/Hero'
import ProcessSection from '@/components/landing/ProcessSection'
import ModelCards from '@/components/landing/ModelCards'
import Footer from '@/components/landing/Footer'

export default function HomePage() {
  return (
    <main style={{ background: 'var(--background)' }}>
      <Navbar />
      <Hero />
      <ProcessSection />
      <div id="council">
        <ModelCards />
      </div>
      <Footer />
    </main>
  )
}
