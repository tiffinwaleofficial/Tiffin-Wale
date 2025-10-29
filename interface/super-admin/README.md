# Tiffin Admin Pro

## Overview

Tiffin Admin Pro is a comprehensive Super Admin Dashboard designed for managing the "Tiffin Wale" service. It provides administrators with the tools necessary to oversee partners (tiffin centers), customers, orders, subscriptions, menus, revenue, support requests, and system settings.

Built with modern web technologies, it offers a clean, responsive, and efficient interface for managing the tiffin service operations.

## Features

-   **Admin Authentication**: Secure login for administrators using Email/Password.
-   **Dashboard Overview**: At-a-glance view of key metrics (Daily Orders, Active Subscriptions, Active Partners, Total Revenue), insightful charts (Orders Trend, Revenue Graph, Partner Growth, Subscription Distribution), and a log of the latest activities.
-   **Partner Management**: View, approve, ban, and manage tiffin center partners. Filter partners by city, status, and registration date. View detailed partner profiles.
-   **Customer Management**: Manage registered users (students). View customer details, subscription status, and take actions like banning or contacting users.
-   **Order Management**: Track and manage tiffin orders. Filter orders by meal type, status, delivery partner, and date. Manually update delivery statuses.
-   **Subscription Management**: View and manage customer subscription plans (monthly, weekly, trial) and their statuses (active, paused, cancelled, expired).
-   **Menu Management**: Add, edit, and manage the daily/weekly menus offered by partners for lunch and dinner.
-   **Revenue & Payouts**: Monitor overall revenue trends, platform commission, and manage partner payouts. Track payout status (pending, paid, failed). Export payout data.
-   **Support Tickets**: View and manage support requests submitted by customers and partners. Reply to tickets and manage their status (open, in progress, resolved, closed).
-   **Settings**: Manage admin profile details, change password, configure notification preferences, and manage system settings (placeholders for API keys, etc.).
-   **Theme Toggle**: Switch between Light and Dark modes.

## Tech Stack

-   **Framework**: [Next.js](https://nextjs.org/) (App Router)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **UI Library**: [React](https://reactjs.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Component Library**: [ShadCN UI](https://ui.shadcn.com/)
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **Charts**: [Recharts](https://recharts.org/) (integrated via ShadCN UI Charts)
-   **State Management**: React Context API
-   **Backend**: [Firebase](https://firebase.google.com/)
    -   **Authentication**: Firebase Authentication (Email/Password)
    -   **Database**: Firestore
-   **Forms**: [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) for validation

## Getting Started

### Prerequisites

-   Node.js (v20 or later recommended)
-   npm or yarn
-   Firebase Account and Project Setup

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd tiffin-admin-pro
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up Environment Variables:**
    Create a `.env.local` file in the root directory and add your Firebase project configuration:
    ```env
    NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID
    NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_APP_ID

    # For Firebase Auth Edge middleware (securely generate these)
    COOKIE_SIGNATURE_KEY_1=YOUR_SECURE_SIGNATURE_KEY_ONE
    COOKIE_SIGNATURE_KEY_2=YOUR_SECURE_SIGNATURE_KEY_TWO

    # Optional: For Firebase Admin SDK (if needed server-side, use JSON string)
    # FIREBASE_SERVICE_ACCOUNT='{...}'

    # Optional: For Firebase Emulators
    NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true # Set to true to use emulators
    NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST=localhost:9099
    NEXT_PUBLIC_FIREBASE_FIRESTORE_EMULATOR_HOST=localhost
    NEXT_PUBLIC_FIREBASE_FIRESTORE_EMULATOR_PORT=8080
    ```
    *Replace `YOUR_*` placeholders with your actual Firebase project credentials.*
    *Generate strong, random keys for `COOKIE_SIGNATURE_KEY_1` and `COOKIE_SIGNATURE_KEY_2`.*

### Firebase Setup

1.  **Create a Firebase Project**: Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
2.  **Enable Authentication**: Enable the Email/Password sign-in method in the Authentication section.
3.  **Set up Firestore**: Create a Firestore database in your project. Set up appropriate security rules (see `firestore.rules`).
4.  **Get Config**: Copy your Firebase project configuration keys into the `.env.local` file.
5.  **(Optional) Emulators**: For local development, install the Firebase CLI (`npm install -g firebase-tools`) and run the emulators:
    ```bash
    firebase emulators:start --only auth,firestore
    ```
    Ensure `NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true` is set in your `.env.local` file.

### Running the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:9002](http://localhost:9002) (or your specified port) with your browser to see the result.

## Deployment

This project includes an `app.yaml` file configured for deployment to Google App Engine (Standard Environment, Node.js 20).

1.  **Configure `app.yaml`**: Ensure environment variables are correctly set, either directly in `app.yaml` (not recommended for secrets) or through App Engine's configuration settings.
2.  **Set up Custom Domain**: In the Google Cloud Console under App Engine -> Settings -> Custom Domains, add and verify `admin.tiffin-wale.com`. Follow the instructions to update your DNS records.
3.  **Deploy**: Use the Google Cloud SDK:
    ```bash
    gcloud app deploy
    ```

## Project Structure

```
├── public/             # Static assets
├── src/
│   ├── app/            # Next.js App Router pages and layouts
│   │   ├── (auth)/     # Authentication related pages (login, forgot-password)
│   │   ├── (dashboard)/# Authenticated dashboard layout and pages
│   │   ├── globals.css # Global styles and Tailwind base
│   │   └── layout.tsx  # Root layout
│   ├── components/     # UI components (ShadCN UI, custom)
│   ├── context/        # React Context providers (Auth, Query, Theme)
│   ├── firebase/       # Firebase configuration and initialization
│   ├── hooks/          # Custom React hooks (useAuth, useFirestore, etc.)
│   ├── lib/            # Utility functions
│   └── middleware.ts   # Next.js middleware for authentication/routing
├── firebase.json       # Firebase emulator configuration
├── firestore.rules     # Firestore security rules
├── next.config.ts      # Next.js configuration
├── package.json        # Project dependencies and scripts
├── tailwind.config.ts  # Tailwind CSS configuration
└── tsconfig.json       # TypeScript configuration
```

## License

This project is licensed under the [Your License Name] - see the LICENSE.md file for details (if applicable).
