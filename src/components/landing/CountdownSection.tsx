import { useCountdown } from '@/hooks/useCountdown'

export function CountdownSection() {
  const { days, hours, minutes, seconds } = useCountdown()

  return (
    <section className="countdown-section">
      <p className="section-label">faltan</p>
      <div className="countdown" aria-label="Cuenta regresiva">
        <div className="countdown-item">
          <span className="countdown-num">{days}</span>
          <span className="countdown-lbl">días</span>
        </div>
        <div className="countdown-sep" aria-hidden="true">:</div>
        <div className="countdown-item">
          <span className="countdown-num">{hours}</span>
          <span className="countdown-lbl">horas</span>
        </div>
        <div className="countdown-sep" aria-hidden="true">:</div>
        <div className="countdown-item">
          <span className="countdown-num">{minutes}</span>
          <span className="countdown-lbl">minutos</span>
        </div>
        <div className="countdown-sep" aria-hidden="true">:</div>
        <div className="countdown-item">
          <span className="countdown-num">{seconds}</span>
          <span className="countdown-lbl">segundos</span>
        </div>
      </div>
      <p className="countdown-sub">para que empiece la fiesta</p>
    </section>
  )
}
