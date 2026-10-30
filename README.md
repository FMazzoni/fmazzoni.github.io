# fmazzoni.github.io

My personal site: projects, a blog and an about page. It is a SvelteKit app, prerendered to static
HTML and served by GitHub Pages.

## Writing a post

Add `content/posts/YYYY-MM-DD-slug.md`, with the slug in lowercase kebab-case. The post is served at
`/blog/slug`, and the slug is permanent: rewording the title later keeps the address.

The front matter needs a `title` in sentence case, a `date` that matches the file name, and a
one-sentence `excerpt`, which is used in lists and link previews. A post about one project adds
`project:` with that project's `name` from `src/lib/config/projects.ts`, and the project's card
then links to the post:

```yaml
---
title: Visualizing Earth's geoid in 3D
date: 2025-11-17
project: geoid-globe
tags: python, geospatial
excerpt: "An interactive 3D visualization of Earth's geoid."
---
```

The about page's text is `content/pages/about.md`. Projects and papers are data, in
`src/lib/config/projects.ts` and `src/lib/config/papers.ts`. The site's sections (Projects, Blog,
About, Papers) take their names and addresses from `sections` in `src/lib/config/site.ts`.

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

`main` takes changes only by pull request. Merging one builds and deploys the site with
`.github/workflows/deploy.yml`.
