# Project State

## Project Reference

See: .paul/PROJECT.md (updated 2026-07-06)

**Core value:** Guests can RSVP to the wedding in seconds from their phone, while the hosts see confirmed attendance in real time.
**Current focus:** Fase 1 — Invitaciones por WhatsApp + RSVP público (link genérico)

## Current Position

Milestone: v0.1 Initial Release
Phase: 1 de TBD (Invitaciones por WhatsApp + RSVP público) — Planning
Plan: 01-01 (RSVP público end-to-end) — APPLY en curso
Status: APPLY — Tasks 1-3 aplicadas y commiteadas; bloqueado en checkpoint human-verify
Last activity: 2026-07-06 — APPLY 01-01: migración 008, queries, RSVPSection en landing (commit 154d930)

Progress:
- Milestone: [░░░░░░░░░░] 0%
- Fase 1: [██░░░░░░░░] ~25% (plan 01-01 en verificación)

## Loop Position

Current loop state:
```
PLAN ──▶ APPLY ──▶ UNIFY
  ✓        ◉        ○     [Applying — esperando verificación humana]
```

## Notas de ejecución (APPLY 01-01)
- Task 1 (migración 008_public_rsvps): escrita, NO aplicada contra DB real (sin entorno Supabase en el job). El usuario debe aplicarla.
- Task 2 (queries/types) y Task 3 (RSVPSection + landing): build ✓, tests 21/22.
- ⚠️ Test `useCountdown.test.ts` falla (preexistente, ajeno): espera countdown vencido pero TARGET=2027-02-05. Ligado al deferred issue de fecha.

## Accumulated Context

### Decisions

| Decision | Phase | Impact |
|----------|-------|--------|
| Cambio de rumbo: RSVP público en landing + envío masivo WhatsApp (link genérico) | Fase 1 | Supersede el link único /invite/:code; habilita compartir a varios contactos de una |
| Moderación por borrado en el admin (colados posibles con link público) | Fase 1 | RLS: insert anónimo, lectura/borrado solo admin |
| Tabla nueva `public_rsvps` (no se toca guests/rsvp_responses) | Fase 1 | MVP reversible; menor riesgo |
| Identidad MVP: nombre libre + cantidad (a validar con el cliente) | Fase 1 | Sin control estricto de cupos por ahora |
| Personalized RSVP at `/invite/:code` | Pre-PAUL | **Superseded** por el cambio de rumbo |
| Supabase backend (Postgres, Auth, RLS) | Pre-PAUL | Sole backend |
| Vercel SPA deploy | Pre-PAUL | Static hosting of Vite build |

### Deferred Issues

| Issue | Origin | Effort | Revisit |
|-------|--------|--------|---------|
| Nombres inconsistentes: landing "Valentina" vs invite "Cecilia" | Fase 1 (plan) | S | Plan de fix de datos |
| Fecha hardcodeada: hero/invite "15·XI·2025" vs countdown 2027-02-05 | Fase 1 (plan) | S | Plan de fix de datos |
| Datos del evento hardcodeados en InvitePage (iglesia/salón/horarios) | Fase 1 (plan) | M | Plan de config dinámica |

### Blockers/Concerns
- Hard deadline: wedding is 2027-02-05 — all work must land well before this date.

## Session Continuity

Last session: 2026-07-06
Stopped at: Cambio de rumbo aplicado; plan 01-01 (RSVP público) creado
Next action: Revisar y aprobar el plan, luego correr /paul:apply .paul/phases/01-invitaciones-whatsapp/01-01-PLAN.md
Resume file: .paul/phases/01-invitaciones-whatsapp/01-01-PLAN.md

## Notas de contexto (WhatsApp feature)
- El código de WhatsApp vive SIN COMMITEAR en el checkout principal, rama `feature/whatsapp-invites-eclesiastes`:
  src/lib/whatsapp.ts (nuevo), GuestTable.tsx / GuestForm.tsx / queries.ts (modificados),
  supabase/functions/send-invite borrada. Modelo actual: mensaje personalizado + wa.me sin destinatario (1 a 1).
- El worktree de PAUL salió de origin/main; no incluye ese trabajo. Considerar al ejecutar el plan 01-02.

---
*STATE.md — Updated after every significant action*
