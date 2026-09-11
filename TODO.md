# Partshop (پارت شاپ) - Car Parts Marketplace TODO

## ✅ Done

### Infrastructure
- [x] Next.js 16 project scaffold (App Router, TypeScript, Tailwind CSS)
- [x] Prisma schema with PostgreSQL (12 models: User, SellerProfile, Category, CarBrand, CarModel, Product, ProductImage, ProductCar, Review, Order, OrderItem, CartItem)
- [x] Dark mode RTL layout with Vazirmatn Persian font
- [x] API routes stubs (`/api/products`, `/api/auth/register`, `/api/cart`, `/api/orders`)
- [x] Build passes clean, pushed to GitHub

### Pages (UI shell — all using static mock data)
- [x] Home page (hero, stats, category grid, featured products, brand grid, seller CTA)
- [x] Browse/listing page with filter sidebar
- [x] Product detail page
- [x] Login page (email/phone tabs)
- [x] Register page (buyer/seller toggle, email/phone)
- [x] Seller dashboard (overview, products, orders, settings tabs)
- [x] Add product form
- [x] Cart page with quantity controls and order summary

### Components
- [x] Header (search bar, category nav, mobile menu)
- [x] Footer
- [x] ProductCard
- [x] FilterSidebar (category, brand, price, condition, city)
- [x] PlaqueSearch (Iranian license plate format)

### Data
- [x] 12 sample products (engine, brake, body, lighting, suspension, tires, filters, oils)
- [x] 10 car brands with model counts
- [x] 12 categories with subcategories
- [x] 5 seller profiles
- [x] 22 Iranian cities
- [x] Price formatting (IRR/Toman, Persian numerals)

---

## ❌ Not Done

### Priority 1: Database & Real Data — ✅ Mostly Done (2026-09-10)
- [x] Create `src/lib/prisma.ts` (Prisma client singleton, pg adapter)
- [x] Migrate to Prisma 7 (URL in `prisma.config.ts`, `@prisma/adapter-pg`, client generated to `src/generated/prisma`)
- [x] Create seed script (`prisma/seed.ts`) populating DB (12 products, 36 categories, 10 brands, 10 models, 5 sellers)
- [x] Add `db:push` / `db:generate` / `db:seed` / `db:reset` / `db:studio` scripts to `package.json`
- [x] Test with local PostgreSQL (brew postgresql@16, db `mekan`, all pages verified rendering DB data)
- [x] Wire Prisma queries into all pages (home, browse, product detail, seller dashboard, add product, cart, header, footer)
- [x] Wire API routes to Prisma (`/api/products` GET+POST, `/api/auth/register`, `/api/cart` GET+POST+DELETE, `/api/orders` GET+POST with stock decrement in transaction)
- [x] Zod validation on all API routes
- [x] Rename to Partshop (پارت شاپ): package name, all UI text, logo monogram, metadata, support email
- [x] Set up Vercel + Neon/Supabase PostgreSQL connection (Neon `mekan-db` via Vercel Marketplace, account gmajid-8792 / team majid-dccb)
- [x] Add `DATABASE_URL` env var on Vercel (set automatically by Neon integration for Production + Preview)
- [x] Production deploy verified: https://partshop.vercel.app (home, browse, product, seller, cart/order APIs all tested against Neon)
- Note: `src/lib/data.ts` still holds `formatPrice`/`cities`/`plaqueLetters`/`priceRanges` helpers + mock arrays (mock arrays now unused)

### Priority 2: Authentication — ✅ Mostly Done (2026-09-10)
- [x] Custom session auth (bcryptjs password hashing + jose JWT cookie + DB-backed Session model) — no NextAuth needed
- [x] `src/lib/auth.ts`: `hashPassword`/`verifyPassword` (bcrypt, cost 12), `createSession`/`getSessionUser`/`destroySession` (jose HS256 JWT with session id → Session row, httpOnly cookie `partshop_session`, 30-day expiry), `generateOtpCode`
- [x] Schema: `Session` (token unique, expiresAt, cascade delete) + `OtpCode` (phone, code, expiresAt, used, indexed) models; pushed to local DB
- [x] `/api/auth/register`: zod validation (email XOR phone), hashed password, creates SellerProfile for SELLER role (shopName required), sets session cookie
- [x] `/api/auth/login`: identifier (email/phone) + password, generic error message (no user enumeration)
- [x] `/api/auth/logout`: deletes Session row + cookie
- [x] `/api/auth/me`: session user (id, name, email, phone, role, sellerProfileId, shopName)
- [x] `/api/auth/otp/request`: phone-only, 5-min TTL, 60s resend cooldown, 404 if user not registered, dev: code logged to console + returned as `devCode` in non-production (TODO: SMS provider)
- [x] `/api/auth/otp/verify`: 6-digit code, single-use, expiry check, max 5 codes per 15-min window
- [x] Register page: buyer/seller toggle, email/phone, client + server validation, error display, loading state, redirects seller → dashboard
- [x] Login page: password mode (email/phone tabs) + OTP mode (request → verify, 60s resend countdown), `?next=` redirect support
- [x] Cart + Orders + Products POST APIs now use session user (401 if logged out; product create 403 for non-sellers)
- [x] Seller dashboard: resolves seller profile from session (login prompt / not-a-seller states)
- [x] `src/proxy.ts` (Next 16 convention, replaces middleware): redirects `/seller/*` to login with `?next=` when no session cookie
- [x] Header: logged-in user dropdown (name, seller panel link, logout), logged-out shows ورود|ثبت‌نام; header search wired to `/browse?search=`
- [x] `AUTH_SECRET` in `.env.local` (needs to be set on Vercel too)
- [x] Set `AUTH_SECRET` on Vercel + push Session/OtpCode/Wishlist tables to Neon (prod DB)
- [ ] SMS provider for real OTP delivery (Kavenegar / SMS.ir / Farapayamak) — dev returns code in response
- [ ] Email verification flow
- [ ] User profile / account page
- [ ] Password reset flow

### Priority 3: Product CRUD (Seller)
- [x] Wire "Add Product" form to API → Prisma create (via POST /api/products)
- [ ] Product edit page + form
- [ ] Product delete with confirmation
- [ ] Image upload to S3/Cloudinary (replace placeholder divs)
- [x] Product listing in seller dashboard (connected to DB)
- [ ] Stock management UI
- [ ] Product status toggle (active/inactive)

### Priority 4: Search & Filtering
- [x] Search bar query wired server-side (`?search=` on /browse and /api/products)
- [ ] Wire header search bar UI to navigate with query
- [ ] Implement pagination on browse page
- [ ] Wire plaque search to filter by compatible car models
- [x] Sort options connected to real data (via `?sort=`)
- [x] URL-based filter state on browse page (shareable filter links)
- [x] Car model filtering with production year (`?carModel=&carYear=`) — parts differ per model year; year-aware `ProductCar` matching, brand→model→year cascade in FilterSidebar, year range on Add Product form, year labels on product detail (تمام سال‌ها / from-year / to-year / range)
- [x] Fix: dynamic route params arrive URL-encoded — product page decodes Persian slugs
- [ ] Debounced search input

### Priority 5: Cart & Checkout
- [x] Cart persisted in DB via `/api/cart` (session user)
- [x] Checkout page (shipping address, city, postal code, phone) — `/checkout`
- [x] Order creation (write to Order + OrderItem tables, stock decremented, prices from DB)
- [x] Decrement stock on order (inside transaction)
- [x] Order confirmation screen (after placing order, with order code)
- [ ] Payment integration (ZarinPal / IDPay / NextPay)
- [ ] Payment callback handling

### Priority 6: Order Management — ✅ Done (2026-09-11)
- [x] Buyer: order history page (`/account/orders`, server-rendered, login-protected)
- [x] Buyer: order detail/tracking page (`/account/orders/[id]`) — status timeline (pending→confirmed→shipped→delivered), items, shipping info, ownership enforced (404 for others)
- [x] Buyer: mark as received — `PATCH /api/orders` action `receive` (SHIPPED→DELIVERED only)
- [x] Buyer: cancel own order — `PATCH /api/orders` action `cancel` (PENDING/CONFIRMED→CANCELLED, restores stock + decrements salesCount in transaction)
- [x] Seller: order list API (`GET /api/seller/orders?status=&page=`) — only orders containing seller's products, status filter + counts, paginated
- [x] Seller: status transitions API (`PATCH /api/seller/orders/status`) — confirm (PENDING→CONFIRMED), ship (CONFIRMED→SHIPPED), deliver (SHIPPED→DELIVERED), cancel (restores stock); ownership + valid-transition checks
- [x] Seller dashboard: orders tab wired to real DB orders — status filter chips with counts, customer/items/date, action buttons per status; pending count on tab label
- [x] Overview tab: recent orders from DB (was mock array)
- [x] Header: سفارش‌های من links (dropdown + mobile) for buyers → /account/orders; sellers → dashboard
- [x] Shared helpers: `src/lib/orderStatus.ts` (Persian status labels, badge classes, fa-IR date format)
- Note: payment integration still pending — sellers mark delivered manually (cash-on-delivery style flow for now)

### Priority 7: Missing Pages
- [ ] User profile / account settings
- [ ] Seller profile page (public)
- [x] Wishlist / favorites (model + `/api/wishlist` toggle + WishlistButton on product page)
- [ ] Reviews & ratings (submit, display)
- [x] Checkout / payment page (`/checkout`)
- [x] Order confirmation / thank you page (checkout success screen)

### Priority 8: Quality & UX
- [ ] Loading states (`loading.tsx` / Suspense boundaries)
- [ ] Error boundaries (`error.tsx`)
- [ ] `not-found.tsx` custom 404 page
- [ ] `next/image` for all images (performance)
- [ ] SEO metadata on all pages (dynamic `generateMetadata`)
- [ ] Open Graph / social sharing meta tags
- [ ] Sitemap generation
- [ ] robots.txt
- [ ] Form validation (zod schemas)
- [ ] Toast notifications for actions (add to cart, etc.)
- [ ] Responsive mobile menu improvements
- [ ] Infinite scroll or virtual scrolling on browse

### Priority 9: Notifications
- [ ] Seller notification when order received
- [ ] Buyer notification when order shipped
- [ ] Email notifications (Resend / Nodemailer)
- [ ] SMS notifications (Kavenegar / Melipayamak)

### Priority 10: Admin (future)
- [ ] Admin dashboard
- [ ] User management
- [ ] Product moderation
- [ ] Order management
- [ ] Analytics / reports

### Priority 11: Deploy
- [x] Deployed to Vercel via CLI token (no vercel.json needed)
- [x] `DATABASE_URL` set on Vercel (Neon integration)
- [x] Test production build on Vercel (https://partshop.vercel.app)
- [ ] Custom domain setup
- [ ] CI/CD (optional — Vercel auto-deploys from main once GitHub repo is connected)

---

## Tech Stack
- **Framework:** Next.js 16 (App Router)
- **Database:** PostgreSQL via Prisma 7 ORM (pg adapter, config in `prisma.config.ts`)
- **Styling:** Tailwind CSS v4 (dark mode, RTL)
- **Font:** Vazirmatn (Google Fonts)
- **Icons:** Lucide React
- **Validation:** Zod (wired into all API routes)
- **Language:** TypeScript strict
- **Deploy target:** Vercel

## Key Files
```
src/
  app/layout.tsx            — Root layout (dark, RTL, header/footer)
  app/page.tsx              — Home page (DB-backed)
  app/browse/page.tsx       — Browse server page (URL filters) + BrowseClient.tsx
  app/product/[id]/page.tsx — Product detail (DB-backed)
  app/auth/login/page.tsx
  app/auth/register/page.tsx
  app/seller/dashboard/page.tsx — Server wrapper + SellerDashboardClient.tsx (DB-backed)
  app/seller/products/new/page.tsx — Server wrapper + AddProductClient.tsx (DB-backed)
  app/cart/page.tsx         — Fetches /api/cart
  app/api/products/route.ts — GET (filter/sort/paginate) + POST (create, zod)
  app/api/auth/register/route.ts — POST (zod, creates user + seller profile)
  app/api/cart/route.ts     — GET/POST/DELETE (test-buyer session until auth)
  app/api/orders/route.ts   — GET/POST (transaction, stock decrement)
  components/Header.tsx     — Client nav (receives DB categories via HeaderServer.tsx)
  components/Footer.tsx     — Server component (DB categories)
  components/ProductCard.tsx
  components/FilterSidebar.tsx — Accepts categories/carBrands as props (DB data)
  components/PlaqueSearch.tsx
  lib/prisma.ts             — Prisma client singleton (pg adapter)
  lib/db.ts                 — Server-only data access layer (typed, DB-only)
  lib/types.ts              — TypeScript interfaces
prisma/schema.prisma        — Database schema (12 models)
prisma/seed.ts              — Seed script (upserts, idempotent)
prisma.config.ts            — Prisma 7 config (schema path + DATABASE_URL)
```
