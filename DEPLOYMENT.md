# GitHub Pages Deployment Guide

## Quick Start for `s0umith29.github.io`

If your repository is named `s0umith29.github.io`, follow these steps:

### 1. Install Dependencies
```bash
npm install
```

### 2. Build the Static Site
```bash
npm run build
```

This creates the `out/` directory with all static files.

### 3. Deploy to GitHub Pages

**First Time Setup:**
```bash
# Create .nojekyll file
touch out/.nojekyll

# Add and commit the out directory
git add out
git commit -m "Initial deployment"

# Push to gh-pages branch
git subtree push --prefix out origin gh-pages
```

**Subsequent Deployments:**
```bash
npm run deploy
```

### 4. Configure GitHub Pages

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions** (if using the workflow) or **Deploy from a branch**
4. If using branch deployment:
   - Branch: `gh-pages`
   - Folder: `/ (root)`
5. Save and wait for deployment

Your site will be available at: `https://s0umith29.github.io`

---

## For Project Repository (e.g., `portfolio`)

If your repository is NOT named `username.github.io`, you need to configure the base path:

### 1. Update `next.config.mjs`

```javascript
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/portfolio',  // Replace with your repo name
  assetPrefix: '/portfolio', // Replace with your repo name
  trailingSlash: true,
};
```

### 2. Build and Deploy

```bash
npm run build
touch out/.nojekyll
git subtree push --prefix out origin gh-pages
```

Your site will be available at: `https://s0umith29.github.io/portfolio`

---

## Using GitHub Actions (Recommended)

The repository includes a GitHub Actions workflow that automatically deploys on push to `main`:

1. **Enable GitHub Pages:**
   - Go to **Settings** → **Pages**
   - Source: **GitHub Actions**

2. **Push to main branch:**
   ```bash
   git push origin main
   ```

3. The workflow will automatically:
   - Build the site
   - Deploy to GitHub Pages
   - Create the `gh-pages` branch if it doesn't exist

---

## Troubleshooting

### Issue: 404 errors on GitHub Pages

**Solution:**
- Ensure `trailingSlash: true` in `next.config.mjs`
- Check `basePath` is set correctly for project repositories
- Verify `.nojekyll` exists in `out/` directory

### Issue: Images not loading

**Solution:**
- Verify `images: { unoptimized: true }` in `next.config.mjs`
- Use relative paths for images
- Check that `assetPrefix` matches `basePath`

### Issue: Styles not loading

**Solution:**
- Clear `.next` and `out` directories
- Rebuild: `npm run build`
- Check that `basePath` is correctly configured

### Issue: Build fails

**Solution:**
```bash
# Clear cache
rm -rf .next out node_modules

# Reinstall
npm install

# Rebuild
npm run build
```

---

## Manual Deployment Commands

```bash
# Full deployment process
npm run build
touch out/.nojekyll
git add out
git commit -m "Deploy to GitHub Pages"
git subtree push --prefix out origin gh-pages
```

---

## Verify Deployment

1. Check GitHub Actions tab for deployment status
2. Visit your GitHub Pages URL
3. Check browser console for any errors
4. Verify all assets load correctly

---

For more information, see the main [README.md](./README.md)

