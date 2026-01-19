# Personal Blog

A modern personal blog and portfolio website built with [SvelteKit](https://kit.svelte.dev/), migrated from Pelican.

## 🚀 Features

- **Modern Stack**: Built with SvelteKit, TypeScript, and Vite
- **Markdown Support**: Content written in Markdown with [mdsvex](https://mdsvex.com/)
- **Static Site Generation**: Optimized for GitHub Pages deployment
- **Type-Safe**: Full TypeScript support
- **Responsive Design**: Mobile-friendly interface

## 📁 Project Structure

Standard SvelteKit root-level structure:

```
.
├── src/                     # Source code
│   ├── lib/                 # Shared components and utilities
│   │   ├── components/      # Svelte components
│   │   ├── config/          # Site configuration
│   │   └── utils/           # Utility functions
│   └── routes/              # SvelteKit routes (file-based routing)
├── content/                 # Blog posts and content (Markdown)
│   ├── posts/               # Blog posts
│   └── pages/               # Static pages
├── static/                  # Static assets (CSS, JS, images)
├── package.json             # All dependencies (app + tooling)
├── svelte.config.js         # SvelteKit configuration
├── vite.config.ts          # Vite configuration
├── tsconfig.json            # TypeScript configuration
└── eslint.config.mts        # ESLint configuration
```

## 🛠️ Development

### Prerequisites

- **Node.js 18+** and npm (currently using Node 24.13.0 via nvm)
- See [INSTALL_PREREQUISITES.md](./INSTALL_PREREQUISITES.md) for detailed setup instructions

**Note:** This project uses nvm. If you have nvm installed, run `nvm use` to automatically switch to the correct Node version.

### Getting Started

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Start development server**:

   ```bash
   npm run dev
   ```

3. **Build for production**:

   ```bash
   npm run build
   ```

4. **Preview production build**:

   ```bash
   npm run preview
   ```

## 📝 Writing Content

Blog posts are written in Markdown and stored in `content/posts/`. Each post should follow the naming convention: `YYYY-MM-DD-Post-Title.md`.

## 🚢 Deployment

The site is automatically deployed to GitHub Pages via GitHub Actions when you push to the `main` branch. See `.github/workflows/deploy.yml` for the deployment configuration.

**Note:** Make sure GitHub Pages is configured in your repository settings:

1. Go to Settings → Pages
2. Source: GitHub Actions
3. The workflow will automatically build and deploy on every push to `main`

## 🔗 Links

- **Live Site**: [https://fmazzoni.github.io](https://fmazzoni.github.io)
- **GitHub**: [https://github.com/FMazzoni](https://github.com/FMazzoni)
