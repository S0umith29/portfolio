# Portfolio - Simple Dark Theme

A clean and simple portfolio website built with Next.js 15 and Tailwind CSS, configured for GitHub Pages deployment.

## 🚀 Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS
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

### Using GitHub Actions (Recommended)

The repository includes a GitHub Actions workflow that automatically deploys on push to `main`:

1. **Enable GitHub Pages:**
   - Go to your repository on GitHub
   - Navigate to **Settings** → **Pages**
   - Under **Source**, select **GitHub Actions**

2. **Push to main branch:**
   ```bash
   git push origin main
   ```

3. The workflow will automatically build and deploy your site.

### Manual Deployment

1. **Build the static site:**
```bash
npm run build
```

2. **Create `.nojekyll` file:**
```bash
touch out/.nojekyll
```

3. **Deploy to `gh-pages` branch:**
```bash
git subtree push --prefix out origin gh-pages
```

## 🔧 Configuration

### GitHub Pages Base Path

The portfolio is configured for deployment to `/portfolio` subdirectory. If deploying to a different path, update `next.config.mjs`:

```javascript
basePath: '/your-repo-name',
assetPrefix: '/your-repo-name',
```

## 📁 Project Structure

```
portfolio/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main page
│   └── globals.css         # Global styles
├── next.config.mjs         # Next.js configuration
├── tailwind.config.ts      # Tailwind configuration
└── package.json
```

## 📝 License

This project is open source and available under the MIT License.

## 👤 Author

**Sowmith Kuppa**
- Email: soumith.odu@gmail.com
- LinkedIn: [linkedin.com/in/soumith29](https://linkedin.com/in/soumith29)
- GitHub: [github.com/s0umith29](https://github.com/s0umith29)

---

Built with ❤️ using Next.js 15 and Tailwind CSS
