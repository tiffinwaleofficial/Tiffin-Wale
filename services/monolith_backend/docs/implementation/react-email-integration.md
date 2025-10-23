# `react-email` Integration and Development Workflow

This document outlines the process for creating, previewing, and sending emails using the `react-email` library, which is integrated into our NestJS application.

## Overview

We use `react-email` to build and style our email templates with React components. This provides a modern development experience with features like a live preview server, which makes it easy to design and test emails.

## Key Features

-   **React Components**: Emails are built using reusable React components.
-   **Live Preview**: A local development server provides instant previews of your email templates as you code.
-   **Resend Integration**: Seamless integration with the Resend SDK for sending emails.

## Directory Structure

All email-related files are located in `src/modules/email/templates/`:

-   `src/modules/email/templates/emails/`: Contains the main email templates (e.g., `WelcomeEmail.tsx`).
-   `src/modules/email/templates/components/`: Contains reusable components used across multiple email templates (e.g., `Button.tsx`, `EmailLayout.tsx`).

## Development Workflow

### 1. Running the Development Server

To start the `react-email` development server, run the following command from the project root:

```bash
bun run email:dev
```

This will start a development server, typically on `http://localhost:3000`, where you can preview all the email templates located in `src/modules/email/templates/emails/`. The server supports hot-reloading, so any changes you make to the templates will be reflected instantly.

### 2. Creating a New Email Template

To create a new email template, follow these steps:

1.  **Create a new `.tsx` file** in the `src/modules/email/templates/emails/` directory (e.g., `NewFeatureEmail.tsx`).

2.  **Define the component and props**: Create a new React component for your email. The props for the component should be defined in an interface.

    ```tsx
    import React from 'react';
    import { Text } from '@react-email/components';
    import EmailLayout from '../components/EmailLayout';

    interface NewFeatureEmailProps {
      userName: string;
      featureName: string;
    }

    export const NewFeatureEmail: React.FC<NewFeatureEmailProps> = ({ userName, featureName }) => {
      return (
        <EmailLayout preview={`Check out our new feature: ${featureName}!`}>
          <Text>Hi {userName},</Text>
          <Text>We've just launched a new feature: {featureName}!</Text>
        </EmailLayout>
      );
    };

    export default NewFeatureEmail;
    ```

3.  **Add `PreviewProps`**: To ensure your email can be previewed in the development server, you must add `PreviewProps`. These are static props that provide mock data for your template.

    ```tsx
    NewFeatureEmail.PreviewProps = {
      userName: 'John Doe',
      featureName: 'Amazing New Feature',
    };
    ```

### 3. Using Reusable Components

We have a set of reusable components in `src/modules/email/templates/components/`. You are encouraged to use these components to maintain a consistent design across all emails.

-   `EmailLayout.tsx`: The main layout component that includes the header, footer, and basic styling. All new email templates should use this component as their base.
-   `Button.tsx`: A customizable button component.
-   `InfoCard.tsx`: A card component for displaying important information.

### 4. Sending the Email

To send the new email, you need to integrate it into the `EmailService` and `TemplateService`.

1.  **Update `template.service.ts`**: Add the new template to the `templateMap` in `resolveTemplatePath`:

    ```typescript
    // src/modules/email/template.service.ts
    const templateMap = {
      // ... existing templates
      'new-feature': './templates/emails/NewFeatureEmail',
    };
    ```

2.  **Update `email.service.ts`**: Create a new method in `EmailService` to send the email. This method will call the `sendTemplateEmail` method with the appropriate data.

    ```typescript
    // src/modules/email/email.service.ts
    async sendNewFeatureEmail(to: string, data: { userName: string; featureName: string }) {
      return this.sendTemplateEmail({
        to,
        template: 'new-feature',
        data,
        subject: `New Feature Alert: ${data.featureName}!`,
      });
    }
    ```

## Exporting Static HTML

You can also export the email templates as static HTML files using the following command:

```bash
bun run email:export
```

This will generate the HTML files in an `out` directory in the project root. This can be useful for sharing the templates or for use in environments where you can't render React components on the fly.
