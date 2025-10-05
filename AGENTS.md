# AGENTS.md

## Project Overview

This project is a modern React app using:

- Chadcn UI for styling
- TypeScript for type safety
- Zod for schema validation
- React, Vite, and Tailwind CSS

Follow these conventions for human and AI contributors. Only use approved dependencies.

---

## Development Guidelines

- Use functional components and React hooks exclusively.
- Import UI from Chadcn UI registry—never rebuild primitives.
- Write all source in TypeScript (`.ts`, `.tsx`), not JavaScript.
- Use Zod for all schemas: form validation, APIs, and data guardrails.
- Integrate Zod with React Hook Form for forms.
- State management: prefer hooks, then context, then data caching as needed.
- Update state immutably—never mutate directly.

---

## Naming Conventions

Always use kebab-case for file names, component names, and hooks/utils files.

- **Component Files:** Use kebab-case for the file, matching the component (`users-list.tsx` for `UsersList`).
- **Component Names:** PascalCase in source (`UsersList`).
- **Hooks/Utils Files:** kebab-case (`use-auth.ts`, `format-date.ts`) for useAuth and formatDate respectively.
- **CSS/Assets:** kebab-case (`user-avatar.png`).

Example:  
File: `components/users-list.tsx`  
Component:
