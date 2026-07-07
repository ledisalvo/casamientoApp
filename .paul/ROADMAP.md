# Roadmap: casamiento-lucas

## Overview

A wedding invitation web app for Lucas' wedding: personalized guest invites with RSVP, a public landing page with event details and a live countdown, and an admin dashboard for guest management and CSV export. The app already has a working MVP build; the roadmap will organize remaining hardening and polish work toward a reliable, live experience before the wedding on 2027-02-05.

## Current Milestone

**v0.1 Initial Release** (v0.1.0)
Status: In progress
Phases: 0 of TBD complete

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with [INSERTED])

Phases execute in numeric order: 1 → 2 → 2.1 → 2.2 → 3 → 3.1 → 4

| Phase | Name | Plans | Status | Completed |
|-------|------|-------|--------|-----------|
| 1 | Invitaciones por WhatsApp + RSVP público | 2 | ✅ Complete | 2026-07-06 |

## Phase Details

### Phase 1: Invitaciones por WhatsApp + RSVP público

**Goal:** Permitir enviar la invitación a varios contactos de WhatsApp de una sola vez (mensaje/link genérico) y que cada invitado confirme su asistencia en la landing pública (modelo latarjetadigital), con moderación desde el admin.
**Depends on:** Nothing (primera fase)
**Research:** Unlikely (Web Share API + Supabase RLS, patrones conocidos)

**Scope:**
- Tabla `public_rsvps` + RLS (insert anónimo, lectura/borrado solo admin)
- Sección de confirmación pública en la landing (nombre libre + cantidad, lee `?n=`)
- Botón "Compartir por WhatsApp" con Web Share API (selección múltiple de contactos, mensaje genérico + link a la landing)
- Panel de moderación en el admin (listar/borrar confirmaciones, incl. colados)

**Plans:**
- [x] 01-01: RSVP público end-to-end (tabla + RLS + confirmación en la landing) — completado 2026-07-06
- [x] 01-02: Admin — compartir por WhatsApp (envío masivo) + panel de moderación — completado 2026-07-06

_Nota: la Fase 1 anterior (pulido UX del flujo `/invite/:code`) fue archivada en `.paul/phases/_archived/` tras el cambio de rumbo. Su pulido de UI se reaprovecha en la landing._

_Fases siguientes (próximos `/paul:plan`): fix de datos hardcodeados; retiro del flujo `/invite/:code` si el cliente valida el MVP; identidad/cupos más estrictos si hiciera falta._

---
*Roadmap created: 2026-07-06*
*Last updated: 2026-07-06*
