---
phase: 01-invitaciones-whatsapp
plan: 02
completed: 2026-07-06
duration: ~1 sesión
---

# Fase 1 · Plan 01-02: WhatsApp masivo + moderación — Summary

**Se reemplazó el envío 1-a-1 por WhatsApp por un botón único de envío masivo (abre WhatsApp con un mensaje/link genérico; en móvil permite elegir varios contactos), y se agregó un panel de moderación en el admin para listar y borrar las confirmaciones públicas.**

## Qué se construyó

| Archivo | Propósito |
|---------|-----------|
| `src/lib/qr.ts` | `getLandingUrl()` — link genérico absoluto a la landing |
| `src/lib/whatsapp.ts` | `buildGenericInviteMessage()` + `shareInvite()` (Web Share API en móvil, `wa.me` en desktop); eliminadas `buildInviteMessage`/`absoluteInviteUrl` |
| `src/pages/AdminDashboardPage.tsx` | Botón "Compartir invitación por WhatsApp" + feedback; monta el panel de moderación |
| `src/components/admin/PublicRSVPPanel.tsx` | Panel: lista `public_rsvps` (nombre, asiste, personas, fecha) + borrar con confirmación |
| `src/components/admin/GuestTable.tsx` | Retirado el botón WhatsApp por-invitado |
| `src/components/admin/GuestForm.tsx` | Retirado "Guardar y enviar por WhatsApp" (queda "Guardar") |

## Resultado de Acceptance Criteria

| AC | Descripción | Estado |
|----|-------------|--------|
| AC-1 | Envío masivo con un tap (abre WhatsApp) | Pass — verificado en desktop (abre `wa.me`). Multi-contacto vía Web Share queda por probar en deploy móvil |
| AC-2 | Comportamiento sin Web Share | Pass — **ajustado por feedback**: abre WhatsApp (`wa.me`), NO copia al portapapeles |
| AC-3 | Panel de moderación (listar/borrar) | Pass — verificado por el usuario |
| AC-4 | Retiro del envío 1-a-1 obsoleto | Pass — sin código muerto |

## Verificación

- `npm run build`: ✓
- `npm test`: 21/22 (falla preexistente `useCountdown`, ajena)
- Checkpoint human-verify: **aprobado** por el usuario ("perfecto") probando en `npm run dev` (desktop).

## Desviaciones

- **Reconciliación de rama**: el trabajo de WhatsApp del usuario estaba sin commitear en `feature/whatsapp-invites-eclesiastes`. Se commiteó (`c1eb39c`) y se mergeó a `feature/paul-init` (`f4e8596`) sin conflictos, antes de ejecutar el plan.
- **AC-4 (retiro del 1-a-1)**: inicialmente se conservó (para no destruir trabajo recién hecho) y se consultó; el usuario eligió retirarlo → implementado.
- **AC-2 (fallback)**: el plan preveía copiar al portapapeles; por feedback del usuario se cambió a abrir WhatsApp directamente.
- **Web Share multi-contacto**: no verificable en desktop; requiere deploy HTTPS + móvil.

## Decisiones / patrones

- Un solo flujo de invitación por WhatsApp: masivo genérico (se descartó el 1-a-1 con link personalizado).
- `shareInvite()` prioriza `navigator.share` (móvil multi-contacto) con fallback a `wa.me`.
- Panel de moderación replica el patrón de `SongSuggestionsPanel`.

## Próximo

Fase 1 completa. Trabajo futuro sugerido (deferred issues): fix de datos hardcodeados (nombres "Cecilia" vs "Valentina", fecha 2025 vs 2027, datos del evento en `InvitePage`), y decidir el retiro del flujo `/invite/:code` viejo si el cliente valida el modelo público.

---
*Completado: 2026-07-06*
