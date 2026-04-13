import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RSVPForm } from '@/components/invite/RSVPForm'

// Mock submitRSVP to avoid hitting Supabase
vi.mock('@/lib/queries', () => ({
  submitRSVP: vi.fn().mockResolvedValue(undefined),
}))

const GUEST = { id: 'guest-1', name: 'Familia García', max_seats: 3 }

describe('RSVPForm', () => {
  let onSubmitted: ReturnType<typeof vi.fn>

  beforeEach(() => {
    onSubmitted = vi.fn()
  })

  it('submit button is disabled until attending is selected', () => {
    render(<RSVPForm guest={GUEST} onSubmitted={onSubmitted} />)
    expect(screen.getByRole('button', { name: /confirmar/i })).toBeDisabled()
  })

  it('shows seat count and dietary when attending = true', async () => {
    render(<RSVPForm guest={GUEST} onSubmitted={onSubmitted} />)
    await userEvent.click(screen.getByRole('radio', { name: /sí/i }))

    expect(screen.getByLabelText(/cantidad de asistentes/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/restricción alimentaria/i)).toBeInTheDocument()
  })

  it('hides seat count and dietary when attending = false', async () => {
    render(<RSVPForm guest={GUEST} onSubmitted={onSubmitted} />)
    await userEvent.click(screen.getByRole('radio', { name: /no puedo/i }))

    expect(screen.queryByLabelText(/cantidad de asistentes/i)).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/restricción alimentaria/i)).not.toBeInTheDocument()
  })

  it('shows inline error when seat count exceeds max_seats', async () => {
    render(<RSVPForm guest={GUEST} onSubmitted={onSubmitted} />)
    await userEvent.click(screen.getByRole('radio', { name: /sí/i }))

    const input = screen.getByLabelText(/cantidad de asistentes/i)
    fireEvent.change(input, { target: { value: '4' } }) // max is 3

    expect(screen.getByText(/máximo 3/i)).toBeInTheDocument()
  })

  it('does not submit when seat count exceeds max_seats', async () => {
    const { submitRSVP } = await import('@/lib/queries')
    render(<RSVPForm guest={GUEST} onSubmitted={onSubmitted} />)

    await userEvent.click(screen.getByRole('radio', { name: /sí/i }))
    fireEvent.change(screen.getByLabelText(/cantidad de asistentes/i), { target: { value: '4' } })
    await userEvent.click(screen.getByRole('button', { name: /confirmar/i }))

    await waitFor(() => expect(submitRSVP).not.toHaveBeenCalled())
    expect(onSubmitted).not.toHaveBeenCalled()
  })

  it('seat count at max_seats submits successfully', async () => {
    const { submitRSVP } = await import('@/lib/queries')
    render(<RSVPForm guest={GUEST} onSubmitted={onSubmitted} />)

    await userEvent.click(screen.getByRole('radio', { name: /sí/i }))
    fireEvent.change(screen.getByLabelText(/cantidad de asistentes/i), { target: { value: '3' } })
    await userEvent.click(screen.getByRole('button', { name: /confirmar/i }))

    await waitFor(() => expect(submitRSVP).toHaveBeenCalledWith(
      expect.objectContaining({ seatCount: 3, attending: true })
    ))
    expect(onSubmitted).toHaveBeenCalled()
  })

  it('sends dietary = ninguna when attending = false', async () => {
    const { submitRSVP } = await import('@/lib/queries')
    render(<RSVPForm guest={GUEST} onSubmitted={onSubmitted} />)

    await userEvent.click(screen.getByRole('radio', { name: /no puedo/i }))
    await userEvent.click(screen.getByRole('button', { name: /confirmar/i }))

    await waitFor(() => expect(submitRSVP).toHaveBeenCalledWith(
      expect.objectContaining({ attending: false, dietary: 'ninguna', seatCount: null })
    ))
  })
})
