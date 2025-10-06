# Development Guidelines

- Use functional components and React hooks exclusively.
- Import UI from Chadcn UI registry—never rebuild primitives.
- Write all source in TypeScript (`.ts`, `.tsx`), not JavaScript.
- Use Zod for all schemas: form validation, APIs, and data guardrails.
- Integrate Zod with React Hook Form for forms.
- State management: prefer zustand for global state, then react-query for server state.
- Update state immutably—never mutate directly.
- Try to duplicate code as little as possible and keep it DRY.
- Everytime feature is implement modify the docs in ./agent/features/<feature-name> etc
