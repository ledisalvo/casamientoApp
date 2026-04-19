import { useState, useEffect } from 'react'
import { getQuote } from '@/lib/queries'

const FALLBACK = {
  text:   'Te amo sin saber cómo, ni cuándo, ni de dónde.\nTe amo directamente, sin problemas ni orgullo:\nasí te amo porque no sé amar de otra manera.',
  author: '— Pablo Neruda',
}

export function QuoteSection() {
  const [quote, setQuote] = useState(FALLBACK)

  useEffect(() => {
    getQuote().then((q) => { if (q?.text) setQuote(q) })
  }, [])

  return (
    <section className="quote-section">
      <blockquote>
        {quote.text.split('\n').map((line, i) => (
          <span key={i}>{line}{i < quote.text.split('\n').length - 1 && <br />}</span>
        ))}
      </blockquote>
      <cite>{quote.author}</cite>
    </section>
  )
}
