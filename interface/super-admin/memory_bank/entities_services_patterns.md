**3. Key Entities, Services, Utilities, and Patterns in use:**

*   **Entities**: Partners, Customers, Orders, Subscriptions, Menus, Revenue, Support Tickets, Admin Users (with roles `admin`, `super_admin`).
*   **Services**: Firebase Authentication, Firebase Firestore, Genkit AI (Google AI), `@tanstack/react-query` (data fetching/caching), Axios (HTTP client).
*   **Utilities**: `cn` (Tailwind class merging), `useIsMobile` (responsive design), `useToast` (notifications), `apiClient` (centralized API interaction).
*   **Patterns**:
    *   **Next.js App Router**: File-system based routing, nested layouts, server/client components.
    *   **Component-Based UI**: React, ShadCN UI for modular and reusable UI.
    *   **Frontend-Backend as a Service (BaaS)**: Firebase for Auth and Firestore.
    *   **Client-Side Data Fetching**: `@tanstack/react-query` for efficient data management.
    *   **Edge Authentication**: Next.js middleware combined with `next-firebase-auth-edge` for secure authentication.
    *   **Role-Based Access Control (RBAC)**: Implemented via `AdminGuard` and `AuthProvider`.
    *   **Context API**: For global state management (`AuthProvider`, `QueryProvider`).
    *   **Custom Hooks**: For encapsulating and reusing logic (`useFirestoreDoc`, `useFirestoreQuery`, `useIsMobile`, `useToast`).
    *   **Real-time Data**: Firebase Firestore's real-time capabilities.
    *   **AI Integration**: Genkit AI for potential AI-powered features.
    *   **Environment-based Configuration**: Flexible configuration management.
    *   **Google App Engine Deployment**: Cloud-native deployment strategy.