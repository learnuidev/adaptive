# AGENTS.md

## 1. Project Overview

This project is a modern React app using:

- Chadcn UI for styling
- TypeScript for type safety
- Zod for schema validation
- React, Vite, and Tailwind CSS

Follow these conventions for human and AI contributors. Only use approved dependencies.

---

## 2. Development Guidelines

- Use functional components and React hooks exclusively.
- Import UI from Chadcn UI registry—never rebuild primitives.
- Write all source in TypeScript (`.ts`, `.tsx`), not JavaScript.
- Use Zod for all schemas: form validation, APIs, and data guardrails.
- Integrate Zod with React Hook Form for forms.
- State management: prefer zustand for global state, then react-query for server state.
- Update state immutably—never mutate directly.
- Try to duplicate code as little as possible and keep it DRY.

### 2.1 Directory Structure

All the source code is defined in `/src` directory. Lets break it down into subdirectories:

- `/src/components`: All React components.
- `/src/hooks`: Custom React hooks.
- `/src/utils`: General-purpose utility functions.
- `/src/modules`: Contains business logic modules. Each module should have a clear responsibility. Each module consists of three things: types, react-query hooks, and utility functions. This is where we define our apis and server side state logic.
- `/src/lib`: Contains third-party libraries and utilities.
- `/src/pages`: Contains top-level pages. Each page should have a clear responsibility. Each page consists of three things: types, react-query hooks, and utility functions. This is where we define our apis and server side state logic.

---

## 3.Naming Conventions

Always use kebab-case for file names, component names, and hooks/utils files.

- **Component Files:** Use kebab-case for the file, matching the component (`users-list.tsx` for `UsersList`).
- **Component Names:** PascalCase in source (`UsersList`).
- **Hooks/Utils Files:** kebab-case (`use-auth.ts`, `format-date.ts`) for useAuth and formatDate respectively.
- **Assets:** kebab-case (`user-avatar.png`).
- **Hooks/Utils Files:** kebab-case (`use-auth.ts`, `format-date.ts`) for useAuth and formatDate respectively.
- **React Queries / Mutations:** kebab-case (`use-list-users-query.ts`, `use-create-user-mutation.ts`) for useListUsersQuery and useCreateUserMutation respectively.

---

## Security & Performance

- Validate all user input with Zod
- Implement proper error boundaries
- Use React.memo() for expensive re-renders
- Lazy load heavy components with React.lazy()
- Optimize images and assets

## Documentation Standards

- Include README.md in each major directory
- Document complex business logic
- Keep component props well-documented
- Update this AGENTS.md when adding new patterns
