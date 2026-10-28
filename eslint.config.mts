import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import svelte from "eslint-plugin-svelte";
import json from "@eslint/json";
import markdown from "@eslint/markdown";
import css from "@eslint/css";
import { defineConfig } from "eslint/config";
import svelteConfig from "./svelte.config.js";

export default defineConfig([
  { ignores: ["build/", ".svelte-kit/", "shots/", "test-results/", "playwright-report/", "package-lock.json"] },
  { files: ["**/*.{js,mjs,cjs,ts,mts,cts,svelte}"], plugins: { js }, extends: ["js/recommended"], languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  tseslint.configs.recommended,
  // .svelte files: Svelte's recommended rules, with TypeScript parsing their <script lang="ts">.
  // The preset's unscoped entries would also run on Markdown and JSON, so scope them to Svelte files.
  ...svelte.configs.recommended.map((c) => (c.files ? c : { ...c, files: ["**/*.svelte", "**/*.svelte.ts"] })),
  {
    files: ["**/*.svelte", "**/*.svelte.ts"],
    languageOptions: { parserOptions: { projectService: true, extraFileExtensions: [".svelte"], parser: tseslint.parser, svelteConfig } },
    // resolve() exists for apps served under a base path; this site is served at the root, so plain
    // links are fine. goto() and other programmatic navigation stay checked.
    rules: { "svelte/no-navigation-without-resolve": ["error", { ignoreLinks: true }] }
  },
  // The About scene is plain JS ported from a prototype; it opts out of type checking with a reason.
  { files: ["src/lib/about-scene/**"], rules: { "@typescript-eslint/ban-ts-comment": ["error", { "ts-nocheck": "allow-with-description" }] } },
  { files: ["**/*.json"], ignores: ["tsconfig.json", ".vscode/**"], plugins: { json }, language: "json/json", extends: ["json/recommended"] },
  { files: ["**/*.md"], plugins: { markdown }, language: "markdown/commonmark", extends: ["markdown/recommended"] },
  // text-wrap and hyphenation are progressive enhancements: browsers without them set the text plainly.
  { files: ["**/*.css"], plugins: { css }, language: "css/css", extends: ["css/recommended"],
    rules: {
      "css/use-baseline": ["error", { allowProperties: ["text-wrap", "hyphens", "hyphenate-limit-chars"] }],
      // Code colours come from variables Shiki writes inline on each token (--shiki-dark, --shiki-light).
      "css/no-invalid-properties": ["error", { allowUnknownVariables: true }]
    } },
]);
