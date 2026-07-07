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
| 1 | UX flujo de invitación | 1 | Planning | - |

## Phase Details

### Phase 1: UX flujo de invitación

**Goal:** Pulir la experiencia de UX/diseño del flujo de invitación del invitado (`/invite/:code`) en móvil, sin cambiar la lógica de negocio.
**Depends on:** Nothing (primera fase)
**Research:** Unlikely (patrones internos de UI, sin nuevas dependencias)

**Scope:**
- Loader de marca y transiciones suaves de entrada entre estados
- Stepper de asistentes touch-friendly (reemplaza input number)
- Foco visible y toggle "¿Asistís?" accesible por teclado
- Respeto de `prefers-reduced-motion`

**Plans:**
- [ ] 01-01: Pulido UX del flujo de invitación del invitado

_Fases siguientes se definirán en próximos `/paul:plan` (ej. fix de datos hardcodeados, UX de landing, UX de admin)._

---
*Roadmap created: 2026-07-06*
*Last updated: 2026-07-06*
