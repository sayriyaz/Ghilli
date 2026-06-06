import Navigation from '@/components/Navigation'
import HeroSection from '@/components/HeroSection'
import StorySection from '@/components/StorySection'
import FlavoursSection from '@/components/FlavoursSection'
import GoliPopSection from '@/components/GoliPopSection'
import BottleFlipSection from '@/components/BottleFlipSection'
import FestivalSection from '@/components/FestivalSection'
import DealerSection from '@/components/DealerSection'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <HeroSection />
        <StorySection />
        <FlavoursSection />
        <GoliPopSection />
        <BottleFlipSection />
        <FestivalSection />
        <DealerSection />
      </main>
      <Footer />
    </>
  )
}
