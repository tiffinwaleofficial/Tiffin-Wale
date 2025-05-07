# Tiffin Admin Pro - Documentation

This folder contains detailed documentation for the Tiffin Admin Pro application. This includes feature guides, technical specifications, and setup instructions.

## Contents

-   **Feature Guides**: Comprehensive guides explaining each feature of the application.
-   **API Documentation**: Technical details on the APIs used within the application.
-   **Deployment Guide**: Step-by-step instructions for deploying the application to various environments.

## Feature Guides

### 1. Admin Authentication

-   **Description**: Secure login process for administrators using Email/Password authentication through Firebase.
-   **Details**:
    -   Administrators can log in using valid email and password credentials.
    -   Firebase Authentication handles user authentication and session management.
    -   On successful login, administrators are redirected to the main dashboard.

### 2. Dashboard Overview

-   **Description**: Displays key metrics and insights related to the Tiffin Wale service.
-   **Details**:
    -   **Key Metrics**:
        -   Daily Orders: Number of orders placed for the current day.
        -   Active Subscriptions: Total number of active customer subscriptions.
        -   Active Partners: Number of tiffin center partners currently active on the platform.
        -   Total Revenue: Sum of all revenue generated within the current month.
    -   **Insightful Charts**:
        -   Orders Trend: Visual representation of order volume over time.
        -   Revenue Graph: Line graph depicting revenue trends over the past months.
        -   Partner Growth: Chart showing the increase in the number of active partners.
        -   Subscription Distribution: Pie chart illustrating the proportion of each subscription type (monthly, weekly, trial).
    -   **Latest Activities Log**:
        -   Tracks and displays recent actions performed by administrators and system events.
        -   Each activity log includes a timestamp and a brief description.

### 3. Partner Management

-   **Description**: Allows administrators to manage tiffin center partners.
-   **Features**:
    -   **View Partners**: Displays a list of all registered partners with essential details.
    -   **Approve/Ban Partners**: Ability to change partner status (active, inactive, pending approval, banned).
    -   **Detailed Partner Profiles**: Access to detailed information about each partner.
    -   **Filtering**: Filter partners by city, status, and registration date.

### 4. Customer Management

-   **Description**: Manage registered users (students) of the tiffin service.
-   **Features**:
    -   **View Customers**: Lists all registered customers with their details.
    -   **Customer Details**: Access to customer profiles, subscription status, and other relevant information.
    -   **Actions**: Take actions such as banning or contacting users.

### 5. Order Management

-   **Description**: Track and manage tiffin orders.
-   **Features**:
    -   **Order Tracking**: Displays all orders with their current status.
    -   **Filtering**: Filter orders by meal type, status, delivery partner, and date.
    -   **Status Updates**: Manually update delivery statuses.

### 6. Subscription Management

-   **Description**: View and manage customer subscription plans (monthly, weekly, trial).
-   **Features**:
    -   **Subscription Overview**: Displays all subscriptions and their statuses (active, paused, cancelled, expired).
    -   **Subscription Details**: View detailed subscription information.
    -   **Actions**: Ability to pause, cancel, or modify subscriptions.

### 7. Menu Management

-   **Description**: Add, edit, and manage the daily/weekly menus offered by partners for lunch and dinner.
-   **Features**:
    -   **Menu Creation**: Add new menus for specific dates and meal types.
    -   **Menu Editing**: Modify existing menus.
    -   **Menu Listing**: Display menus and their details, including the items offered.

### 8. Revenue & Payouts

-   **Description**: Monitor overall revenue trends, platform commission, and manage partner payouts.
-   **Features**:
    -   **Revenue Monitoring**: Track overall revenue trends.
    -   **Commission Tracking**: View the platform commission generated.
    -   **Payout Management**: Manage partner payouts and track their status (pending, paid, failed).
    -   **Data Export**: Export payout data in various formats.

### 9. Support Tickets

-   **Description**: View and manage support requests submitted by customers and partners.
-   **Features**:
    -   **Ticket Viewing**: Display all support tickets with their details.
    -   **Ticket Management**: Reply to tickets and manage their status (open, in progress, resolved, closed).
    -   **Filtering**: Filter tickets by status, submitter type, and date.

### 10. Settings

-   **Description**: Manage admin profile details, change password, configure notification preferences, and manage system settings (placeholders for API keys, etc.).
-   **Features**:
    -   **Profile Management**: Manage admin profile details.
    -   **Security**: Ability to change admin password.
    -   **Notifications**: Configure notification preferences.
    -   **System Settings**: Manage system-wide settings and configurations.

## API Documentation

_(To be filled with details on the Firebase APIs used for authentication, data storage, and real-time updates.)_

## Deployment Guide

_(To be filled with step-by-step instructions for deploying the application to Google App Engine.)_
