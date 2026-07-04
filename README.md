# Mithila Store

[![Live Site](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge)](https://kavita-kala-kaushal.vercel.app)

A full-stack art gallery storefront for handcrafted Mithila paintings and knitwear — built with Next.js 14 (App Router), TypeScript, Tailwind CSS, and Supabase.

> 🌐 **Live URL:** [kavita-kala-kaushal.vercel.app](https://kavita-kala-kaushal.vercel.app)

## Features

- 🎨 **Product Catalog** — Browse and filter artwork by category, with a dedicated product detail page and image carousel
- 🛒 **Custom Cart Hook** — Client-side cart state (`useCart`) with add/update/remove/clear logic, no external state library
- 💬 **WhatsApp Checkout** — Orders are compiled into a pre-filled WhatsApp message, letting customers confirm directly with the seller
- 📦 **Order Tracking** — Customers can look up order status by reference
- 🔐 **Admin Dashboard** — Token-protected `/admin` area for managing inventory, viewing orders, and updating stock
- 🛡️ **Secure Server-Side API Routes** — Product, order, and admin endpoints run entirely server-side, with Supabase's service role key never exposed to the client
- 💳 **Razorpay-Ready** — Payment integration scaffolded for online checkout when enabled

---

## Tech Stack

| Layer          | Technology                          |
|----------------|--------------------------------------|
| Framework      | [Next.js 14](https://nextjs.org/) (App Router) |
| Language       | TypeScript                          |
| Styling        | Tailwind CSS                        |
| Database/Auth  | [Supabase](https://supabase.com/) (Postgres) |
| Payments       | Razorpay                            |
| Deployment     | Vercel                 |

---

## Local Setup

### 1. Clone and install

```bash
git clone https://github.com/Pratyush1110/Mithila-Store.git
cd Mithila-Store
npm install
```

### 2. Configure environment variables

Create a `.env.local` file in the project root:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Admin dashboard
ADMIN_PASSWORD=choose-a-strong-password
ADMIN_SECRET_TOKEN=choose-a-long-random-string

# Razorpay (optional — required only if online payments are enabled)
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret
```

> ⚠️ Never commit `.env.local` — it should be covered by `.gitignore`. The `SUPABASE_SERVICE_ROLE_KEY` bypasses row-level security and must stay server-side only.

### 3. Run the development server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

### 4. Build for production

```bash
npm run build
npm run start
```

---

## Project Architecture

```
src/
├── app/
│   ├── page.tsx                 # Homepage
│   ├── shop/                    # Product catalog + [id] detail pages
│   ├── cart/                    # Cart page
│   ├── checkout/                # Checkout form → stashes order, redirects out
│   ├── order-unavailable/       # Builds & hands off the WhatsApp order message
│   ├── track-order/             # Order status lookup
│   ├── admin/                   # Token-protected dashboard (login, products)
│   └── api/
│       ├── products/            # Public product endpoints
│       ├── orders/              # Order creation/lookup endpoints
│       ├── payment/             # Razorpay create-order / verify
│       └── admin/               # Admin-only endpoints (auth required)
├── components/
│   └── shop/                    # ProductCard, ProductGallery, filters, etc.
├── hooks/
│   └── useCart.tsx              # Client-side cart state management
├── lib/
│   └── supabase.ts              # Browser (anon) + server (service role) clients
├── types/
│   └── index.ts                 # Shared TypeScript types (Product, Order, CartItem…)
└── middleware.ts                # Protects /admin routes via cookie token
```

**Request flow at a glance:**

1. Products are fetched from Supabase via server components and public API routes.
2. The cart lives entirely client-side via `useCart`.
3. At checkout, the order summary is stashed and the customer is redirected to a page that builds a pre-filled WhatsApp message for final confirmation — no online payment is required for this flow.
4. Admin routes are gated by `middleware.ts`, which checks a cookie-based token against `ADMIN_SECRET_TOKEN` before allowing access to inventory management.

---

## License

This project is private and proprietary to Mithila Store.