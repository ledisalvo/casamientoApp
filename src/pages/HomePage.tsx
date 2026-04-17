import '@/styles/landing.css'
import { HeroSection }      from '@/components/landing/HeroSection'
import { CountdownSection } from '@/components/landing/CountdownSection'
import { QuoteSection }     from '@/components/landing/QuoteSection'
import { CeremoniaSection } from '@/components/landing/CeremoniaSection'
import { DresscodeSection } from '@/components/landing/DresscodeSection'
import { GiftSection }      from '@/components/landing/GiftSection'
import { GallerySection }   from '@/components/landing/GallerySection'
import { FooterSection }    from '@/components/landing/FooterSection'

// NOTE: No RSVP section here — RSVP is handled at /invite/:code (personalized per guest)

export function HomePage() {
  return (
    <>
      <HeroSection />
      <CountdownSection />
      <QuoteSection />
      <CeremoniaSection />
      <DresscodeSection />
      <GiftSection />
      <GallerySection />
      <FooterSection />
    </>
  )
}
