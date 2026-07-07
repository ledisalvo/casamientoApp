# casamiento-lucas

## What This Is

A wedding invitation web app for Lucas' wedding. Guests receive a personalized invite link (shareable via QR code and WhatsApp) where they RSVP their attendance, suggest songs, and see event details — ceremony info, dress code, gift info, a photo gallery, and a live countdown. An admin dashboard lets the hosts manage the guest list, track responses in real time, and export data to CSV.

## Core Value

Guests can RSVP to the wedding in seconds from their phone, while the hosts see confirmed attendance in real time — no spreadsheets, no chasing people over WhatsApp.

## Current State

| Attribute | Value |
|-----------|-------|
| Type | Application |
| Version | 0.0.0 |
| Status | MVP (existing build, adopting PAUL) |
| Last Updated | 2026-07-06 |

**Production URLs:**
- Deployed on Vercel (SPA) — see `vercel.json`

## Requirements

### Core Features

- Personalized guest invitations at `/invite/:code` with QR code + WhatsApp sharing
- Guest RSVP flow (attendance confirmation, per-member responses)
- Public landing page: hero, live countdown, ceremony details, dress code, gift info, song suggestions, photo gallery
- Admin dashboard: login, guest-list management, response tracking, CSV export

### Validated (Shipped)

- [x] Public landing page with all sections and live countdown — implemented
- [x] Personalized invite pages with QR generation and WhatsApp share — implemented
- [x] Guest RSVP flow backed by Supabase — implemented
- [x] Song suggestions capture — implemented
- [x] Admin login + dashboard with guest management and CSV export — implemented

### Active (In Progress)

- [ ] RSVP público en la landing (link genérico, nombre libre + cantidad) — Fase 1, plan 01-01
- [ ] Envío masivo por WhatsApp desde el admin (Web Share API) + panel de moderación — Fase 1, plan 01-02

### Planned (Next)

- Fix de datos hardcodeados (nombres, fecha, datos del evento)
- Retiro del flujo viejo `/invite/:code` si el cliente valida el MVP público

### Out of Scope

- To be defined during `/paul:plan`

## Target Users

**Primary:** Wedding guests
- Access via a personal invite link on their phone
- Goal: RSVP quickly and see event details

**Secondary:** The hosts (Lucas & partner)
- Manage the guest list and track confirmations
- Export guest/response data via CSV

## Context

**Technical Context:**
Existing React + Vite + TypeScript SPA backed by Supabase (Postgres + auth). Tables: `guests`, `guest_members`, `rsvp_responses`, `song_suggestions`, `app_config`. Deployed on Vercel. Test suite via Vitest + Testing Library.

## Constraints

### Technical Constraints

- Supabase as the sole backend (Postgres, auth, RLS)
- Client-only SPA deployed to Vercel (rewrites all routes to index.html)
- Tailwind CSS 3 + Radix UI / shadcn-style components

### Business Constraints

- **Hard deadline: wedding date is 2027-02-05 18:00** — everything must be live and reliable well before this date

### Compliance Constraints

- Guest personal data (names, contact) stored in Supabase — RLS must protect it

## Key Decisions

| Decision | Rationale | Date | Status |
|----------|-----------|------|--------|
| Personalized RSVP at `/invite/:code` instead of a public form | Per-guest tracking and pre-filled member lists | 2026-07-06 | **Superseded** (2026-07-06) |
| RSVP público en la landing + envío masivo por WhatsApp (link genérico, modelo latarjetadigital) | El link único no permite enviar a varios contactos de una; WhatsApp obliga a mensaje/link idéntico para todos. Se prioriza el envío masivo sobre el pre-cargado de cupos. | 2026-07-06 | Active |
| Moderación por borrado en el admin (no se puede impedir colados con link público) | RLS: insert anónimo permitido, lectura/borrado solo admin | 2026-07-06 | Active |
| RSVP público como tabla nueva `public_rsvps` (no se toca `guests`/`rsvp_responses`) | MVP reversible, menor riesgo mientras se valida con el cliente | 2026-07-06 | Active |
| Supabase backend | Managed Postgres + auth + RLS, fast to ship | 2026-07-06 | Active |
| Vercel SPA deploy | Simple static hosting for a Vite build | 2026-07-06 | Active |

## Success Metrics

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| Guests able to RSVP from phone | 100% of invited | - | Not started |
| RSVP responses visible to hosts in real time | Yes | - | Not started |
| App stable & live before wedding | By 2027-02-05 | - | Not started |

## Tech Stack / Tools

| Layer | Technology | Notes |
|-------|------------|-------|
| Framework | React 18 + Vite 5 | SPA |
| Language | TypeScript 5 | |
| Routing | react-router-dom 7 | |
| UI | Tailwind CSS 3, Radix UI, lucide-react | shadcn-style components |
| Backend | Supabase (Postgres, Auth) | `@supabase/supabase-js` |
| Utilities | qrcode | QR generation for invites |
| Testing | Vitest + Testing Library + jsdom | `npm test` |
| Hosting | Vercel | `vercel.json` SPA rewrites |

## Links

| Resource | URL |
|----------|-----|
| Repository | (local: /home/leo/Repos/casamiento-lucas) |
| Production | Vercel deployment |

---
*PROJECT.md — Updated when requirements or context change*
*Last updated: 2026-07-06*
