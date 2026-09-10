# Mekan - Car Parts Marketplace TODO

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

### Priority 1: Database & Real Data
- [ ] Create `src/lib/prisma.ts` (Prisma client singleton)
- [ ] Wire Prisma queries into all pages (replace mock data imports)
- [ ] Create seed script (`prisma/seed.ts`) to populate DB from `src/lib/data.ts`
- [ ] Add `prisma` seed command to `package.json`
- [ ] Test with local PostgreSQL
- [ ] Set up Vercel + Neon/Supabase PostgreSQL connection
- [ ] Add `DATABASE_URL` env var on Vercel

### Priority 2: Authentication
- [ ] Install and configure NextAuth.js (or lucia-auth)
- [ ] Email registration flow (send verification code/OTP)
- [ ] Phone registration flow (send SMS OTP)
- [ ] Login with password
- [ ] Login with OTP (no password)
- [ ] Session management (JWT or database sessions)
- [ ] Auth middleware to protect routes (`/seller/*`, `/cart`, `/checkout`)
- [ ] User profile / account page
- [ ] Logout functionality
- [ ] Password reset flow

### Priority 3: Product CRUD (Seller)
- [ ] Wire "Add Product" form to Prisma create
- [ ] Product edit page + form
- [ ] Product delete with confirmation
- [ ] Image upload to S3/Cloudinary (replace placeholder divs)
- [ ] Product listing in seller dashboard (connected to DB)
- [ ] Stock management
- [ ] Product status toggle (active/inactive)

### Priority 4: Search & Filtering
- [ ] Wire search bar to filter products by title/brand/description
- [ ] Implement pagination on browse page
- [ ] Wire plaque search to filter by compatible car models
- [ ] Sort options connected to real data
- [ ] URL-based filter state (shareable filter links)
- [ ] Debounced search input

### Priority 5: Cart & Checkout
- [ ] Persist cart in DB (or localStorage for guests)
- [ ] Checkout page (shipping address, city, postal code, phone)
- [ ] Order creation (write to Order + OrderItem tables)
- [ ] Decrement stock on order
- [ ] Order confirmation page
- [ ] Payment integration (ZarinPal / IDPay / NextPay)
- [ ] Payment callback handling

### Priority 6: Order Management
- [ ] Buyer: order history page
- [ ] Buyer: order detail / tracking page
- [ ] Seller: order list (with filters by status)
- [ ] Seller: confirm order
- [ ] Seller: mark as shipped
- [ ] Buyer: mark as received
- [ ] Cancellation flow

### Priority 7: Missing Pages
- [ ] User profile / account settings
- [ ] Seller profile page (public)
- [ ] Wishlist / favorites
- [ ] Reviews & ratings (submit, display)
- [ ] Checkout / payment page
- [ ] Order confirmation / thank you page

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
- [ ] Add `vercel.json` if needed
- [ ] Set all env vars on Vercel (DATABASE_URL, NEXTAUTH_SECRET, etc.)
- [ ] Test production build on Vercel
- [ ] Custom domain setup
- [ ] CI/CD (optional — Vercel auto-deploys from main)

---

## Tech Stack
- **Framework:** Next.js 16 (App Router)
- **Database:** PostgreSQL via Prisma ORM
- **Styling:** Tailwind CSS v4 (dark mode, RTL)
- **Font:** Vazirmatn (Google Fonts)
- **Icons:** Lucide React
- **Validation:** Zod (installed, not yet wired)
- **Language:** TypeScript strict
- **Deploy target:** Vercel

## Key Files
```
src/
  app/layout.tsx          — Root layout (dark, RTL, header/footer)
  app/page.tsx            — Home page
  app/browse/page.tsx     — Browse with filters
  app/product/[id]/page.tsx — Product detail
  app/auth/login/page.tsx
  app/auth/register/page.tsx
  app/seller/dashboard/page.tsx
  app/seller/products/new/page.tsx
  app/cart/page.tsx
  app/api/products/route.ts
  app/api/auth/register/route.ts
  app/api/cart/route.ts
  app/api/orders/route.ts
  components/Header.tsx
  components/Footer.tsx
  components/ProductCard.tsx
  components/FilterSidebar.tsx
  components/PlaqueSearch.tsx
  lib/data.ts             — Mock data (12 products, 10 brands, 12 categories)
  lib/types.ts            — TypeScript interfaces
prisma/schema.prisma      — Database schema (12 models)
```
