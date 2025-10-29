**2. Key Files and their Summaries:**

*   **`.env.local`**: Environment variables for Firebase emulator hosts and other `NEXT_PUBLIC_` prefixed variables.
*   **`README.md`**: Project overview, features, tech stack (Next.js, TypeScript, React, Tailwind CSS, ShadCN UI, Lucide React, Recharts, React Context API, Firebase Auth/Firestore, React Hook Form, Zod), getting started guide, deployment to Google App Engine, and project structure.
*   **`app.yaml`**: Google App Engine configuration for deploying the Next.js application, including runtime, service name, instance class, entrypoint, environment variables, handlers, and scaling settings.
*   **`dispatch.yaml`**: Google App Engine dispatch file to route traffic for `admin.tiffin-wale.com/*` to the `super-admin-web` service.
*   **`firebase.json`**: Firebase project configuration, primarily for emulators (Auth, Firestore, Hub, UI, Logging) and references to `firestore.rules` and `firestore.indexes.json`.
*   **`next.config.ts`**: Next.js configuration, including TypeScript and ESLint settings, and remote image patterns.
*   **`package.json`**: Project metadata, scripts (`dev`, `genkit:dev`, `genkit:watch`, `build`, `start`, `lint`, `typecheck`), and dependencies (Next.js, React, Firebase, Genkit AI, ShadCN UI, etc.).
*   **`tsconfig.json`**: TypeScript compiler options, including target, libraries, strictness, module resolution, JSX support, and path aliases (`@/*`).
*   **`firestore.rules`**: Defines security rules for the Firebase Firestore database.
*   **`firestore.indexes.json`**: Defines custom indexes for Firebase Firestore.
*   **`src/ai/ai-instance.ts`**: Initializes the Genkit AI framework, integrating with Google AI using `GEMINI_API_KEY` and `googleai/gemini-2.0-flash` model.
*   **`src/ai/dev.ts`**: Placeholder for importing Genkit AI flows for development.
*   **`src/lib/apiClient.ts`**: Centralized Axios-based API client with request/response interceptors for authentication (Bearer token from `localStorage`) and error handling (401, 403, 500). Provides structured API methods for `auth`, `dashboard`, `orders`, `partners`, `customers`, `subscriptions`, `analytics`, and `support`.
*   **`src/lib/utils.ts`**: Contains the `cn` utility function for combining and merging Tailwind CSS classes using `clsx` and `tailwind-merge`.
*   **`src/middleware.ts`**: Next.js middleware for authentication and routing. It protects routes, redirects unauthenticated users to login, and handles redirects for authenticated users accessing public paths.
*   **`src/components/AdminGuard.tsx`**: A React component that enforces authentication and role-based access control (`admin`, `super_admin`) for its children. Displays loading state or access denied message.
*   **`src/config/environment.ts`**: Defines `apiBaseUrl` and `environment` based on `NEXT_PUBLIC_API_BASE_URL`.
*   **`src/context/auth-provider.tsx`**: React Context Provider managing admin user authentication state, including login, logout, token refresh, and role verification.
*   **`src/context/query-provider.tsx`**: Provides `@tanstack/react-query` client for global data fetching and caching.
*   **`src/firebase/config.ts`**: Stores Firebase project configuration details.
*   **`src/firebase/index.ts`**: Initializes Firebase client-side services (Auth, Firestore) and connects to emulators in development.
*   **`src/hooks/use-firestore-doc.ts`**: Custom React hook for real-time fetching and subscription to a single Firestore document.
*   **`src/hooks/use-firestore-query.ts`**: Custom React hook for real-time fetching and subscription to a Firestore collection with query constraints.
*   **`src/hooks/use-mobile.tsx`**: Custom React hook to detect if the current viewport width is considered mobile.
*   **`src/hooks/use-toast.ts`**: Custom React hook for managing and displaying toast notifications.
*   **`src/app/layout.tsx`**: Root layout for the Next.js application.
*   **`src/app/page.tsx`**: Root page of the application (likely redirects to login or dashboard).
*   **`src/app/globals.css`**: Global CSS styles, likely including Tailwind CSS imports.
*   **`src/app/(dashboard)/layout.tsx`**: Layout for authenticated dashboard pages.
*   **`src/app/(dashboard)/page.tsx`**: Dashboard overview page.
*   **`src/app/(dashboard)/dashboard/page.tsx`**: Main dashboard content page.
*   **`src/app/(dashboard)/dashboard/customers/page.tsx`**: Customers management page.
*   **`src/app/(dashboard)/dashboard/menu/page.tsx`**: Menu management page.
*   **`src/app/(dashboard)/dashboard/orders/page.tsx`**: Orders management page.
*   **`src/app/(dashboard)/dashboard/partners/page.tsx`**: Partners management page.
*   **`src/app/(dashboard)/dashboard/partners/[partnerId]/page.tsx`**: Individual partner detail page.
*   **`src/app/(dashboard)/dashboard/revenue/page.tsx`**: Revenue management page.
*   **`src/app/(dashboard)/dashboard/settings/page.tsx`**: Settings page.
*   **`src/app/(dashboard)/dashboard/subscriptions/page.tsx`**: Subscriptions management page.
*   **`src/app/(dashboard)/dashboard/support/page.tsx`**: Support tickets management page.
*   **`src/app/forgot-password/page.tsx`**: Forgot password page.
*   **`src/app/login/page.tsx`**: Login page.
*   **`src/components/ui/*.tsx`**: ShadCN UI components (accordion, alert-dialog, alert, avatar, badge, button, calendar, card, chart, checkbox, date-picker, dialog, dropdown-menu, form, input, label, menubar, popover, progress, radio-group, scroll-area, select, separator, sheet, sidebar, skeleton, slider, switch, table, tabs, textarea, toast, toaster, tooltip).