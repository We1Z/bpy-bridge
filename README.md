# bpy.bridge

A static, hands-on Blender Python learning site for developers coming from Unreal Engine’s Python API.

## Public website

Visit [https://we1z.github.io/bpy-bridge/](https://we1z.github.io/bpy-bridge/).

The `main` branch deploys automatically to GitHub Pages through the workflow in `.github/workflows/deploy.yml`.

## Run locally

```bash
npm install
npm run dev
```

The Vite development script accepts normal CLI forwarding, for example:

```bash
npm run dev -- --host 0.0.0.0 --port 7100
```

## Production build

```bash
npm run build
npm run preview
```

The deployable static site is generated in `dist/`. There is no backend, account system, or runtime API dependency.

## Learning features

- Nine sequential lessons across API fundamentals, tool building, and production architecture.
- Side-by-side Unreal and Blender Python examples with copy and download actions.
- Exercises, hints, solutions, quizzes, and browser-local progress tracking.
- Searchable Unreal-to-Blender API translation reference.
- Complete five-chapter book library with 56 development sections, glossary, original page references, and 57 page previews.
- Interactive UI lab that reconstructs every region of the NBB Asset Manager panel, links controls to source code, simulates asset/version state, and supports step-by-step assembly.
- Debugging notes, book chapter map, and a guided tour of the NBB Asset Manager.
- Responsive layouts, keyboard-accessible dialogs, reduced-motion support, and mobile course navigation.

Progress is stored only in the current browser’s `localStorage`; it does not sync between devices and is cleared with browser data.

## Source notes

The curriculum is derived from the user-supplied *Blender: Advanced Add-On Development* by Alex Telford and the user’s NBB Asset Manager source. The book PDF and original add-on repository are not redistributed by this website. Examples and explanations in the site were written for this course.

Interface fonts are Manrope and IBM Plex Mono (SIL Open Font License), served locally through Fontsource. Icons are Lucide. Python highlighting uses prism-react-renderer. The project uses React, TypeScript, Vite, Tailwind CSS, and Radix UI.
