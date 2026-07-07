# Project State

## Project Reference

See: .paul/PROJECT.md (updated 2026-07-06)

**Core value:** Guests can RSVP to the wedding in seconds from their phone, while the hosts see confirmed attendance in real time.
**Current focus:** Fase 1 — Pulido UX del flujo de invitación (invitado)

## Current Position

Milestone: v0.1 Initial Release
Phase: 1 de TBD (UX flujo de invitación) — Planning
Plan: 01-01 creado, esperando aprobación
Status: PLAN creado, listo para APPLY
Last activity: 2026-07-06 — Creado .paul/phases/01-ux-flujo-invitacion/01-01-PLAN.md

Progress:
- Milestone: [░░░░░░░░░░] 0%
- Fase 1: [░░░░░░░░░░] 0%

## Loop Position

Current loop state:
```
PLAN ──▶ APPLY ──▶ UNIFY
  ✓        ○        ○     [Plan creado, esperando aprobación]
```

## Accumulated Context

### Decisions

| Decision | Phase | Impact |
|----------|-------|--------|
| Personalized RSVP at `/invite/:code` | Pre-PAUL | Per-guest tracking; no public RSVP form |
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
Stopped at: Plan 01-01 creado (Pulido UX flujo de invitación)
Next action: Revisar y aprobar el plan, luego correr /paul:apply .paul/phases/01-ux-flujo-invitacion/01-01-PLAN.md
Resume file: .paul/phases/01-ux-flujo-invitacion/01-01-PLAN.md

---
*STATE.md — Updated after every significant action*
