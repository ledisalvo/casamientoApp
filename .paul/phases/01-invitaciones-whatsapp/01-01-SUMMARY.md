---
phase: 01-invitaciones-whatsapp
plan: 01
completed: 2026-07-06
duration: ~1 sesión
---

# Fase 1 · Plan 01-01: RSVP público en la landing — Summary

**Se agregó una confirmación de asistencia pública en la landing (link genérico, nombre libre + cantidad) guardada en una tabla nueva `public_rsvps`, con RLS que permite insertar de forma anónima pero restringe lectura/borrado al admin. Primer paso del modelo estilo latarjetadigital que habilita el envío masivo por WhatsApp.**

## Qué se construyó

| Archivo | Propósito |
|---------|-----------|
| `supabase/migrations/008_public_rsvps.sql` | Tabla `public_rsvps` + índice + RLS (insert anon; select/delete solo authenticated) |
| `src/types/index.ts` | Interface `PublicRSVP` |
| `src/lib/queries.ts` | `submitPublicRSVP`, `listPublicRSVPs`, `deletePublicRSVP` |
| `src/components/landing/RSVPSection.tsx` | Sección de confirmación: nombre (pre-llenado por `?n=`), toggle accesible, stepper +/- touch-friendly, confirmación inline |
| `src/styles/landing.css` | Estilos `.rsvp-*` + `.fade-in-up` con `prefers-reduced-motion` |
| `src/pages/HomePage.tsx` | Monta `<RSVPSection />` (tras Dress code, antes de Regalos); comentario obsoleto actualizado |

## Resultado de Acceptance Criteria

| AC | Descripción | Estado |
|----|-------------|--------|
| AC-1 | Confirmación pública desde la landing → persiste en `public_rsvps` + confirmación inline | Pass (verificado por el usuario) |
| AC-2 | `?n=` pre-llena el nombre; sin param arranca vacío | Pass |
| AC-3 | RLS: anon inserta; anon NO lee/borra; admin sí | Pass (verificado por el usuario aplicando la migración) |
| AC-4 | Validación (nombre requerido) + estados enviando/éxito/error | Pass |

## Verificación

- `npm run build` (tsc -b + vite build): ✓ sin errores de TypeScript
- `npm test`: 21/22 pass. El único fallo (`useCountdown.test.ts`) es **preexistente y ajeno** a este plan.
- Checkpoint human-verify: **aprobado** por el usuario (migración aplicada, flujo probado en navegador, RLS confirmada).

## Desviaciones

- **Task 1 (migración) no aplicada por el agente**: sin entorno Supabase en el job; la aplicó el usuario durante el checkpoint. Sin impacto en el resultado.
- **Test `useCountdown.test.ts` en rojo (preexistente)**: espera countdown vencido pero `TARGET=2027-02-05`. Es síntoma del deferred issue de fecha (hero/countdown 2025 vs 2027). No se tocó por estar fuera del scope.

## Decisiones / patrones

- RLS de `public_rsvps` replica el patrón de `rsvp_responses` (anon insert / admin all).
- El modelo viejo (`guests`/`rsvp_responses`/`/invite/:code`) quedó **intacto** (reversibilidad del MVP).
- Estilos reutilizan clases de landing (`.section-label`, `.btn-solid`) para consistencia visual.

## Próximo

Plan **01-02**: botón "Compartir por WhatsApp" (Web Share API, envío masivo con mensaje/link genérico) + panel de moderación en el admin (listar/borrar confirmaciones vía `listPublicRSVPs`/`deletePublicRSVP`).

⚠️ **Reconciliación pendiente:** el código de WhatsApp del usuario (`src/lib/whatsapp.ts`, `GuestTable`, `GuestForm`) está **sin commitear** en la rama `feature/whatsapp-invites-eclesiastes` del checkout principal; este worktree salió de `main` y no lo incluye. Hay que coordinar antes de ejecutar el 01-02.

---
*Completado: 2026-07-06*
