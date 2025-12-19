# Portfolio - Next.js 15

A modern, terminal-inspired portfolio website built with Next.js 15, Tailwind CSS, and Framer Motion, configured for GitHub Pages deployment.

## 🚀 Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS (Dark Mode: #0a0a0a)
- **Animations:** Framer Motion
- **UI Components:** Shadcn/UI + Lucide React icons
- **Deployment:** GitHub Pages (Static Export)

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

## 🛠️ Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Run development server:**
```bash
npm run dev
```

3. **Open [http://localhost:3000](http://localhost:3000)** in your browser

## 🏗️ Build for Production

```bash
npm run build
```

This will generate a static export in the `out/` directory, ready for GitHub Pages.

## 📦 Deploy to GitHub Pages

### Option 1: Using GitHub Actions (Recommended)

1. Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./out
```

2. Push to your repository - GitHub Actions will automatically deploy.

### Option 2: Manual Deployment

1. **Build the static site:**
```bash
npm run export
```

2. **Create `.nojekyll` file** (prevents Jekyll processing):
```bash
touch out/.nojekyll
```

3. **Deploy to `gh-pages` branch:**

For a repository named `s0umith29.github.io` (user/organization page):
```bash
# First time setup
git subtree push --prefix out origin gh-pages

# Subsequent deployments
npm run deploy
```

For a project repository (e.g., `portfolio`):
```bash
# Update next.config.mjs basePath
basePath: '/portfolio',
assetPrefix: '/portfolio',

# Then deploy
npm run export
touch out/.nojekyll
git subtree push --prefix out origin gh-pages
```

### Option 3: Using GitHub Pages Settings

1. Go to your repository **Settings** → **Pages**
2. Under **Source**, select **GitHub Actions**
3. The workflow will automatically deploy on push to `main`

## 🔧 Configuration

### GitHub Pages Base Path

If deploying to a project repository (not user/organization page), update `next.config.mjs`:

```javascript
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/your-repo-name',  // Add this
  assetPrefix: '/your-repo-name', // Add this
  trailingSlash: true,
};
```

### Custom Domain

1. Add a `CNAME` file in the `public/` directory with your domain
2. Configure DNS settings as per GitHub Pages documentation

## 📁 Project Structure

```
portfolio/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   └── globals.css         # Global styles
├── components/
│   ├── Navigation.tsx      # Navigation component
│   ├── sections/           # Section components
│   │   ├── Hero.tsx
│   │   ├── Experience.tsx
│   │   ├── Projects.tsx
│   │   ├── Skills.tsx
│   │   └── Contact.tsx
│   └── ui/                 # Shadcn/UI components
├── lib/
│   └── utils.ts            # Utility functions
├── next.config.mjs         # Next.js configuration
├── tailwind.config.ts      # Tailwind configuration
└── package.json
```

## 🎨 Customization

### Colors

Edit `tailwind.config.ts` to customize the color scheme:

```typescript
colors: {
  background: "#0a0a0a",  // Main background
  primary: "#39ff14",      // Terminal green
  secondary: "#00ffff",    // Cyan
  // ...
}
```

### Content

Update the data in component files:
- `components/sections/Hero.tsx` - Hero section
- `components/sections/Experience.tsx` - Experience data
- `components/sections/Projects.tsx` - Projects data
- `components/sections/Skills.tsx` - Skills data

## 🐛 Troubleshooting

### Images not loading on GitHub Pages

Ensure `images: { unoptimized: true }` is set in `next.config.mjs`.

### 404 errors on GitHub Pages

- Ensure `trailingSlash: true` is set in `next.config.mjs`
- Check that `basePath` is correctly configured for project repositories
- Verify `.nojekyll` file exists in the `out/` directory

### Build errors

- Clear `.next` and `out` directories: `rm -rf .next out`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check Node.js version: `node --version` (should be 18+)

## 📝 License

This project is open source and available under the MIT License.

## 👤 Author

**Sowmith Kuppa**
- Email: soumith.odu@gmail.com
- LinkedIn: [linkedin.com/in/soumith29](https://linkedin.com/in/soumith29)
- GitHub: [github.com/s0umith29](https://github.com/s0umith29)

---

Built with ❤️ using Next.js 15, Tailwind CSS, and Framer Motion
