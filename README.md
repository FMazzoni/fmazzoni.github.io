# fmazzoni.github.io

My personal site: projects, writing and an about page. It is a SvelteKit app, prerendered to static
HTML and served by GitHub Pages.

## Writing a post

Add `content/posts/YYYY-MM-DD-Slug.md`. The post is served at `/Slug`. Its front matter needs a
`title`, a `date` that matches the file name, and a one-sentence `excerpt`, which is used in lists and
link previews:

```yaml
---
title: Visualizing Earth's Geoid in 3D
date: 2025-11-17
tags: python, geospatial
excerpt: "An interactive 3D visualization of Earth's geoid."
---
```

The about page's text is `content/pages/about.md`. Projects and papers are data, in
`src/lib/config/projects.ts` and `src/lib/config/papers.ts`.

## Running it

```sh
npm ci
npm run dev       # http://localhost:5173
npm run check     # svelte-check and TypeScript
npm run lint
npm run shots     # build, then screenshot every page at desktop and phone size into shots/
```

`npm run shots` also fails on sideways scrolling, broken images, missing fonts and console errors.
`THEMES=dark,light npm run shots` adds the light theme. Look at the screenshots after any visual
change.

Pushing to `main` builds and deploys the site with `.github/workflows/deploy.yml`.
