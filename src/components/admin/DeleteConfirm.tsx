import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { deleteGuest } from '@/lib/queries'
import { useState } from 'react'
import type { GuestWithRSVP } from '@/types'

interface Props {
  guest:    GuestWithRSVP
  onDone:   () => void
  onClose:  () => void
}

export function DeleteConfirm({ guest, onDone, onClose }: Props) {
  const [deleting, setDeleting] = useState(false)

  async function handleConfirm() {
    setDeleting(true)
    await deleteGuest(guest.id)
    onDone()
    onClose()
  }

  return (
    <AlertDialog open onOpenChange={(open) => { if (!open) onClose() }}>
      <AlertDialogContent style={{ background: '#1e1e1e', borderColor: '#2e2e2e', color: '#e0dbd5' }}>
        <AlertDialogHeader>
          <AlertDialogTitle style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: '20px' }}>
            ¿Eliminar a {guest.name}?
          </AlertDialogTitle>
          <AlertDialogDescription style={{ color: '#7a7068' }}>
            Esta acción no se puede deshacer. Se eliminará el invitado y su confirmación si existe.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            className="admin-btn-ghost"
            style={{ background: 'transparent' }}
            onClick={onClose}
          >
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            className="admin-btn-danger"
            style={{ background: 'transparent' }}
            onClick={handleConfirm}
            disabled={deleting}
          >
            {deleting ? 'Eliminando…' : 'Eliminar'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
