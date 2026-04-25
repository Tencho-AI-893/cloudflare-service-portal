# Cloudflare Service Portal - Next.js App Router

A production-ready service portal application built with **Next.js App Router** and **Tailwind CSS**, optimized for deployment on **Cloudflare Pages**.

## Features

✅ **Hero Section** - Eye-catching headline with 3 key strengths and CTAs
✅ **Store Listing Grid** - Dynamic store display powered by API (`/api/shops`)
✅ **Delivery & Service Timeline** - Interactive area selector with dynamic pricing
✅ **Estimate Wizard** - 2-step interactive calculator with real-time estimates
✅ **Cloudflare Edge Runtime** - All routes configured with `export const runtime = 'edge'`
✅ **Fully Responsive** - Mobile-first design with Tailwind CSS
✅ **Type-Safe** - Full TypeScript support
✅ **Fast & Lightweight** - Optimized images and lazy loading

---

## Project Structure

```
cloudflare-service-portal/
├── app/
│   ├── api/
│   │   └── shops/
│   │       └── route.ts          # API endpoint for store data
│   ├── globals.css               # Global Tailwind styles
│   ├── layout.tsx                # Root layout with header/footer
│   └── page.tsx                  # Home page (integrates all components)
├── components/
│   ├── HeroSection.tsx           # Hero with 3 strengths
│   ├── StoreGrid.tsx             # Store listing with area filters
│   ├── StoreCard.tsx             # Individual store card component
│   ├── DeliveryTimeline.tsx      # Service flow & area-based pricing
│   └── EstimateWizard.tsx        # 2-step repair cost calculator
├── public/                        # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
├── next.config.js
├── wrangler.toml                 # Cloudflare Pages config
└── README.md
```

---

## Setup & Deployment Instructions

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Cloudflare account (for deployment)

### Step 1: Clone or Initialize Project

```bash
cd cloudflare-service-portal
```

### Step 2: Install Dependencies

```bash
npm install
```

or with yarn:

```bash
yarn install
```

### Step 3: Run Development Server

```bash
npm run dev
```

Server runs at `http://localhost:3000`

### Step 4: Build for Production

```bash
npm run build
npm run start
```

### Step 5: Deploy to Cloudflare Pages

#### Option A: Using Cloudflare CLI (wrangler)

```bash
# Install Cloudflare CLI globally
npm install -g @cloudflare/wrangler

# Authenticate with Cloudflare
wrangler login

# Deploy
wrangler pages deploy .next
```

#### Option B: Using GitHub Actions (Recommended)

1. Push your repository to GitHub
2. Go to **Cloudflare Dashboard** → **Pages** → **Create a project**
3. Connect your GitHub account and repository
4. Set build settings:
   - **Framework**: Next.js
   - **Build command**: `npm run build`
   - **Build output directory**: `.next/static`
5. Click **Save and Deploy**

#### Option C: Manual Upload via Web

1. Build the project: `npm run build`
2. Go to **Cloudflare Pages** → **Create a project** → **Upload assets**
3. Upload the `.next` folder
4. Deploy

---

## Cloudflare Pages Build Settings

When setting up Cloudflare Pages via the dashboard, use these settings:

```
Framework: Next.js
Build command: npm run build
Build output directory: .next
Environment variables: (add any required env vars here)
```

**Important**: Each page and API route includes:
```typescript
export const runtime = 'edge';
```

This tells Next.js to use Cloudflare's Edge Runtime for optimal performance.

---

## Configuration Files

### next.config.js
- Enables unoptimized images (compatible with Cloudflare Images CDN)
- Configures edge runtime

### tsconfig.json
- Strict TypeScript configuration
- Path aliases for clean imports (`@/*`)

### tailwind.config.ts
- Custom theme colors (primary blue #0066cc)
- Animation utilities for slide-in effects

### wrangler.toml
- Cloudflare Workers/Pages configuration
- Build and upload settings

---

## API Routes

### GET `/api/shops`

Returns a list of service locations.

**Response:**
```json
[
  {
    "id": 1,
    "name": "Umeda Store",
    "address": "1-2-3 Umeda, Kita Ward, Osaka",
    "phone": "06-1234-5678",
    "hours": "10:00 AM - 8:00 PM",
    "area": "osaka"
  },
  ...
]
```

**Features:**
- Edge runtime optimized
- Cache-control headers (1 hour at edge, 24 hours in browser)
- Placeholder data (easily replaceable with D1/KV backend)

---

## Components

### HeroSection
- Gradient background with SVG pattern
- 3 key strengths with icons
- CTA buttons
- Fully responsive

### StoreGrid
- Fetches data from `/api/shops`
- Area-based filtering
- Loading and error states
- Displays 6 sample stores

### StoreCard
- Store name, address, hours, phone
- Clickable `tel:` links
- Area badge
- Call-to-action button

### DeliveryTimeline
- Interactive area selector
- Dynamic delivery fee calculation
- 4-step service flow visualization
- Responsive timeline design

### EstimateWizard
- Step 1: Device type selection (Smartphone, Tablet, Laptop, Smartwatch)
- Step 2: Issue type selection with base pricing
- Real-time cost calculation
- Results display with service inclusions

---

## Customization Guide

### Change Colors

Edit `tailwind.config.ts`:
```typescript
colors: {
  primary: '#YOUR_COLOR',
  secondary: '#YOUR_COLOR',
}
```

### Update Store Data

Edit `/app/api/shops/route.ts` to:
- Connect to Cloudflare D1 (SQL database)
- Query Cloudflare KV (key-value store)
- Use external API

Example with D1:
```typescript
const shops = await env.DB.prepare('SELECT * FROM shops').all();
return Response.json(shops.results);
```

### Modify Pricing

Edit `/components/EstimateWizard.tsx`:
```typescript
const issueTypes: Record<string, any> = {
  smartphone: [
    { value: 'screen', label: 'Screen Replacement', cost: 15000 }, // ¥15,000
    // ... add more issues
  ]
}
```

### Update Delivery Areas

Edit `/components/DeliveryTimeline.tsx`:
```typescript
const deliveryInfo = {
  tokyo: { name: 'Tokyo', fee: '¥500', days: '1-2 days', ... },
  // ... add more areas
}
```

---

## Environment Variables

If you need environment variables, create a `.env.local` file:

```
NEXT_PUBLIC_API_BASE_URL=https://yourdomain.com
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_DATABASE_ID=your_db_id
```

To use in Cloudflare Pages, add them via the dashboard:
**Settings** → **Environment Variables**

---

## Performance Optimization

- ✅ Edge Runtime for zero cold starts
- ✅ Static generation where possible
- ✅ Image optimization with `unoptimized: true` (Cloudflare Images compatible)
- ✅ Minimal CSS (~20KB gzipped with Tailwind)
- ✅ No external dependencies bloat

---

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Android)

---

## Troubleshooting

### Build Fails with "Module not found"

```bash
rm -rf node_modules .next
npm install
npm run build
```

### API Route Returns 404

- Ensure file is in `/app/api/` directory
- File must be named `route.ts` or `route.js`
- Check spelling of route path

### Styles Not Applied

- Run `npm install` to ensure Tailwind is installed
- Clear `.next` folder: `rm -rf .next`
- Rebuild: `npm run build`

### Deployment Issues

- Check Cloudflare Pages build logs for errors
- Ensure `runtime = 'edge'` is exported from each page/route
- Verify Node.js version compatibility (18+)

---

## License

MIT - Free to use and modify for any purpose.

---

## Support

For issues or questions:
1. Check the [Next.js Documentation](https://nextjs.org/docs)
2. Review [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
3. Visit [Tailwind CSS Docs](https://tailwindcss.com/docs)

---

**Built with ❤️ for Cloudflare**

Last updated: 2024
