# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A visual BPMN (Business Process Model and Notation) diagram editor built with React 19, TypeScript, and bpmn-js. Diagrams are persisted in localStorage with debounced auto-save (500ms).

## Commands

- `npm run dev` — Start Vite dev server with HMR
- `npm run build` — TypeScript check + Vite production build
- `npm run lint` — ESLint (flat config, ESLint 9+)
- `npm run test` — Run all tests once (Vitest)
- `npm run test:watch` — Watch mode
- `npx vitest run src/components/Toolbar.test.tsx` — Run a single test file

## Architecture

```
App                          # Manages diagram selection, persistence state, auto-save debounce
├── Toolbar                  # New, Save, Download (.bpmn), Undo, Redo
└── .app-body
    ├── DiagramList          # Left sidebar — lists saved diagrams, select/delete
    └── BpmnEditor           # Wraps bpmn-js canvas + properties panel
        └── useBpmnModeler   # Custom hook: BpmnModeler lifecycle, XML import/export, cleanup
```

**Data flow:** `App` owns the current diagram ID and XML string. `diagramStorage` service handles all localStorage reads/writes via a `SavedDiagram` interface (`id`, `name`, `xml`, `createdAt`, `updatedAt`). `BpmnEditor` exposes a `BpmnEditorApi` (exportXml, exportSvg, getCommandStack) upward via `onReady` callback.

## Key Libraries

- **bpmn-js** — BPMN modeler/viewer engine (imperative API, attached to DOM refs)
- **bpmn-js-properties-panel** — Side panel for editing BPMN element properties
- **@bpmn-io/properties-panel** — Base properties panel framework

## Testing

- **Vitest** with **jsdom** environment; globals enabled (no need to import `describe`/`it`/`expect`)
- **@testing-library/react** + **user-event** for component tests
- Tests co-located with source files (`*.test.tsx` / `*.test.ts`)
- Mock factory in `src/test/mocks/bpmnModeler.ts` — provides `createMockModeler` and `createMockApi`
- `src/test/setup.ts` — Polyfills localStorage for Node.js 22+ compatibility
- Use `vi.useFakeTimers()` when testing debounced auto-save behavior

## TypeScript

- Strict mode with `noUnusedLocals` and `noUnusedParameters`
- Target ES2022, module resolution: bundler
- BPMN type declarations in `src/types/bpmn.d.ts`

## Styling

- Component-scoped CSS files (no CSS modules or CSS-in-JS)
- CSS custom properties defined in `src/index.css` (color palette, font stack)
- Fixed layout dimensions: toolbar 48px height, sidebar 240px width, properties panel 320px width
