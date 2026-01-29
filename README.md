# BPMN Editor

A visual BPMN (Business Process Model and Notation) diagram editor built with React, TypeScript, and [bpmn-js](https://github.com/bpmn-io/bpmn-js).

## Features

- Create, edit, and delete BPMN diagrams
- Properties panel for editing element attributes
- Auto-save to localStorage with debounce
- Download diagrams as `.bpmn` files
- Undo / Redo support
- Restores last edited diagram on reload

## Getting Started

```bash
npm install
npm run dev
```

## Scripts

| Command              | Description                        |
| -------------------- | ---------------------------------- |
| `npm run dev`        | Start dev server with HMR          |
| `npm run build`      | TypeScript check + production build |
| `npm run lint`       | Run ESLint                         |
| `npm run test`       | Run all tests                      |
| `npm run test:watch` | Run tests in watch mode            |
| `npm run preview`    | Preview production build           |

## Tech Stack

- **React 19** with TypeScript
- **Vite 7** (bundler & dev server)
- **bpmn-js** (BPMN modeler engine)
- **Vitest** + **Testing Library** (tests)
