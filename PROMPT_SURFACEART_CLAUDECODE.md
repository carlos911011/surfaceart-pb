# PROMPT MAESTRO — SurfaceArt Palm Beach
## Website completo para negocio de Interior Wraps
### Optimizado para Claude Code + addyosmani/agent-skills

---

> **Cómo usar este prompt:**
> 1. Abre Claude Code en tu directorio de proyecto vacío
> 2. Pega este prompt completo al inicio de tu sesión
> 3. Usa los slash commands de agent-skills: `/spec` → `/plan` → `/build` → `/test` → `/review` → `/ship`
> 4. Responde las preguntas de aclaración que haga Claude Code antes de que empiece a construir

---

## CONTEXTO DEL PROYECTO

Soy dueño de una LLC en Palm Beach County, Florida. Tengo un negocio de **interior vinyl wraps** residenciales y comerciales — transformamos cocinas, paredes de TV, accent walls, baños y muebles usando vinyl arquitectónico de alta calidad (3M DI-NOC, LG Benif, Belbien, Reatec) sin demolición ni remodelación.

El mercado objetivo es Palm Beach County (West Palm Beach, Palm Beach Gardens, Jupiter, Wellington, Boca Raton) — un mercado de alto poder adquisitivo con clientes premium.

Necesito un **sitio web de producción completo**, full-stack, que tenga:
1. **Vista pública** — landing page profesional + formulario de Free Quote con carga de fotos
2. **Vista de administrador** — dashboard privado para gestionar todas las solicitudes de clientes

---

## ESPECIFICACIONES TÉCNICAS

### Stack requerido
- **Frontend:** Next.js 14+ con App Router y TypeScript
- **Styling:** Tailwind CSS con diseño premium personalizado
- **Backend:** Next.js API Routes (o Server Actions)
- **Base de datos:** SQLite con Prisma ORM (simple, sin dependencias externas para empezar)
- **Autenticación admin:** NextAuth.js con credenciales (usuario/contraseña hardcodeados para MVP)
- **Storage de imágenes:** Sistema local en `/public/uploads/` con opción de migrar a Cloudinary
- **Email:** Nodemailer con SMTP configurable por variables de entorno
- **Deployment target:** Vercel (asegúrate de que todo sea compatible)

### Variables de entorno requeridas (crear `.env.local.example`)
```
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
NEXT_PUBLIC_GOOGLE_MAPS_EMBED="" # optional
```

---

## VISTA PÚBLICA — Especificaciones detalladas

### Diseño y estética
- Paleta: negro carbón (`#1C1C1A`), dorado (`#B8965A`), crema (`#F5F0E8`), blanco cálido (`#FAFAF7`)
- Tipografía: Cormorant Garamond (serif elegante) para títulos + Outfit (sans-serif limpio) para cuerpo
- Estética: lujo refinado, apropiado para mercado premium de Palm Beach
- Completamente responsivo (mobile-first)
- Animaciones sutiles en scroll (fade-up, reveal)
- NO usar librerías de componentes genéricas (no MUI, no shadcn por defecto) — CSS custom con Tailwind

### Secciones de la landing page (en orden)

**1. Navbar fijo**
- Logo: "SurfaceArt" en serif + subtítulo "Palm Beach · Est. 2025" en pequeño
- Links: Services | Process | Gallery | Free Quote | Contact
- CTA button: "Get Free Quote" → scroll a sección de formulario
- En mobile: hamburger menu funcional
- Cambio de opacidad de fondo al hacer scroll

**2. Hero Section**
- Headline principal: "Transform your interiors in 3 to 5 days"
- Subtítulo: propuesta de valor (sin demolición, sin polvo, 80% más barato que remodelación)
- Badge: "3M DI-NOC Certified Installer · Palm Beach County"
- 2 CTAs: "Get Your Free Quote" (primary) + "View Our Work" (ghost)
- Stats animados: 500+ surfaces | 5★ Google rated | 80% savings vs renovation | 10-yr warranty
- Background: gradiente oscuro con textura de grid sutil + destellos dorados
- Elemento visual decorativo: mock animado de una cocina siendo transformada (CSS puro)

**3. Services Section**
- Título: "Surfaces that define your space"
- Grid 3x2 de tarjetas de servicios
- Cada tarjeta incluye: ícono SVG, nombre, descripción, precio "From $X", tiempo de instalación
- Servicios a incluir:
  - Kitchen Wraps (From $1,200 · 2-3 days)
  - Custom TV Walls (From $800 · 1-2 days)
  - Accent Walls (From $600 · 1 day)
  - Bathroom Vanities (From $400 · 1 day)
  - Countertop Wraps (From $600 · 1 day)
  - Furniture & Doors (From $200/piece)
- Hover effect: elevación sutil + borde dorado
- Badge: "Most Popular" en Kitchen Wraps

**4. Why Choose Us (Differentiators)**
- Grid 2x2 o 4 columnas con: 3M Certified | No Demolition | 10-Year Warranty | Premium Materials
- Cada uno: ícono, título, descripción corta
- Borde superior dorado animado al hacer hover

**5. How It Works**
- Pasos numerados (01-04) con línea de progreso visual
- Paso 1: Upload your photos & describe your vision
- Paso 2: Receive personalized estimate in 24hrs
- Paso 3: Free in-home consultation with physical samples
- Paso 4: Professional installation · Your space transformed
- Visual decorativo lateral: mock de cocina/pared con animación CSS

**6. Before/After Gallery Section**
- Título: "Real transformations, real results"
- Grid de tarjetas con efecto before/after en hover (CSS slider)
- Para el MVP: usar 6 placeholders visuales con gradientes y texto "Before / After"
- Los datos vendrán de la base de datos (tabla `gallery_items`) para que el admin pueda agregar proyectos reales
- Botón: "See All Projects"

**7. Materials & Quality Section**
- Títulos de marcas con descripción breve: 3M DI-NOC | LG Benif | Belbien | Koroseal Reatec
- Mensaje: "We source only architectural-grade vinyl films — the same materials used in luxury hotels and corporate spaces worldwide"
- Badges de calidad: Class A Fire Rated | 10-15 Year Lifespan | Heat & Scratch Resistant

**8. Testimonials/Reviews Section**
- 3-4 testimonios de clientes (placeholder para MVP, administrables desde DB)
- Cada uno: nombre, ciudad, servicio realizado, estrellas (5/5), texto del review
- Diseño tipo card con foto avatar de iniciales

**9. Service Areas Section**
- Mapa visual simplificado (SVG o imagen) de Palm Beach County
- Lista de zonas: West Palm Beach, Palm Beach Gardens, Jupiter, Wellington, Boca Raton, Delray Beach, Boynton Beach, Lake Worth, Royal Palm Beach
- Texto: "Serving all of Palm Beach County · Free in-home consultations"

**10. FREE QUOTE FORM (sección principal de conversión)**
- Título destacado: "Get Your Personalized Free Quote"
- Subtítulo: "Upload photos of your space — we'll send you a detailed estimate within 24 hours"
- Badge: "100% Free · No Obligation · Response in 24hrs"

**Campos del formulario:**
```
Fila 1: [First Name *] [Last Name *]
Fila 2: [Email Address *] [Phone Number]
Fila 3: [City/Area - dropdown] [Property Type - dropdown]
  City options: West Palm Beach | Palm Beach Gardens | Jupiter | Wellington | 
                Boca Raton | Delray Beach | Boynton Beach | Lake Worth | 
                Royal Palm Beach | Other Palm Beach County
  Property type: Single Family Home | Condo/Apartment | Townhouse | 
                  Commercial Space | Rental Property | Other

Fila 4: [Services Interested (multi-select pills/chips)]
  Options: Kitchen Wraps | Custom TV Wall | Accent Wall | Bathroom Vanity | 
            Countertop Wrap | Furniture/Doors | Full Interior Package | Not sure yet

Fila 5: [Estimated Budget - dropdown]
  Options: Under $1,000 | $1,000-$2,500 | $2,500-$5,000 | 
            $5,000-$10,000 | $10,000+ | Prefer not to say

Fila 6: [PHOTO UPLOAD ZONE - drag & drop]
  - Máximo 10 fotos
  - Formatos: JPG, PNG, HEIC, WEBP
  - Máximo 10MB por foto
  - Preview thumbnails removibles al cargar
  - Drag & drop + click to browse
  - Contador de fotos cargadas: "3 of 10 photos added"

Fila 7: [Describe what you'd like to achieve - textarea]
  Placeholder: "E.g. I have a dated oak kitchen with 18 cabinet doors. 
  Looking for a dark walnut or matte black finish. Also interested in a 
  TV accent wall with concrete or stone texture..."

Fila 8: [How did you hear about us? - dropdown]
  Options: Google Search | Instagram | TikTok | Facebook | Nextdoor | 
            Friend/Family Referral | Realtor Referral | Other

[SUBMIT BUTTON]: "Request My Free Quote →"
[Privacy note]: "🔒 We never share your info. No spam, ever."
```

**Comportamiento del formulario:**
- Validación client-side en tiempo real (campos requeridos, formato email, tamaño de fotos)
- Indicador de progreso mientras sube (spinner + "Uploading your photos...")
- Al submit exitoso: pantalla de éxito con animación y mensaje personalizado con el nombre del cliente
- Al submit exitoso: 
  1. Guardar todo en la base de datos (tabla `quote_requests`)
  2. Enviar email de confirmación al cliente
  3. Enviar email de notificación al admin con todos los datos
- En caso de error: mensaje descriptivo, NO perder los datos del formulario

**11. Contact / Footer**
- Footer completo con: Logo, descripción, links de servicios, info de contacto, redes sociales
- Datos de contacto: teléfono, email, área de servicio
- Links: Instagram, Google Reviews, Houzz, Facebook
- Copyright + "Licensed & Insured · 3M DI-NOC Preferred Installer"
- Barra inferior: copyright + certificaciones

---

## VISTA ADMINISTRADOR — Especificaciones detalladas

### Acceso y seguridad
- URL: `/admin` → redirige a `/admin/login` si no está autenticado
- Login con email + password (usando NextAuth.js con CredentialsProvider)
- Session persistente con JWT (7 días)
- Middleware de protección en todas las rutas `/admin/*`
- Rate limiting en el endpoint de login (max 5 intentos, luego bloqueo 15 min)
- CSRF protection incluida con NextAuth

### Página de Login (`/admin/login`)
- Diseño minimalista, elegante, mismo brand
- Logo + "Admin Panel"
- Campos: Email + Password
- Botón: "Sign In"
- Mensaje de error claro si credenciales incorrectas
- NO revelar si el email existe o no (mensaje genérico de error)

### Dashboard Principal (`/admin`)

**Header del admin:**
- Logo + "Admin Dashboard"
- Nombre del usuario logueado
- Botón "Sign Out"
- Fecha y hora actual

**Stats Cards (fila superior):**
- Total Quote Requests (número + comparación vs mes anterior)
- New Today (solicitudes de hoy)
- Pending Review (sin responder)
- Completed / Closed

**Tabla principal de Quote Requests:**

Columnas:
```
# | Date | Name | Email | Phone | City | Services | Budget | Photos | Status | Actions
```

Funcionalidades de la tabla:
- **Filtros:** por Status | por City | por Service | por rango de fechas | búsqueda por nombre/email
- **Ordenamiento:** por fecha (default: más reciente primero), nombre, status
- **Paginación:** 20 items por página con navegación
- **Status badges:** 
  - `New` (azul) — recién llegado
  - `In Review` (amarillo) — siendo procesado
  - `Quoted` (naranja) — cotización enviada
  - `Scheduled` (morado) — visita agendada
  - `Won` (verde) — proyecto cerrado
  - `Lost` (rojo) — no cerrado
  - `Spam` (gris) — marcado como spam
- **Acciones por fila:** Ver detalles | Cambiar status | Enviar email | Notas | Eliminar

**Modal/Drawer de detalle de solicitud:**
Al hacer click en una solicitud, se abre un panel lateral o modal con:

```
INFORMACIÓN DEL CLIENTE
- Nombre completo
- Email (clickeable, abre email client)
- Teléfono (clickeable, llama en mobile)
- Ciudad / Área
- Tipo de propiedad
- Cómo nos encontraron

SOLICITUD
- Servicios de interés (badges)
- Presupuesto estimado
- Descripción del cliente (texto completo)
- Fecha y hora de envío

FOTOS DEL CLIENTE
- Grid de thumbnails de las fotos subidas
- Click para ver en full-size (lightbox)
- Botón para descargar todas las fotos (ZIP)
- Contador: "X photos uploaded"

GESTIÓN INTERNA (solo visible en admin)
- Status selector (dropdown)
- Notas internas (textarea — el cliente NO las ve)
- Cotización enviada (checkbox + monto)
- Fecha de visita programada (date picker)
- Historial de cambios de status (log)

ACCIONES
- [Cambiar Status]
- [Enviar Email al Cliente] → modal con template editable
- [Copiar Email]
- [Marcar como Spam]
- [Eliminar] → confirmación requerida
- [Cerrar panel]
```

**Sección de Galería Admin (`/admin/gallery`):**
- Ver todas las fotos de galería (items before/after)
- Agregar nuevo item: subir foto before, foto after, título, servicio, ciudad, descripción
- Editar / eliminar items
- Toggle: mostrar/ocultar en web pública

**Sección de Reseñas Admin (`/admin/reviews`):**
- Ver todos los testimonios
- Agregar nuevo: nombre, ciudad, servicio, rating, texto
- Editar / eliminar
- Toggle: activo/inactivo

**Sección de Configuración (`/admin/settings`):**
- Datos de la empresa (nombre, teléfono, email, dirección) — editables
- Cambiar contraseña del admin
- Templates de emails (editable para email de confirmación y notificación)
- Toggle: activar/desactivar el formulario de quotes en la web pública

---

## BASE DE DATOS — Schema Prisma completo

```prisma
model QuoteRequest {
  id            String    @id @default(cuid())
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  // Cliente
  firstName     String
  lastName      String
  email         String
  phone         String?
  city          String
  propertyType  String
  
  // Solicitud
  services      String    // JSON array de servicios seleccionados
  budget        String?
  description   String?
  hearAboutUs   String?
  
  // Fotos
  photos        QuotePhoto[]
  
  // Admin
  status        String    @default("new") // new|in_review|quoted|scheduled|won|lost|spam
  internalNotes String?
  quotedAmount  Float?
  visitDate     DateTime?
  statusHistory StatusLog[]
  
  // Metadata
  ipAddress     String?
  userAgent     String?
}

model QuotePhoto {
  id            String       @id @default(cuid())
  quoteId       String
  quote         QuoteRequest @relation(fields: [quoteId], references: [id], onDelete: Cascade)
  filename      String
  originalName  String
  size          Int
  mimeType      String
  url           String
  createdAt     DateTime     @default(now())
}

model StatusLog {
  id            String       @id @default(cuid())
  quoteId       String
  quote         QuoteRequest @relation(fields: [quoteId], references: [id], onDelete: Cascade)
  fromStatus    String?
  toStatus      String
  changedAt     DateTime     @default(now())
  note          String?
}

model GalleryItem {
  id            String    @id @default(cuid())
  title         String
  service       String
  city          String?
  description   String?
  beforeImage   String
  afterImage    String
  isPublic      Boolean   @default(true)
  order         Int       @default(0)
  createdAt     DateTime  @default(now())
}

model Testimonial {
  id            String    @id @default(cuid())
  clientName    String
  city          String
  service       String
  rating        Int       @default(5)
  text          String
  isActive      Boolean   @default(true)
  order         Int       @default(0)
  createdAt     DateTime  @default(now())
}

model Setting {
  id            String    @id @default(cuid())
  key           String    @unique
  value         String
  updatedAt     DateTime  @updatedAt
}
```

---

## API ROUTES / SERVER ACTIONS requeridos

### Público (sin autenticación)
```
POST /api/quotes/submit
  - Valida todos los campos
  - Sube las fotos al directorio /public/uploads/[quoteId]/
  - Guarda en DB
  - Envía email de confirmación al cliente
  - Envía email de notificación al admin
  - Returns: { success: true, quoteId: string }

GET /api/gallery
  - Retorna todos los GalleryItems con isPublic=true

GET /api/testimonials
  - Retorna todos los Testimonials con isActive=true
```

### Admin (requieren autenticación)
```
GET  /api/admin/quotes           — Lista paginada con filtros
GET  /api/admin/quotes/[id]      — Detalle completo de una solicitud
PUT  /api/admin/quotes/[id]      — Actualizar status, notas, etc.
DELETE /api/admin/quotes/[id]    — Eliminar solicitud
GET  /api/admin/quotes/[id]/photos/download  — ZIP de fotos

GET  /api/admin/gallery          — Lista de items de galería
POST /api/admin/gallery          — Crear item
PUT  /api/admin/gallery/[id]     — Editar item
DELETE /api/admin/gallery/[id]   — Eliminar item

GET  /api/admin/testimonials     — Lista de testimonios
POST /api/admin/testimonials     — Crear
PUT  /api/admin/testimonials/[id]
DELETE /api/admin/testimonials/[id]

GET  /api/admin/settings         — Obtener configuración
PUT  /api/admin/settings         — Actualizar configuración
GET  /api/admin/stats            — Stats del dashboard

POST /api/admin/send-email       — Enviar email al cliente desde admin
```

---

## ESTRUCTURA DE ARCHIVOS esperada

```
surfaceart-pb/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts                    # Datos iniciales (1 admin, 3 testimonios, 3 gallery items)
├── public/
│   ├── uploads/                   # Fotos de clientes
│   └── images/                    # Assets estáticos
├── src/
│   ├── app/
│   │   ├── (public)/              # Route group público
│   │   │   ├── page.tsx           # Landing page principal
│   │   │   ├── layout.tsx
│   │   │   └── gallery/
│   │   │       └── page.tsx       # Galería completa
│   │   ├── admin/                 # Route group admin
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── (dashboard)/       # Layout con sidebar
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── page.tsx       # Dashboard principal
│   │   │   │   ├── quotes/
│   │   │   │   │   ├── page.tsx   # Lista de solicitudes
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── page.tsx # Detalle de solicitud
│   │   │   │   ├── gallery/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── reviews/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── settings/
│   │   │   │       └── page.tsx
│   │   └── api/
│   │       ├── quotes/
│   │       │   └── submit/
│   │       │       └── route.ts
│   │       ├── gallery/
│   │       │   └── route.ts
│   │       ├── testimonials/
│   │       │   └── route.ts
│   │       ├── auth/
│   │       │   └── [...nextauth]/
│   │       │       └── route.ts
│   │       └── admin/
│   │           ├── quotes/
│   │           ├── gallery/
│   │           ├── testimonials/
│   │           ├── settings/
│   │           ├── stats/
│   │           └── send-email/
│   ├── components/
│   │   ├── public/                # Componentes de la landing
│   │   │   ├── Navbar.tsx
│   │   │   ├── HeroSection.tsx
│   │   │   ├── ServicesSection.tsx
│   │   │   ├── WhyUsSection.tsx
│   │   │   ├── HowItWorksSection.tsx
│   │   │   ├── GallerySection.tsx
│   │   │   ├── MaterialsSection.tsx
│   │   │   ├── TestimonialsSection.tsx
│   │   │   ├── ServiceAreasSection.tsx
│   │   │   ├── QuoteForm.tsx      # Formulario principal
│   │   │   ├── PhotoUpload.tsx    # Componente de upload
│   │   │   └── Footer.tsx
│   │   ├── admin/                 # Componentes del dashboard
│   │   │   ├── AdminSidebar.tsx
│   │   │   ├── AdminHeader.tsx
│   │   │   ├── QuotesTable.tsx
│   │   │   ├── QuoteDetail.tsx
│   │   │   ├── StatusBadge.tsx
│   │   │   ├── StatsCard.tsx
│   │   │   ├── PhotoLightbox.tsx
│   │   │   ├── EmailModal.tsx
│   │   │   └── GalleryManager.tsx
│   │   └── ui/                    # Componentes reutilizables
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Modal.tsx
│   │       ├── Badge.tsx
│   │       ├── Spinner.tsx
│   │       └── Toast.tsx
│   ├── lib/
│   │   ├── prisma.ts              # Cliente de Prisma (singleton)
│   │   ├── auth.ts                # Configuración de NextAuth
│   │   ├── email.ts               # Funciones de Nodemailer
│   │   ├── upload.ts              # Manejo de subida de archivos
│   │   ├── validations.ts         # Zod schemas para validación
│   │   └── utils.ts               # Helpers generales
│   ├── hooks/
│   │   ├── useQuoteForm.ts        # Lógica del formulario
│   │   └── useAdmin.ts            # Hooks del admin
│   └── types/
│       └── index.ts               # TypeScript interfaces
├── middleware.ts                   # Protección de rutas admin
├── .env.local.example
├── .gitignore
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## EMAILS — Templates requeridos

### Email de confirmación al cliente (HTML)
```
Asunto: "Your free quote request has been received — SurfaceArt Palm Beach"

Contenido:
- Logo y branding de SurfaceArt
- "Hi [FirstName], we've received your quote request!"
- Resumen: servicios solicitados, ciudad, número de fotos subidas
- "What happens next:" — 3 pasos (1. We review your photos 2. We prepare your estimate 3. We contact you within 24hrs)
- Datos de contacto directo si necesitan hablar antes
- Footer con logo, teléfono, email, redes sociales
```

### Email de notificación al admin (HTML)
```
Asunto: "🔔 New Quote Request — [FirstName] [LastName] · [City] · [Services]"

Contenido:
- Todos los datos del cliente en formato tabla
- Lista de servicios solicitados
- Presupuesto mencionado
- Descripción completa del cliente
- Número de fotos subidas + link al admin panel
- Botón: "View Full Request →" → link directo a /admin/quotes/[id]
- Timestamp del envío
```

---

## COMPORTAMIENTOS Y EDGE CASES a manejar

### Formulario de Quote
- Si el usuario cierra el navegador a mitad del formulario: NO guardar datos incompletos (guardar solo al submit)
- Si falla el upload de una foto: continuar con las otras, informar qué foto falló
- Si falla el envío de email: guardar la solicitud en DB de todas formas, loggear el error
- Si hay fotos sin descripción o descripción sin fotos: ambos son válidos, no requerir ambos
- Validar que los archivos sean realmente imágenes (no confiar solo en la extensión)
- Redimensionar fotos grandes en el server-side antes de guardar (max 2000px de ancho)
- Timeout visible si el upload toma más de 10 segundos

### Panel de Admin
- Si no hay solicitudes: empty state con ilustración y mensaje amigable
- Si se elimina una solicitud con fotos: eliminar también los archivos del filesystem
- Paginación: mantener los filtros activos al cambiar de página
- Al cambiar status: confirmar si el cambio implica acción (ej: "Won" → preguntar si quieres enviar email de confirmación)
- Búsqueda con debounce de 300ms
- Exportar a CSV: todos los datos de solicitudes (sin fotos)

---

## DATOS SEED para desarrollo

```typescript
// prisma/seed.ts — ejecutar con: npx prisma db seed
// Crear estos datos de prueba:

// 5 quote requests de ejemplo con diferentes estados
// 4 gallery items (before/after con imágenes placeholder)
// 3 testimonios de clientes
// Settings iniciales de la empresa
```

---

## INSTRUCCIONES PARA CLAUDE CODE

### Orden de ejecución recomendado con agent-skills:

**FASE 1 — SPEC** (usa `/spec`)
Primero ejecuta `/spec` con toda la información de este prompt para crear un SPEC.md detallado antes de escribir código.

**FASE 2 — PLAN** (usa `/plan`)
Ejecuta `/plan` para descomponer el trabajo en tareas atómicas pequeñas. Crea el archivo `tasks/todo.md` con todas las tareas.

**FASE 3 — BUILD** (usa `/build` incremental)
Construye en este orden estricto:
1. Setup del proyecto (Next.js, Prisma, deps)
2. Schema de DB + migrations + seed
3. Autenticación con NextAuth
4. API Routes del backend
5. Componentes UI base (Button, Input, Modal, Badge)
6. Landing page — sección por sección
7. Formulario de quote con upload
8. Dashboard admin — layout y sidebar
9. Tabla de quotes con filtros
10. Detail panel de solicitudes
11. Galería y testimonios admin
12. Sistema de emails
13. Polish final (animaciones, responsive, edge cases)

**FASE 4 — TEST** (usa `/test`)
- Tests de las API routes (validación, autenticación, manejo de errores)
- Tests del formulario (validación client-side, submit, estados de error)
- Tests de autenticación admin

**FASE 5 — REVIEW** (usa `/review` y `/ship`)
- Revisar seguridad de uploads de archivos
- Verificar que no hay rutas admin sin protección
- Check de performance (imágenes, bundle size)
- Verificar compatibilidad con Vercel deployment

### Principios que debe seguir agent-skills:
- **spec-driven-development**: No escribir código sin spec aprobado
- **incremental-implementation**: Un slice a la vez, nunca romper lo que ya funciona  
- **test-driven-development**: Tests para lógica crítica (auth, upload, email)
- **security-and-hardening**: Sanitizar todos los inputs, validar tipos de archivo, rate limiting
- **frontend-ui-engineering**: Componentes accesibles, responsive, con estados de loading/error
- **api-and-interface-design**: APIs consistentes, errores descriptivos, tipado estricto

---

## NOTAS FINALES

1. **Nombre de la empresa:** Usa "SurfaceArt Palm Beach" en todo el código pero asegúrate de que sea configurable via `NEXT_PUBLIC_COMPANY_NAME` en `.env`

2. **SEO:** Incluir metadata completa en `layout.tsx` — title, description, og:image, og:title para las páginas públicas

3. **Accesibilidad:** Todos los formularios deben tener labels correctos, imágenes con alt text, contraste suficiente (WCAG AA mínimo)

4. **Performance:** 
   - Imágenes con `next/image`
   - Lazy loading en secciones below the fold
   - Fonts con `next/font`
   - No bloquear el hilo principal con uploads

5. **Git:** Inicializa el repo, crea commits descriptivos al finalizar cada fase principal

6. **README.md:** Crear al final con instrucciones de instalación, variables de entorno, y cómo hacer deploy a Vercel

7. **Seguridad crítica:**
   - NUNCA exponer contraseñas en logs
   - Validar tipos MIME de archivos en el server (no solo la extensión)
   - Las fotos de clientes NO deben ser accesibles públicamente sin auth
   - Sanitizar HTML en notas del admin antes de renderizar

---

*Este prompt fue generado para Claude Code con el plugin addyosmani/agent-skills instalado.*
*Versión: 1.0 · Proyecto: SurfaceArt Palm Beach · Mayo 2026*
