import '@/styles/landing.css'
import { HeroSection }      from '@/components/landing/HeroSection'
import { CountdownSection } from '@/components/landing/CountdownSection'
import { QuoteSection }     from '@/components/landing/QuoteSection'
import { CeremoniaSection } from '@/components/landing/CeremoniaSection'
import { DresscodeSection } from '@/components/landing/DresscodeSection'
import { RSVPSection }      from '@/components/landing/RSVPSection'
import { GiftSection }      from '@/components/landing/GiftSection'
import { GallerySection }          from '@/components/landing/GallerySection'
import { SongSuggestionsSection }  from '@/components/landing/SongSuggestionsSection'
import { FooterSection }           from '@/components/landing/FooterSection'

// RSVP público en la landing (link genérico). El flujo viejo /invite/:code sigue existiendo
// pero se está migrando a este modelo (ver .paul/phases/01-invitaciones-whatsapp/).

export function HomePage() {
  return (
    <>
      <HeroSection />
      <CountdownSection />
      <QuoteSection />
      <CeremoniaSection />
      <DresscodeSection />
      <RSVPSection />
      <GiftSection />
      <SongSuggestionsSection />
      <GallerySection />
      <FooterSection />
    </>
  )
}
