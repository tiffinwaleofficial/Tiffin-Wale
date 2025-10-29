**4. API Endpoints and their purpose:**

*   **Auth Endpoints**: `POST /auth/login`, `POST /auth/logout`.
*   **Admin Dashboard Endpoints**: `GET /admin/dashboard/stats`, `GET /admin/dashboard/activities`.
*   **Admin Orders Management**: `GET /admin/orders`, `PATCH /admin/orders/{orderId}/status`.
*   **Admin Partners Management**: `GET /admin/partners`, `PATCH /admin/partners/{partnerId}/status`.
*   **Admin Customers Management**: `GET /admin/customers`.
*   **Admin Subscriptions Management**: `GET /admin/subscriptions`, `GET /subscriptions/active`.
*   **Analytics Endpoints**: `GET /admin/revenue`, `GET /analytics/revenue-history`, `GET /analytics/earnings`.
*   **Support Management**: `GET /admin/support/tickets`, `PATCH /admin/support/tickets/{ticketId}`.