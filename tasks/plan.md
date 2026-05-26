# PLAN — SurfaceArt Palm Beach
## Dependency graph + vertical slices + acceptance criteria
### Version 1.0 · May 2026

---

## Dependency Graph

```
[1. Project Setup]
       │
       ▼
[2. DB Schema + Seed]
       │
       ├──────────────────────┐
       ▼                      ▼
[3. NextAuth]          [5. UI Base Components]
       │                      │
       ▼                      ▼
[4. API Routes] ◄─────[6. Landing Sections 1-5]
       │                      │
       ▼                      ▼
[8. Admin Layout]      [7. Quote Form + Upload]
       │
       ├──────────────────────┬─────────────────────┐
       ▼                      ▼                     ▼
[9. Quotes Table]    [11. Gallery Admin]    [11b. Reviews Admin]
       │
       ▼
[10. Quote Detail Panel]
       │
       ▼
[12. Email System]
       │
       ▼
[13. Polish + Edge Cases]
       │
       ▼
[14. README + Deploy check]
```

---

## Phase 1 — Foundation
> Checkpoint: `npm run dev` starts, DB migrates, seed runs, admin login works

### Task 1 — Project Bootstrap
**Acceptance criteria:**
- `npx create-next-app@latest` with TypeScript, Tailwind, App Router, src/ dir
- `tsconfig.json`: `strict: true`, `baseUrl: "src"`, path aliases `@/`
- `.gitignore` includes `.env.local`, `public/uploads/`, `*.db`
- `.env.local.example` with all 14 variables from SPEC §14
- `next.config.ts` configured (image domains placeholder)
- `tailwind.config.ts` with design tokens: carbon `#1C1C1A`, gold `#B8965A`, cream `#F5F0E8`, warm-white `#FAFAF7`; fonts: Cormorant Garamond + Outfit
- `npm run dev` starts without errors on port 3000

**Verification:** `npm run dev` → `http://localhost:3000` returns 200

---

### Task 2 — Prisma DB Schema + Seed
**Acceptance criteria:**
- `prisma/schema.prisma` with all 5 models: `QuoteRequest`, `QuotePhoto`, `StatusLog`, `GalleryItem`, `Testimonial`, `Setting`
- `npx prisma migrate dev --name init` runs without errors
- `prisma/seed.ts` creates:
  - 5 QuoteRequests (statuses: new, in_review, quoted, won, lost)
  - 4 GalleryItems (placeholder image paths)
  - 3 Testimonials (active)
  - 6 Settings (company name, phone, email, quote form enabled, confirmation email template, notification email template)
- `src/lib/prisma.ts` exports singleton PrismaClient
- `npx prisma db seed` runs without errors

**Verification:** `npx prisma studio` shows all seeded records

---

### Task 3 — NextAuth Authentication
**Acceptance criteria:**
- `src/lib/auth.ts` — NextAuth config with CredentialsProvider
  - Reads `ADMIN_EMAIL` + `ADMIN_PASSWORD` from env
  - Returns generic error (no hint if email exists)
  - JWT strategy, 7-day session
- `src/app/api/auth/[...nextauth]/route.ts` — handler
- `middleware.ts` — protects all `/admin/*` except `/admin/login`
  - Unauthenticated → redirect to `/admin/login`
  - Authenticated on `/admin/login` → redirect to `/admin`
- In-memory rate limiter: max 5 failed attempts per IP in 15 min → returns 429

**Verification:**
- Visit `/admin` → redirected to `/admin/login`
- Wrong credentials → "Invalid email or password" (generic)
- Correct credentials → redirected to `/admin`
- 6th failed attempt → "Too many attempts, try again in 15 minutes"

---

## Phase 2 — UI Base + Landing Core
> Checkpoint: Landing page renders with all 11 sections, no broken layouts

### Task 4 — Base UI Components
**Acceptance criteria:**
- `src/components/ui/Button.tsx` — variants: primary (gold), ghost, danger; sizes: sm, md, lg; loading state with spinner
- `src/components/ui/Input.tsx` — label, error state, helper text, required indicator
- `src/components/ui/Modal.tsx` — backdrop, close on ESC/backdrop click, focus trap
- `src/components/ui/Badge.tsx` — variants: blue, yellow, orange, purple, green, red, gray
- `src/components/ui/Spinner.tsx` — size variants
- `src/components/ui/Toast.tsx` — success/error/info; auto-dismiss 5s; stacks multiple

**Verification:** All components render in isolation without TypeScript errors

---

### Task 5 — Public Layout + Navbar
**Acceptance criteria:**
- `src/app/(public)/layout.tsx` — loads Cormorant Garamond + Outfit via `next/font`, SEO metadata, `<html lang="en">`
- `src/components/public/Navbar.tsx`:
  - Fixed position, z-50
  - Logo: "SurfaceArt" in Cormorant Garamond + "Palm Beach · Est. 2025" small
  - Links: Services | Process | Gallery | Free Quote | Contact (scroll anchors)
  - CTA "Get Free Quote" → gold button → scrolls to `#quote-form`
  - `bg-transparent` → `bg-carbon/95 backdrop-blur` transition on scroll (JS `scrollY > 50`)
  - Mobile: hamburger icon → full-screen menu overlay with links
- `src/app/(public)/page.tsx` — renders all section components with correct IDs

**Verification:** Navbar visible, scroll changes background, mobile menu works

---

### Task 6 — Hero Section
**Acceptance criteria:**
- `src/components/public/HeroSection.tsx`
- Headline: "Transform your interiors in 3 to 5 days" in Cormorant Garamond, large
- Subtitle: no demolition / no dust / 80% cheaper than renovation
- Badge: "3M DI-NOC Certified Installer · Palm Beach County" with gold border
- 2 CTAs: primary gold + ghost
- 4 animated stats (CSS counter animation on viewport entry): 500+ | 5★ | 80% | 10yr
- Background: `bg-carbon` + subtle SVG grid pattern + radial gold glow
- Decorative: CSS-only animated panel showing color/texture transformation
- Full viewport height (`min-h-screen`)

**Verification:** All elements visible, stats animate once on first scroll-into-view, fully responsive

---

### Task 7 — Services, Why Us, How It Works Sections
**Acceptance criteria:**
- `src/components/public/ServicesSection.tsx`
  - 3×2 grid (2×3 on mobile)
  - Each card: SVG icon, name, description, "From $X", install time
  - "Most Popular" badge on Kitchen Wraps
  - Hover: translateY(-4px) + gold border glow
- `src/components/public/WhyUsSection.tsx`
  - 4-column grid (2×2 on mobile)
  - 3M Certified | No Demolition | 10-Year Warranty | Premium Materials
  - Animated gold top-border on hover
- `src/components/public/HowItWorksSection.tsx`
  - 4 numbered steps (01–04) with progress connector line
  - Steps: Upload photos → Estimate 24hrs → Free consult → Installation
  - Decorative side visual

**Verification:** All cards/steps render, hover states work, mobile layouts correct

---

### Task 8 — Gallery, Materials, Testimonials, Service Areas Sections
**Acceptance criteria:**
- `src/components/public/GallerySection.tsx`
  - Fetches from `GET /api/gallery` (client component with SWR or fetch)
  - 6-item grid of before/after cards
  - CSS hover slider: before → after reveal
  - "See All Projects" button
  - Shows gradient placeholders if no DB items
- `src/components/public/MaterialsSection.tsx`
  - 4 brand blocks: 3M DI-NOC | LG Benif | Belbien | Koroseal Reatec
  - 3 quality badges
- `src/components/public/TestimonialsSection.tsx`
  - Fetches from `GET /api/testimonials`
  - Card: avatar initials, name, city, service, 5 stars, text
- `src/components/public/ServiceAreasSection.tsx`
  - SVG outline map of Palm Beach County (simplified, CSS-colored)
  - 9 city tags
- `src/components/public/Footer.tsx`
  - 4-column layout: logo+desc | services | contact | social
  - Instagram, Google Reviews, Houzz, Facebook icons
  - "Licensed & Insured · 3M DI-NOC Preferred Installer"

**Verification:** Gallery and testimonials load from DB seed data; all sections render correctly on mobile

---

## Phase 3 — Quote Form (core conversion feature)
> Checkpoint: Full quote submission saves to DB with photos

### Task 9 — Public API Routes (Gallery + Testimonials)
**Acceptance criteria:**
- `GET /api/gallery` → `GalleryItem[]` where `isPublic=true`, ordered by `order ASC`
- `GET /api/testimonials` → `Testimonial[]` where `isActive=true`, ordered by `order ASC`
- Both return 200 with JSON array; empty array if no records
- Response cached with `revalidate: 3600`

**Verification:** `curl http://localhost:3000/api/gallery` returns seeded items

---

### Task 10 — File Upload Utility + Quote Submit API
**Acceptance criteria:**
- `src/lib/upload.ts`:
  - Validates MIME type server-side using file magic bytes (not just extension)
  - Allowed: `image/jpeg`, `image/png`, `image/webp`, `image/heic`
  - Max 10MB per file
  - Saves to `/public/uploads/[quoteId]/[uuid].[ext]`
  - Resizes images > 2000px wide using `sharp`
  - Returns `{ filename, originalName, size, mimeType, url }`
- `src/lib/validations.ts` — Zod schema `QuoteSubmitSchema`:
  - Required: firstName, lastName, email, city, propertyType, services (min 1)
  - Optional: phone, budget, description, hearAboutUs
  - Email format validation
  - Phone: optional, loose format
- `POST /api/quotes/submit` (`src/app/api/quotes/submit/route.ts`):
  - Parses `multipart/form-data`
  - Validates with `QuoteSubmitSchema`
  - Creates `QuoteRequest` + `QuotePhoto` records in one transaction
  - Captures `ipAddress` + `userAgent` from request headers
  - Returns `{ success: true, quoteId: string }`
  - On validation error: `{ error: string, fields: Record<string, string> }` + 422
  - On server error: `{ error: "Submission failed, please try again" }` + 500

**Verification:** POST with FormData containing 3 images → DB has 1 QuoteRequest + 3 QuotePhotos + files exist on disk

---

### Task 11 — Quote Form Component + Photo Upload UI
**Acceptance criteria:**
- `src/components/public/PhotoUpload.tsx`:
  - Drag & drop zone + "click to browse"
  - Accepts JPG, PNG, WEBP, HEIC
  - Max 10 files, max 10MB each
  - Thumbnail previews with remove button (×)
  - Counter: "3 of 10 photos added"
  - Client-side size/type validation before upload
  - File type shown in thumbnail corner
- `src/components/public/QuoteForm.tsx`:
  - All 8 field rows from SPEC §6.10
  - Services: multi-select pill buttons (toggle on/off, gold when selected)
  - City + Property Type + Budget + Source: styled `<select>` elements
  - Real-time validation (red border + message on blur)
  - Submit button: gold, full width, with spinner while submitting
  - Upload progress: "Uploading your photos... (2/3)"
  - Success state: full-section replacement with animated checkmark + "Thank you, [FirstName]!" + next steps
  - Error state: red banner, form data preserved
  - `useQuoteForm.ts` hook manages all form state + submission logic

**Verification:**
- Submit with missing required fields → inline errors, no submission
- Submit valid form with 5 photos → success screen shows
- DB has correct record, files saved to disk

---

## Phase 4 — Admin Dashboard
> Checkpoint: Admin can log in, see all quotes, filter/sort, view details, change status

### Task 12 — Admin Layout + Sidebar
**Acceptance criteria:**
- `src/app/admin/login/page.tsx`:
  - Centered card, same brand palette
  - Email + password fields, "Sign In" button
  - Error message on failed auth (generic)
  - Redirects to `/admin` on success
- `src/app/admin/(dashboard)/layout.tsx`:
  - Two-column: fixed sidebar (240px) + main content area
  - `src/components/admin/AdminSidebar.tsx`:
    - Logo + "Admin Panel"
    - Nav links: Dashboard | Quotes | Gallery | Reviews | Settings
    - Active link highlighted in gold
    - Sign out button at bottom
  - `src/components/admin/AdminHeader.tsx`:
    - Page title (dynamic)
    - Logged-in user email
    - Current date/time (updates every minute)
    - Sign Out button

**Verification:** Login works, sidebar visible on all `/admin/*` pages, Sign Out clears session

---

### Task 13 — Admin API Routes (Quotes CRUD)
**Acceptance criteria:**
- All routes require valid NextAuth session → 401 if not
- `GET /api/admin/quotes`:
  - Query params: `page` (default 1), `limit` (default 20), `status`, `city`, `service`, `search` (name/email), `dateFrom`, `dateTo`, `sort` (createdAt|name|status), `order` (asc|desc)
  - Returns `{ data: QuoteRequest[], total, page, pages }`
  - Includes photo count per quote
- `GET /api/admin/quotes/[id]` — full record with photos + statusHistory
- `PUT /api/admin/quotes/[id]` — update status, internalNotes, quotedAmount, visitDate; creates StatusLog entry on status change
- `DELETE /api/admin/quotes/[id]` — deletes record + cascades DB + deletes files from disk
- `GET /api/admin/stats` — `{ total, today, pending, won }`

**Verification:** All endpoints return correct data; DELETE removes files from `/public/uploads/`

---

### Task 14 — Quotes Table + Filters UI
**Acceptance criteria:**
- `src/app/admin/(dashboard)/page.tsx` — stats cards + quick table
- `src/components/admin/StatsCard.tsx` — number + label + trend indicator
- `src/app/admin/(dashboard)/quotes/page.tsx`
- `src/components/admin/QuotesTable.tsx`:
  - Renders paginated table from `/api/admin/quotes`
  - All 10 columns from SPEC §7
  - Filter bar: status dropdown | city dropdown | service dropdown | date range inputs | search input (300ms debounce)
  - Sort: click column headers (date, name, status)
  - Filters persist in URL search params (shareable/bookmarkable URLs)
  - Pagination: prev/next + page numbers
  - Empty state: illustration + "No quote requests yet"
  - Row click → opens detail panel
- `src/components/admin/StatusBadge.tsx` — 7 color variants

**Verification:** Filter by status=new → only new quotes shown; search "carlos" → filters by name/email; pagination works

---

### Task 15 — Quote Detail Panel
**Acceptance criteria:**
- `src/components/admin/QuoteDetail.tsx` — slide-over drawer (right side, 560px wide)
- All information sections from SPEC §7:
  - Client info (email/phone as clickable links)
  - Request details (services as badges, full description)
  - Photos grid (thumbnails, click to lightbox)
  - Admin section (status select, internal notes textarea, quoted amount, visit date)
  - Status change log (timeline)
- `src/components/admin/PhotoLightbox.tsx` — full-screen image viewer, prev/next arrows, keyboard nav
- Download all photos: hits `GET /api/admin/quotes/[id]/photos/download` → ZIP file
- `src/app/api/admin/quotes/[id]/photos/download/route.ts`:
  - Streams ZIP of all photos using `archiver`
  - Auth-gated
- Save changes button (debounced, shows saved confirmation)
- Delete with confirmation dialog

**Verification:** Open a quote → all data visible; change status → StatusLog created; lightbox navigates photos; download returns ZIP

---

## Phase 5 — Admin Gallery, Reviews, Settings
> Checkpoint: Admin can manage all public content

### Task 16 — Gallery Admin
**Acceptance criteria:**
- `GET/POST /api/admin/gallery` + `PUT/DELETE /api/admin/gallery/[id]`
- `src/app/admin/(dashboard)/gallery/page.tsx`
- `src/components/admin/GalleryManager.tsx`:
  - Grid of all gallery items
  - Each item: before/after thumbnail pair, title, service, city, public toggle, edit/delete
  - Add new item: upload before image, upload after image, title, service, city, description fields
  - Toggle `isPublic` → instant update via PUT
  - Delete with confirmation

**Verification:** Add item → visible in admin grid and in `GET /api/gallery`; toggle isPublic=false → removed from public gallery

---

### Task 17 — Reviews Admin + Settings
**Acceptance criteria:**
- `GET/POST /api/admin/testimonials` + `PUT/DELETE /api/admin/testimonials/[id]`
- `src/app/admin/(dashboard)/reviews/page.tsx`:
  - List of all testimonials
  - Add: name, city, service, rating (1-5 stars), text
  - Toggle active/inactive
  - Delete with confirmation
- `GET/PUT /api/admin/settings`
- `src/app/admin/(dashboard)/settings/page.tsx`:
  - Company info form (name, phone, email)
  - Change admin password (current + new + confirm; validates against current)
  - Email templates (confirmation + notification) — textarea with variable hints
  - Quote form toggle (enable/disable public form)

**Verification:** Add testimonial → visible on landing; toggle off → hidden; settings save and persist

---

## Phase 6 — Email System
> Checkpoint: Submissions trigger both client confirmation and admin notification emails

### Task 18 — Email Templates + Nodemailer
**Acceptance criteria:**
- `src/lib/email.ts`:
  - `sendConfirmationEmail(quote)` — HTML email to client
  - `sendNotificationEmail(quote)` — HTML email to admin (`NOTIFICATION_EMAIL`)
  - `sendCustomEmail({ to, subject, html })` — used from admin panel
  - Uses Nodemailer with `SMTP_HOST/PORT/USER/PASS` env vars
  - Falls back gracefully if SMTP not configured (logs to console in dev)
- Client confirmation HTML:
  - SurfaceArt branding (logo text, gold color scheme)
  - "Hi [FirstName]!" greeting
  - Services summary, city, photo count
  - 3-step "what happens next" section
  - Contact info footer
- Admin notification HTML:
  - Full client data table
  - Direct link to `/admin/quotes/[id]`
  - All services + budget + description
- Wire emails into `POST /api/quotes/submit`:
  - Send both emails after successful DB save
  - If email fails: log error, still return success to client
- `POST /api/admin/send-email`:
  - Auth-gated
  - Body: `{ quoteId, to, subject, html }`
  - Uses `sendCustomEmail`
- `src/components/admin/EmailModal.tsx`:
  - Opens from Quote Detail panel
  - Pre-fills `to`, editable `subject` + `html` body
  - Send button + success/error feedback

**Verification:** Submit form → both emails received (or logged in dev); admin email modal sends correctly

---

## Phase 7 — Polish + Edge Cases
> Checkpoint: Lighthouse 90+, all edge cases handled, production-ready

### Task 19 — Animations + Scroll Reveals
**Acceptance criteria:**
- Intersection Observer–based fade-up reveal for all sections (no external lib)
- Hero stats counter animation (0 → target on viewport entry, runs once)
- Navbar scroll opacity transition (smooth)
- Before/after gallery CSS transition (clean, no flicker)
- Service cards hover animations
- Form success screen entry animation

**Verification:** Smooth on mobile, no layout shift (CLS = 0)

---

### Task 20 — Responsive + Accessibility Audit
**Acceptance criteria:**
- All breakpoints tested: 375px, 768px, 1024px, 1440px
- All `<img>` via `next/image` with descriptive `alt`
- All form inputs have `<label>` with correct `htmlFor`
- Color contrast WCAG AA (4.5:1 minimum) verified for all text
- Keyboard navigation works through entire quote form
- Focus visible on all interactive elements
- Hamburger menu accessible (aria-expanded, aria-controls)
- Admin table keyboard-navigable

**Verification:** Lighthouse Accessibility ≥ 90; no axe-core violations

---

### Task 21 — Edge Cases + Error Handling
**Acceptance criteria:**
- Photo upload: if 1 of 5 fails → continue others, show "Photo 3 failed to upload"
- Form timeout: if upload takes > 10s → show "Taking longer than expected..." message
- File disguised as image: `.exe` renamed to `.jpg` → rejected at server MIME check
- Large image (4000px wide) → resized to 2000px max before save
- Delete quote → files removed from `/public/uploads/[quoteId]/`
- Admin search debounce 300ms
- CSV export: `GET /api/admin/quotes?format=csv` → downloads all quotes as CSV
- Empty admin states: friendly illustration + message

**Verification:** Upload fake image → 422 error; large image saved as ≤2000px; delete → no orphan files

---

### Task 22 — SEO + Performance
**Acceptance criteria:**
- `src/app/(public)/layout.tsx` full metadata:
  - `title`: "SurfaceArt Palm Beach | Interior Vinyl Wraps · Palm Beach County"
  - `description`: compelling 150-char description
  - `og:title`, `og:description`, `og:image` (1200×630 placeholder)
  - `og:type: website`
  - `canonical` URL
- `next/font` for Cormorant Garamond + Outfit (no layout shift)
- All below-the-fold sections use `loading="lazy"` / dynamic import
- API responses cached appropriately
- `next.config.ts` — image optimization enabled

**Verification:** Lighthouse Performance ≥ 90; SEO ≥ 95

---

## Phase 8 — Finalization
> Final checkpoint: ready to deploy

### Task 23 — README + Deploy Config
**Acceptance criteria:**
- `README.md` covers:
  - Project overview
  - Prerequisites (Node 18+, npm)
  - Installation steps
  - All environment variables documented
  - Database setup (`prisma migrate`, `prisma db seed`)
  - Development (`npm run dev`)
  - Production build (`npm run build`)
  - Vercel deployment guide
  - SQLite → PlanetScale migration note
  - `/public/uploads/` → Cloudinary migration note
- `.gitignore` complete (env files, uploads, DB, node_modules)
- `git init`, initial commit with all files

**Verification:** Fresh clone → follow README → `npm run dev` works

---

## Summary Table

| Phase | Tasks | Deliverable |
|---|---|---|
| 1 Foundation | 1–3 | Project runs, DB works, auth works |
| 2 Landing | 4–9 | Full landing page renders, API returns data |
| 3 Quote Form | 10–11 | Form submits, photos saved, DB record created |
| 4 Admin Core | 12–15 | Admin login, quotes table, detail panel |
| 5 Admin Content | 16–17 | Gallery, reviews, settings fully managed |
| 6 Emails | 18 | Both emails fire on submission |
| 7 Polish | 19–22 | Animations, a11y, edge cases, SEO |
| 8 Ship | 23 | README, git, deploy-ready |

**Total tasks: 23**
**Estimated build sessions: 8–10 (one session per phase)**
