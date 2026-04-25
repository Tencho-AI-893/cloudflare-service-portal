# Cloudflare Pages Deployment Guide

This document provides detailed step-by-step instructions for deploying the Service Portal to **Cloudflare Pages**.

## Prerequisites

- Cloudflare account (free or paid) at https://dash.cloudflare.com/
- GitHub account with your repository
- Node.js 18+ installed locally

---

## Deployment Methods

### Method 1: GitHub Integration (Recommended)

This method automatically deploys your project when you push to GitHub.

#### Step 1: Prepare Your Repository

```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit"
git branch -M main
```

#### Step 2: Push to GitHub

```bash
# Add remote (replace USERNAME and REPO with your details)
git remote add origin https://github.com/USERNAME/cloudflare-service-portal.git
git push -u origin main
```

#### Step 3: Connect to Cloudflare Pages

1. Go to **Cloudflare Dashboard** → **Pages** → **Create a project**
2. Click **Connect to Git**
3. Authorize Cloudflare to access your GitHub account
4. Select your repository: `cloudflare-service-portal`
5. Click **Begin setup**

#### Step 4: Configure Build Settings

When prompted, use these settings:

| Setting | Value |
|---------|-------|
| **Framework preset** | Next.js |
| **Build command** | `npm run build` |
| **Build output directory** | `.next` |
| **Environment variables** | (See section below) |

#### Step 5: Add Environment Variables (if needed)

Click **Environment variables** and add any required variables:

```
NEXT_PUBLIC_API_BASE_URL = https://yourdomain.com
```

#### Step 6: Deploy

Click **Save and Deploy**. Cloudflare will:
1. Clone your repository
2. Run `npm install`
3. Run `npm run build`
4. Deploy to Cloudflare's global network

Your site will be live at: `https://<project-name>.pages.dev`

---

### Method 2: Wrangler CLI (Direct Deployment)

For manual deployments without GitHub integration.

#### Step 1: Install Wrangler

```bash
npm install -g wrangler
```

#### Step 2: Authenticate

```bash
wrangler login
```

This opens your browser to authorize Cloudflare.

#### Step 3: Build Locally

```bash
npm run build
```

#### Step 4: Deploy

```bash
wrangler pages deploy .next
```

Wrangler will upload your build and provide a deployment URL.

#### Step 5: (Optional) Link to a Domain

```bash
wrangler pages project link
```

---

### Method 3: Direct Web Upload

For quick testing without Git or CLI.

#### Step 1: Build Locally

```bash
npm run build
```

#### Step 2: Go to Cloudflare Pages

1. Open **Cloudflare Dashboard** → **Pages**
2. Click **Create a project** → **Upload assets**

#### Step 3: Upload Files

1. Drag and drop the `.next` folder into the upload area
2. Give your project a name
3. Click **Deploy**

**Note:** Future updates require re-uploading. Use GitHub integration for continuous deployment.

---

## Connecting a Custom Domain

After your project is deployed, add your domain:

### If Your Domain Uses Cloudflare Nameservers

1. Go to **Pages** → Your project → **Custom domains**
2. Click **Add custom domain**
3. Enter your domain: `example.com`
4. Cloudflare automatically creates DNS records
5. Done! Your site is live at `example.com`

### If Your Domain Uses Another Registrar

1. Go to **Pages** → Your project → **Custom domains**
2. Click **Add custom domain**
3. Enter your domain: `example.com`
4. Copy the **CNAME** record provided
5. Login to your domain registrar's DNS settings
6. Add the CNAME record
7. Wait for DNS propagation (can take 24 hours)

### Add www Subdomain

Add both `example.com` and `www.example.com` as custom domains.

---

## Setting Up SSL/TLS

Cloudflare automatically provides **free SSL/TLS certificates**.

1. Go to **SSL/TLS** in your Cloudflare account
2. Select **Flexible** or **Full** SSL mode
3. Enforce HTTPS (optional but recommended):
   - Go to **Pagerules** or **Rules** → **Page Rules**
   - Create rule: Always Use HTTPS

---

## Environment Variables

### During Build

Set variables that should be available during build:

1. Go to **Pages** → Your project → **Settings** → **Environment variables**
2. Click **Add variable**
3. Enter variable name and value
4. Redeploy for changes to take effect

### Example Variables

```
NEXT_PUBLIC_API_BASE_URL = https://yourdomain.com
NEXT_PUBLIC_APP_NAME = My Service Portal
```

**Note:** Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser.

---

## Build & Deployment Logs

### View Build Logs

1. Go to **Pages** → Your project → **Deployments**
2. Click any deployment to see logs
3. Errors are clearly marked

### Common Build Errors

#### Error: "npm install failed"
- Usually caused by package version conflicts
- Solution: Delete `package-lock.json`, push to Git, rebuild

#### Error: ".next not found"
- The build output directory is wrong
- Check build settings: Build output directory should be `.next`

#### Error: "Node modules too large"
- Cloudflare has size limits
- Solution: Remove unused dependencies, use `npm prune`

---

## Monitoring & Analytics

### View Analytics

1. Go to **Pages** → Your project → **Analytics**
2. View:
   - Request count
   - Data transferred
   - Error rates
   - Performance metrics

### Set Up Alerting

1. Go to your domain's **Settings** → **Notifications**
2. Configure alerts for downtime or errors

---

## Continuous Integration/Deployment

### GitHub Actions (Optional)

For advanced workflows, create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloudflare Pages

on:
  push:
    branches:
      - main

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: npm run build
      - uses: cloudflare/pages-action@1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: cloudflare-service-portal
          directory: .next
```

Then add secrets to GitHub:
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

---

## Scaling & Performance

### Cloudflare Optimizations

1. **Caching**: Cloudflare automatically caches assets
2. **Compression**: GZIP and Brotli compression enabled
3. **DDoS Protection**: Free DDoS mitigation included
4. **Global CDN**: Your content delivered from 200+ edge locations

### Improve Performance

1. Enable **Rocket Loader** (JavaScript optimization)
2. Enable **Mirage** (image optimization)
3. Use **Argo Smart Routing** for faster origin connections
4. Set up **Page Rules** for cache optimization

---

## Troubleshooting Deployments

### Project Won't Deploy

**Check:**
- Build logs for errors
- `package.json` has correct dependencies
- Node.js version is 18+
- No syntax errors in code

### Site Shows 404 After Deployment

**Check:**
- Build output directory is `.next`
- `next.config.js` is valid
- All imports resolve correctly

### Styles Are Missing

**Check:**
- Tailwind CSS processed correctly in build logs
- `tailwind.config.ts` is valid
- CSS files imported in `layout.tsx`

### API Routes Returning 404

**Check:**
- Files are in `/app/api/` directory
- File is named `route.ts`
- Runtime is set to `edge`
- No syntax errors

---

## Rollback to Previous Deployment

1. Go to **Pages** → Your project → **Deployments**
2. Find the working version
3. Click **Rollback** to instantly revert

---

## Monitoring with Wrangler

View deployment logs locally:

```bash
# View all deployments
wrangler pages project info

# View deployment logs
wrangler deployments list

# Stream live logs
wrangler tail --service=cloudflare-service-portal
```

---

## Cleanup & Maintenance

### Remove Old Deployments

Cloudflare keeps 100 deployments by default. Old ones are automatically cleaned up.

### Clear Cache

1. Go to your Cloudflare domain dashboard
2. Click **Purge Cache** → **Purge Everything**
3. Wait for purge to complete (usually under 30 seconds)

---

## Next Steps

After deployment:

1. ✅ Test your site on mobile and desktop
2. ✅ Run Lighthouse audit in Chrome DevTools
3. ✅ Set up analytics tracking
4. ✅ Monitor uptime with Cloudflare
5. ✅ Configure backup to S3 (optional)

---

## Support & Resources

- **Cloudflare Pages Docs**: https://developers.cloudflare.com/pages/
- **Next.js Deployment**: https://nextjs.org/docs/deployment
- **Cloudflare Community**: https://community.cloudflare.com/
- **GitHub Issues**: Report bugs in your repository

---

**Happy Deploying! 🚀**
