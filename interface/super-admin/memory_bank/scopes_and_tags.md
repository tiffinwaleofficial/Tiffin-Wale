**9. Tag and Categorize different scopes of the project:**

*   **Frontend**:
    *   `src/app/**/*.tsx` (pages, layouts)
    *   `src/components/**/*.tsx` (UI components, `AdminGuard.tsx`, ShadCN UI)
    *   `src/context/**/*.tsx` (React Context providers)
    *   `src/hooks/**/*.ts` (React hooks for UI logic, data fetching, utilities)
    *   `src/globals.css`, `tailwind.config.ts`, `postcss.config.mjs` (styling)
    *   `next.config.ts` (Next.js frontend config)
    *   `package.json` (frontend dependencies)
    *   `src/lib/apiClient.ts` (client-side API interaction)
    *   `src/lib/utils.ts` (styling utilities)
*   **Backend**:
    *   `src/middleware.ts` (Next.js edge middleware for auth)
    *   `src/firebase/**/*.ts` (Firebase integration logic, config, initialization)
    *   `firestore.rules`, `firestore.indexes.json` (Firebase security rules and indexes)
    *   `src/ai/**/*.ts` (Genkit AI backend logic)
    *   `app.yaml`, `dispatch.yaml` (Google App Engine deployment for the Next.js app, which includes server-side aspects)
*   **DevOps**:
    *   `app.yaml`, `dispatch.yaml` (Google App Engine deployment)
    *   `package.json` (build/start scripts)
    *   `.gcloudignore`, `.gitignore`
*   **Database**:
    *   Firebase Firestore (main database)
    *   `firestore.rules`, `firestore.indexes.json`
    *   `src/firebase/config.ts`, `src/firebase/index.ts` (Firestore initialization)
    *   `src/hooks/use-firestore-doc.ts`, `src/hooks/use-firestore-query.ts` (Firestore data access)
*   **Testing**:
    *   `package.json` (`lint`, `typecheck` scripts). No explicit unit/integration test framework identified.
*   **Integrations**:
    *   Firebase (Authentication, Firestore)
    *   Google App Engine (Deployment)
    *   Genkit AI (Google AI)