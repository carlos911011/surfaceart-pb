# SPEC — SurfaceArt Palm Beach
## Version 1.0 · May 2026

---

## 1. OBJECTIVE

Build a full-stack production website for **SurfaceArt Palm Beach**, an LLC in Palm Beach County, Florida that specializes in residential and commercial interior vinyl wraps (kitchens, TV walls, accent walls, bathrooms, furniture) using premium architectural vinyl (3M DI-NOC, LG Benif, Belbien, Reatec) — no demolition, no renovation.

**Target users:**
- **Public visitors** — affluent homeowners and commercial property owners in Palm Beach County seeking premium, non-destructive surface transformation quotes.
- **Admin (business owner)** — manages incoming quote requests, tracks leads through a sales pipeline, controls gallery and testimonials on the public site.

**Success criteria:**
- A visitor can submit a Free Quote request with up to 10 photos in under 3 minutes.
- The business owner receives an email notification within seconds of each submission.
- The admin can log in securely, review every submission with its photos, change status, add internal notes, and send emails to clients.
- The site scores 90+ on Lighthouse for Performance, Accessibility, and SEO.
- Fully deployable to Vercel with zero configuration beyond environment variables.

---

## 2. TECH STACK

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js 14+ (App Router) | TypeScript strict mode |
| Styling | Tailwind CSS | No shadcn/MUI — custom components only |
| Database | SQLite via Prisma ORM | `DATABASE_URL="file:./dev.db"` |
| Auth | NextAuth.js v5 (CredentialsProvider) | JWT sessions, 7-day expiry |
| Email | Nodemailer | SMTP configurable via env vars |
| File storage | `/public/uploads/` (local) | Server-side resize to max 2000px wide |
| Fonts | `next/font` — Cormorant Garamond + Outfit | Google Fonts |
| Images | `next/image` | Lazy loading, optimized |
| Validation | Zod | Client + server |
| Deployment | Vercel | SQLite persisted via Vercel file system or migrate to PlanetScale for prod |

---

## 3. DESIGN TOKENS

```
Colors:
  carbon:   #1C1C1A  (backgrounds, dark surfaces)
  gold:     #B8965A  (accents, CTAs, borders)
  cream:    #F5F0E8  (light backgrounds)
  warm-white: #FAFAF7 (page background)

Typography:
  headings: Cormorant Garamond (serif)
  body:     Outfit (sans-serif)

Aesthetic: luxury refined — Palm Beach premium market
Responsive: mobile-first, fully responsive
Animations: subtle scroll fade-up/reveal, no jarring motion
```

---

## 4. PROJECT STRUCTURE

```
surfaceart-pb/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── public/
│   ├── uploads/           # client photos (gitignored)
│   └── images/            # static assets
├── src/
│   ├── app/
│   │   ├── (public)/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx   # landing page
│   │   │   └── gallery/page.tsx
│   │   ├── admin/
│   │   │   ├── login/page.tsx
│   │   │   └── (dashboard)/
│   │   │       ├── layout.tsx
│   │   │       ├── page.tsx
│   │   │       ├── quotes/page.tsx
│   │   │       ├── quotes/[id]/page.tsx
│   │   │       ├── gallery/page.tsx
│   │   │       ├── reviews/page.tsx
│   │   │       └── settings/page.tsx
│   │   └── api/
│   │       ├── quotes/submit/route.ts
│   │       ├── gallery/route.ts
│   │       ├── testimonials/route.ts
│   │       ├── auth/[...nextauth]/route.ts
│   │       └── admin/
│   │           ├── quotes/route.ts
│   │           ├── quotes/[id]/route.ts
│   │           ├── quotes/[id]/photos/download/route.ts
│   │           ├── gallery/route.ts
│   │           ├── gallery/[id]/route.ts
│   │           ├── testimonials/route.ts
│   │           ├── testimonials/[id]/route.ts
│   │           ├── settings/route.ts
│   │           ├── stats/route.ts
│   │           └── send-email/route.ts
│   ├── components/
│   │   ├── public/
│   │   │   ├── Navbar.tsx
│   │   │   ├── HeroSection.tsx
│   │   │   ├── ServicesSection.tsx
│   │   │   ├── WhyUsSection.tsx
│   │   │   ├── HowItWorksSection.tsx
│   │   │   ├── GallerySection.tsx
│   │   │   ├── MaterialsSection.tsx
│   │   │   ├── TestimonialsSection.tsx
│   │   │   ├── ServiceAreasSection.tsx
│   │   │   ├── QuoteForm.tsx
│   │   │   ├── PhotoUpload.tsx
│   │   │   └── Footer.tsx
│   │   ├── admin/
│   │   │   ├── AdminSidebar.tsx
│   │   │   ├── AdminHeader.tsx
│   │   │   ├── QuotesTable.tsx
│   │   │   ├── QuoteDetail.tsx
│   │   │   ├── StatusBadge.tsx
│   │   │   ├── StatsCard.tsx
│   │   │   ├── PhotoLightbox.tsx
│   │   │   ├── EmailModal.tsx
│   │   │   └── GalleryManager.tsx
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Modal.tsx
│   │       ├── Badge.tsx
│   │       ├── Spinner.tsx
│   │       └── Toast.tsx
│   ├── lib/
│   │   ├── prisma.ts
│   │   ├── auth.ts
│   │   ├── email.ts
│   │   ├── upload.ts
│   │   ├── validations.ts
│   │   └── utils.ts
│   ├── hooks/
│   │   ├── useQuoteForm.ts
│   │   └── useAdmin.ts
│   └── types/
│       └── index.ts
├── middleware.ts
├── .env.local.example
├── .gitignore
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 5. DATABASE SCHEMA (Prisma)

```prisma
model QuoteRequest {
  id            String    @id @default(cuid())
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  firstName     String
  lastName      String
  email         String
  phone         String?
  city          String
  propertyType  String
  services      String    // JSON array
  budget        String?
  description   String?
  hearAboutUs   String?
  photos        QuotePhoto[]
  status        String    @default("new")
  internalNotes String?
  quotedAmount  Float?
  visitDate     DateTime?
  statusHistory StatusLog[]
  ipAddress     String?
  userAgent     String?
}

model QuotePhoto {
  id           String       @id @default(cuid())
  quoteId      String
  quote        QuoteRequest @relation(fields: [quoteId], references: [id], onDelete: Cascade)
  filename     String
  originalName String
  size         Int
  mimeType     String
  url          String
  createdAt    DateTime     @default(now())
}

model StatusLog {
  id         String       @id @default(cuid())
  quoteId    String
  quote      QuoteRequest @relation(fields: [quoteId], references: [id], onDelete: Cascade)
  fromStatus String?
  toStatus   String
  changedAt  DateTime     @default(now())
  note       String?
}

model GalleryItem {
  id          String   @id @default(cuid())
  title       String
  service     String
  city        String?
  description String?
  beforeImage String
  afterImage  String
  isPublic    Boolean  @default(true)
  order       Int      @default(0)
  createdAt   DateTime @default(now())
}

model Testimonial {
  id         String   @id @default(cuid())
  clientName String
  city       String
  service    String
  rating     Int      @default(5)
  text       String
  isActive   Boolean  @default(true)
  order      Int      @default(0)
  createdAt  DateTime @default(now())
}

model Setting {
  id        String   @id @default(cuid())
  key       String   @unique
  value     String
  updatedAt DateTime @updatedAt
}
```

---

## 6. PUBLIC LANDING PAGE — 11 Sections

### 6.1 Navbar (fixed)
- Logo: "SurfaceArt" serif + "Palm Beach · Est. 2025" small
- Links: Services | Process | Gallery | Free Quote | Contact
- CTA: "Get Free Quote" → scrolls to form
- Mobile: hamburger menu
- Background opacity changes on scroll

### 6.2 Hero Section
- Headline: "Transform your interiors in 3 to 5 days"
- Subtitle: no demolition, no dust, 80% cheaper than renovation
- Badge: "3M DI-NOC Certified Installer · Palm Beach County"
- CTAs: "Get Your Free Quote" (primary gold) + "View Our Work" (ghost)
- Animated stats: 500+ surfaces | 5★ Google | 80% savings | 10-yr warranty
- Background: dark gradient + subtle grid texture + gold shimmer
- Decorative: CSS-animated kitchen transformation visual

### 6.3 Services Section (3×2 grid)
| Service | Price | Time |
|---|---|---|
| Kitchen Wraps | From $1,200 | 2-3 days |
| Custom TV Walls | From $800 | 1-2 days |
| Accent Walls | From $600 | 1 day |
| Bathroom Vanities | From $400 | 1 day |
| Countertop Wraps | From $600 | 1 day |
| Furniture & Doors | From $200/piece | — |
- Hover: elevation + gold border
- Badge "Most Popular" on Kitchen Wraps

### 6.4 Why Choose Us (4 differentiators)
3M Certified | No Demolition | 10-Year Warranty | Premium Materials

### 6.5 How It Works (4 steps)
01 Upload photos → 02 Estimate in 24hrs → 03 Free in-home consult → 04 Professional install

### 6.6 Before/After Gallery
- CSS slider on hover showing before/after
- 6 placeholders for MVP, data from `gallery_items` DB table
- "See All Projects" button

### 6.7 Materials & Quality
3M DI-NOC | LG Benif | Belbien | Koroseal Reatec
- Badges: Class A Fire Rated | 10-15 Year Lifespan | Heat & Scratch Resistant

### 6.8 Testimonials
- 3-4 cards with name, city, service, stars, text
- Avatar with initials
- Data from `testimonials` DB table

### 6.9 Service Areas
- SVG map of Palm Beach County
- Cities: West Palm Beach, Palm Beach Gardens, Jupiter, Wellington, Boca Raton, Delray Beach, Boynton Beach, Lake Worth, Royal Palm Beach

### 6.10 Free Quote Form (main conversion section)
**Fields:**
- First Name* / Last Name*
- Email* / Phone
- City (dropdown, 10 options) / Property Type (dropdown, 6 options)
- Services Interested (multi-select pills)
- Estimated Budget (dropdown, 6 options)
- Photo Upload Zone (drag & drop, max 10 photos, max 10MB each, JPG/PNG/HEIC/WEBP, with previews)
- Description textarea
- How did you hear about us (dropdown)

**Behavior:**
- Real-time client validation
- Upload progress indicator
- Success screen with client's name on submit
- On success: save to DB + send confirmation email to client + send notification email to admin
- On error: show descriptive message, retain form data

### 6.11 Footer
- Logo + description + service links + contact info + social links
- Instagram | Google Reviews | Houzz | Facebook
- "Licensed & Insured · 3M DI-NOC Preferred Installer"

---

## 7. ADMIN DASHBOARD

### Access & Security
- `/admin` → redirects to `/admin/login` if unauthenticated
- NextAuth.js CredentialsProvider (email + password from env vars)
- JWT sessions, 7-day expiry
- Middleware protection on all `/admin/*` routes
- Rate limiting: max 5 login attempts, then 15-min lockout
- CSRF protection via NextAuth
- Generic error messages (don't reveal if email exists)

### Dashboard (`/admin`)
- Stats cards: Total Quotes | New Today | Pending Review | Completed
- Quotes table with columns: # | Date | Name | Email | Phone | City | Services | Budget | Photos | Status | Actions
- Filters: Status | City | Service | Date range | Name/email search
- Sort: date (default desc), name, status
- Pagination: 20 per page
- Status badges: New (blue) | In Review (yellow) | Quoted (orange) | Scheduled (purple) | Won (green) | Lost (red) | Spam (gray)

### Quote Detail Panel (slide-over drawer)
- Client info: name, email (mailto), phone (tel), city, property type, source
- Request: services, budget, description, submitted timestamp
- Photos: grid thumbnails, lightbox, download all as ZIP
- Admin section: status selector, internal notes, quoted amount, visit date picker, status change log
- Actions: Change Status | Send Email | Copy Email | Mark Spam | Delete (with confirm)

### Admin Sections
- `/admin/gallery` — CRUD for before/after items, toggle public visibility
- `/admin/reviews` — CRUD for testimonials, toggle active
- `/admin/settings` — company info, change password, email templates, toggle quote form on/off

---

## 8. API ROUTES

### Public (unauthenticated)
```
POST /api/quotes/submit      — validate, upload photos, save to DB, send emails
GET  /api/gallery            — public gallery items (isPublic=true)
GET  /api/testimonials       — active testimonials
```

### Admin (require NextAuth session)
```
GET    /api/admin/quotes                         — paginated list with filters
GET    /api/admin/quotes/[id]                    — full detail
PUT    /api/admin/quotes/[id]                    — update status/notes/etc
DELETE /api/admin/quotes/[id]                    — delete (cascades photos)
GET    /api/admin/quotes/[id]/photos/download    — ZIP of all photos
GET    /api/admin/gallery                        — all gallery items
POST   /api/admin/gallery                        — create
PUT    /api/admin/gallery/[id]                   — edit
DELETE /api/admin/gallery/[id]                   — delete
GET    /api/admin/testimonials
POST   /api/admin/testimonials
PUT    /api/admin/testimonials/[id]
DELETE /api/admin/testimonials/[id]
GET    /api/admin/settings
PUT    /api/admin/settings
GET    /api/admin/stats
POST   /api/admin/send-email                     — send email to client
```

---

## 9. EMAIL TEMPLATES

### Client Confirmation
- Subject: "Your free quote request has been received — SurfaceArt Palm Beach"
- Branded HTML: logo, "Hi [FirstName]!", services summary, city, photo count
- "What happens next" — 3 steps
- Direct contact info
- Footer with phone, email, social

### Admin Notification
- Subject: "🔔 New Quote Request — [FirstName] [LastName] · [City] · [Services]"
- Full client data table
- Services, budget, description
- Photo count + direct link to `/admin/quotes/[id]`
- Timestamp

---

## 10. CODE STYLE

- TypeScript strict: `strict: true`, no `any` without explicit justification
- Async/await over `.then()` chains
- Zod for all input validation (client and server)
- No `console.log` in production paths; use structured error logging
- Components: named exports, one per file
- API routes: always return `{ error: string }` on failure with appropriate HTTP status
- Never expose passwords, secrets, or internal paths in API responses
- Comments only for non-obvious WHY, never for WHAT

---

## 11. SECURITY BOUNDARIES

### Always do
- Validate MIME type server-side (not just file extension) for uploads
- Sanitize any HTML before rendering in admin (internal notes)
- Protect all `/api/admin/*` routes by verifying NextAuth session
- Store uploaded photos outside `public/` or behind auth check (photos are client private data)
- Log rate-limit events

### Ask first
- Any change to the admin credentials mechanism
- Switching file storage to a third-party service (Cloudinary, S3)
- Adding new public API endpoints

### Never do
- Log passwords or secrets
- Trust file extensions alone for MIME validation
- Expose whether an admin email exists on failed login
- Serve client photos publicly without authentication check
- Skip CSRF protection on mutation endpoints
- Store unencrypted session secrets

---

## 12. TESTING STRATEGY

- **Unit tests** (Vitest): Zod validation schemas, utility functions, email template rendering
- **Integration tests** (Vitest + supertest): API routes — `POST /api/quotes/submit`, admin CRUD, auth flow
- **Auth tests**: login success/failure, rate limiting, session expiry, middleware redirect
- **E2E** (Playwright, optional): Quote form submit → admin receives it → status change flow
- Coverage targets: 80%+ on `lib/` and `api/` directories

---

## 13. EDGE CASES & BEHAVIORS

| Scenario | Behavior |
|---|---|
| User closes browser mid-form | No partial save — only save on submit |
| Photo upload fails | Continue with other photos, report which failed |
| Email send fails | Save to DB anyway, log the error |
| File disguised as image | Reject — validate actual MIME type server-side |
| Large photo (>2000px) | Resize server-side before saving |
| Upload >10s | Show visible timeout warning |
| No quotes in admin | Empty state with illustration and friendly message |
| Delete quote with photos | Cascade delete files from filesystem |
| Status change to "Won" | Prompt to send confirmation email to client |
| Search in admin | Debounce 300ms |
| Export data | CSV export of all quote data (no photos) |

---

## 14. ENVIRONMENT VARIABLES

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="generate-random-secret"
NEXTAUTH_URL="http://localhost:3000"
ADMIN_EMAIL="admin@surfaceartpb.com"
ADMIN_PASSWORD="change-this-password"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER=""
SMTP_PASS=""
NOTIFICATION_EMAIL="hello@surfaceartpb.com"
NEXT_PUBLIC_COMPANY_NAME="SurfaceArt Palm Beach"
NEXT_PUBLIC_COMPANY_PHONE="(561) 000-0000"
NEXT_PUBLIC_COMPANY_EMAIL="hello@surfaceartpb.com"
NEXT_PUBLIC_GOOGLE_MAPS_EMBED=""
```

---

## 15. SEED DATA

`prisma/seed.ts` must create:
- 5 `QuoteRequest` records with varied statuses (new, in_review, quoted, won, lost)
- 4 `GalleryItem` records (placeholder before/after images)
- 3 `Testimonial` records
- Initial `Setting` records (company name, phone, email, quote form enabled)

Run with: `npx prisma db seed`

---

## 16. DEPLOYMENT NOTES

- SQLite works on Vercel only for read-heavy workloads; for production consider migrating to PlanetScale (MySQL) or Supabase (Postgres) with minimal Prisma schema changes.
- `/public/uploads/` is ephemeral on Vercel — for production, migrate to Cloudinary or Vercel Blob.
- All environment variables must be set in Vercel dashboard.
- `next.config.ts` must allow external image domains if using Cloudinary.

---

*SPEC generated from PROMPT_SURFACEART_CLAUDECODE.md · SurfaceArt Palm Beach · May 2026*
