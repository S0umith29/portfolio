# Sowmith Kuppa - Portfolio Website

A modern, responsive portfolio website showcasing my experience, projects, and skills as an AI Research Intern and Graduate Student.

## Features

- 🎨 Modern and clean design
- 📱 Fully responsive (mobile, tablet, desktop)
- ⚡ Fast and lightweight
- 🎯 Smooth scrolling navigation
- 🌈 Beautiful gradient hero section
- ✨ Interactive animations

## Technologies Used

- HTML5
- CSS3 (with CSS Grid and Flexbox)
- JavaScript (Vanilla JS)
- Font Awesome Icons

## GitHub Pages Deployment

### Method 1: Using GitHub Web Interface

1. Create a new repository on GitHub (e.g., `portfolio` or `soumith-portfolio`)
2. Upload all files (`index.html`, `styles.css`, `script.js`) to the repository
3. Go to **Settings** → **Pages**
4. Under **Source**, select `main` branch (or `master` if that's your default branch)
5. Click **Save**
6. Your site will be live at: `https://[your-username].github.io/[repository-name]`

### Method 2: Using Git Command Line

```bash
# Initialize git repository
git init

# Add all files
git add .

# Commit files
git commit -m "Initial commit: Portfolio website"

# Add your GitHub repository as remote
git remote add origin https://github.com/[your-username]/[repository-name].git

# Push to GitHub
git branch -M main
git push -u origin main
```

Then follow steps 3-6 from Method 1.

## Customization

### Update Contact Information

Edit the contact section in `index.html`:

```html
<div class="contact-item">
    <i class="fas fa-envelope"></i>
    <a href="mailto:your-email@example.com">your-email@example.com</a>
</div>
```

### Change Colors

Edit the CSS variables in `styles.css`:

```css
:root {
    --primary-color: #2563eb;  /* Change this */
    --secondary-color: #1e40af; /* Change this */
    /* ... */
}
```

### Add More Projects

Add a new project card in the projects section:

```html
<div class="project-card">
    <div class="project-header">
        <h3>Project Name</h3>
        <span class="project-period">Date Range</span>
    </div>
    <!-- Project details -->
</div>
```

## File Structure

```
portfolio/
├── index.html      # Main HTML file
├── styles.css      # All styling
├── script.js       # JavaScript functionality
└── README.md       # This file
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is open source and available for personal use.

## Contact

- Email: soumith.odu@gmail.com
- LinkedIn: [linkedin.com/in/soumith29](https://linkedin.com/in/soumith29)
- GitHub: [github.com/s0umith29](https://github.com/s0umith29)

---

Made with ❤️ by Sowmith Kuppa


