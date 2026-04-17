import { useState, useEffect } from 'react'

interface CountdownValues {
  days: string
  hours: string
  minutes: string
  seconds: string
}

const TARGET = new Date('2027-02-05T18:00:00')

function pad(n: number): string {
  return String(Math.max(0, n)).padStart(2, '0')
}

function calculate(): CountdownValues {
  const diff = TARGET.getTime() - Date.now()

  if (diff <= 0) {
    return { days: '00', hours: '00', minutes: '00', seconds: '00' }
  }

  const days    = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  return { days: pad(days), hours: pad(hours), minutes: pad(minutes), seconds: pad(seconds) }
}

export function useCountdown(): CountdownValues {
  const [values, setValues] = useState<CountdownValues>(calculate)

  useEffect(() => {
    const id = setInterval(() => setValues(calculate()), 1000)
    return () => clearInterval(id)
  }, [])

  return values
}
