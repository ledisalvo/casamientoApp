import { useState, useEffect } from 'react'
import { getQuote } from '@/lib/queries'

const FALLBACK = {
  text:   'Más valen dos que uno...\nSi caen, el uno levanta al otro...\nUno solo puede ser vencido, pero dos pueden resistir.\n¡La cuerda de tres hilos no se rompe fácilmente!',
  author: '— Eclesiastés 4:9-12',
}

export function QuoteSection() {
  const [quote, setQuote] = useState(FALLBACK)

  useEffect(() => {
    getQuote().then((q) => { if (q?.text) setQuote(q) })
  }, [])

  return (
    <section className="quote-section">
      <blockquote>
        {quote.text.split(/\\n|\n/).map((line, i, arr) => (
          <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
        ))}
      </blockquote>
      <cite>{quote.author}</cite>
    </section>
  )
}
