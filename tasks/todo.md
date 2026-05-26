# TODO — SurfaceArt Palm Beach
## Task checklist ordered by dependency

---

### PHASE 1 — Foundation
- [x] **T01** — Project bootstrap (Next.js 14+, Tailwind, TypeScript, design tokens, `.env.example`)
- [x] **T02** — Prisma schema (5 models) + migration + seed data
- [x] **T03** — NextAuth authentication (CredentialsProvider, middleware, rate limiting)

**CHECKPOINT 1:** `npm run dev` starts · DB migrates · admin login works

---

### PHASE 2 — UI Base + Landing
- [x] **T04** — Base UI components (Button, Input, Modal, Badge, Spinner, Toast)
- [x] **T05** — Public layout + Navbar (fixed, scroll opacity, mobile hamburger)
- [x] **T06** — Hero section (headline, stats counter, animated background)
- [x] **T07** — Services, Why Us, How It Works sections
- [x] **T08** — Gallery, Materials, Testimonials, Service Areas, Footer sections
- [x] **T09** — Public API routes (`GET /api/gallery`, `GET /api/testimonials`)

**CHECKPOINT 2:** Full landing page renders with all 11 sections · APIs return seed data

---

### PHASE 3 — Quote Form
- [x] **T10** — File upload utility + `POST /api/quotes/submit` (MIME validation, resize, DB save)
- [x] **T11** — QuoteForm component + PhotoUpload UI (drag & drop, validation, success state)

**CHECKPOINT 3:** Form submits → DB record created → photos saved to disk

---

### PHASE 4 — Admin Dashboard
- [x] **T12** — Admin login page + dashboard layout + sidebar
- [x] **T13** — Admin API routes for quotes (CRUD, pagination, filters, stats)
- [x] **T14** — Quotes table UI (filters, sort, search, pagination, empty state)
- [x] **T15** — Quote detail panel (drawer, lightbox, ZIP download, status log)

**CHECKPOINT 4:** Admin can view all quotes, filter/sort, open detail, change status

---

### PHASE 5 — Admin Content Management
- [x] **T16** — Gallery admin (CRUD, image upload, public toggle)
- [x] **T17** — Reviews admin + Settings page (company info, password change, email templates)

**CHECKPOINT 5:** Admin controls all public content (gallery, testimonials, settings)

---

### PHASE 6 — Email System
- [x] **T18** — Nodemailer + email templates + admin email modal

**CHECKPOINT 6:** Submission → client confirmation email + admin notification email sent

---

### PHASE 7 — Polish + Edge Cases
- [x] **T19** — Scroll animations + counters + hover effects
- [x] **T20** — Responsive audit + accessibility (WCAG AA)
- [x] **T21** — Edge cases (upload errors, file validation, delete cleanup, CSV export)
- [x] **T22** — SEO metadata + performance optimization

**CHECKPOINT 7:** Lighthouse 90+ on Performance, Accessibility, SEO

---

### PHASE 8 — Ship
- [x] **T23** — README.md + git init + deploy verification

**CHECKPOINT 8:** Fresh clone → README → working app · Deploy-ready

---

## Progress: 23 / 23 tasks complete ✅
