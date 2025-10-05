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
- State management: prefer zustand for global state, then react-query for server state.
- Update state immutably—never mutate directly.
- Try to duplicate code as little as possible.

---

## Naming Conventions

Always use kebab-case for file names, component names, and hooks/utils files.

- **Component Files:** Use kebab-case for the file, matching the component (`users-list.tsx` for `UsersList`).
- **Component Names:** PascalCase in source (`UsersList`).
- **Hooks/Utils Files:** kebab-case (`use-auth.ts`, `format-date.ts`) for useAuth and formatDate respectively.
- **Assets:** kebab-case (`user-avatar.png`).
- **Hooks/Utils Files:** kebab-case (`use-auth.ts`, `format-date.ts`) for useAuth and formatDate respectively.
- **React Queries / Mutations:** kebab-case (`use-list-users-query.ts`, `use-create-user-mutation.ts`) for useListUsersQuery and useCreateUserMutation respectively.

Example:  
File: `components/users-list.tsx`  
Component:
