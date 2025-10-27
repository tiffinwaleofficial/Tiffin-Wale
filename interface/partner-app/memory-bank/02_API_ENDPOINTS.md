# 🔗 Complete API Endpoints Reference

**Last Updated:** December 2024  
**Base URL:** `http://localhost:3001` (development) / `https://api.tiffin-wale.com` (production)  
**Authentication:** All endpoints (except auth) require `Authorization: Bearer <token>` header

---

## 📊 API Status Overview

| Category | Total | ✅ Ready | 🟡 Partial | 🔴 Pending |
|-----------|-------|---------|------------|-----------|
| Authentication | 8 | 3 | 2 | 3 |
| Partner Profile | 7 | 4 | 3 | 0 |
| Orders | 10 | 5 | 3 | 2 |
| Menu | 9 | 6 | 3 | 0 |
| Analytics | 6 | 1 | 3 | 2 |
| Notifications | 5 | 0 | 2 | 3 |
| Upload | 3 | 0 | 0 | 3 |
| Support | 2 | 0 | 0 | 2 |

---

## ✅ Ready-to-Use Endpoints (Phase 2A)

### 1. **GET /partners/user/me** - Get Current Partner Profile
```typescript
Authorization: Bearer <token>
Response: PartnerProfile
Status: ✅ Connected
```

### 2. **PUT /partners/me** - Update Partner Profile
```typescript
Authorization: Bearer <token>
Content-Type: application/json
Body: Partial<PartnerProfile>
Response: PartnerProfile
Status: ✅ Connected
```

### 3. **GET /partners/orders/me** - Get Partner Orders (Pagination)
```typescript
Authorization: Bearer <token>
Query: ?page=1&limit=10&status=pending
Response: { orders: Order[], total: number, page: number, limit: number }
Status: ✅ Connected
```

### 4. **GET /partners/orders/me/today** - Get Today's Orders
```typescript
Authorization: Bearer <token>
Response: { todayOrders: Order[], todayStats: OrderStats }
Status: ✅ Connected
```

### 5. **GET /partners/menu/me** - Get Partner Menu
```typescript
Authorization: Bearer <token>
Response: { menuItems: MenuItem[], categories: MenuCategory[] }
Status: ✅ Connected
```

### 6. **GET /partners/stats/me** - Get Business Statistics
```typescript
Authorization: Bearer <token>
Response: PartnerStats
Status: ✅ Connected
```

### 7. **PUT /partners/status/me** - Toggle Accepting Orders
```typescript
Authorization: Bearer <token>
Body: { isAcceptingOrders: boolean }
Response: PartnerProfile
Status: ✅ Connected
```

---

## 🔐 Authentication APIs

| Endpoint | Method | Status | Description |
|----------|--------|--------|-------------|
| `/auth/login` | POST | ✅ Ready | Email/password login |
| `/auth/login-phone` | POST | ✅ Ready | Phone number login |
| `/auth/register` | POST | 🟡 Ready | Partner registration |
| `/auth/refresh` | POST | 🔴 Pending | Token refresh |
| `/auth/logout` | POST | 🟡 Ready | Logout |
| `/auth/change-password` | POST | 🟡 Ready | Change password |
| `/auth/check-phone` | POST | ✅ Ready | Check if user exists |

---

## 👤 Partner Profile APIs

| Endpoint | Method | Status | Description |
|----------|--------|--------|-------------|
| `/partners/user/me` | GET | ✅ Ready | Get current profile |
| `/partners/me` | PUT | ✅ Ready | Update profile |
| `/partners/:id` | GET | 🟡 Ready | Get by ID |
| `/partners/:id` | PUT | 🟡 Ready | Update by ID |
| `/partners/status/me` | PUT | ✅ Ready | Update status |

---

## 📦 Order Management APIs

| Endpoint | Method | Status | Description |
|----------|--------|--------|-------------|
| `/partners/orders/me` | GET | ✅ Ready | Get my orders (paginated) |
| `/partners/orders/me/today` | GET | ✅ Ready | Get today's orders |
| `/orders/:id` | GET | ✅ Ready | Get order details |
| `/orders/:id/status` | PATCH | 🟡 Ready | Update order status |
| `/orders/:id/accept` | PATCH | 🔴 Pending | Accept order |
| `/orders/:id/reject` | PATCH | 🔴 Pending | Reject order |
| `/orders/:id/ready` | PATCH | 🟡 Ready | Mark order ready |
| `/orders/:id/preparing` | PATCH | 🟡 Ready | Start preparing |

---

## 🍽️ Menu Management APIs

| Endpoint | Method | Status | Description |
|----------|--------|--------|-------------|
| `/partners/menu/me` | GET | ✅ Ready | Get my menu |
| `/menu` | POST | 🟡 Ready | Create menu item |
| `/menu/:id` | GET | 🟡 Ready | Get item by ID |
| `/menu/:id` | PATCH | 🟡 Ready | Update item |
| `/menu/:id` | DELETE | 🟡 Ready | Delete item |
| `/menu/categories` | GET | 🟡 Ready | Get categories |
| `/menu/categories` | POST | 🟡 Ready | Create category |

---

## 📊 Analytics & Statistics APIs

| Endpoint | Method | Status | Description |
|----------|--------|--------|-------------|
| `/partners/stats/me` | GET | ✅ Ready | Get statistics |
| `/partners/:id/stats` | GET | 🟡 Ready | Get specific partner stats |
| `/analytics/earnings` | GET | 🔴 Pending | Earnings analytics |
| `/analytics/orders` | GET | 🔴 Pending | Order analytics |
| `/analytics/revenue-history` | GET | 🔴 Pending | Revenue history |
| `/analytics/dashboard` | GET | 🟡 Partial | Dashboard summary |

---

## 🔔 Notification APIs

| Endpoint | Method | Status | Description |
|----------|--------|--------|-------------|
| `/notifications/partner/me` | GET | 🔴 Pending | Get my notifications |
| `/notifications/:id/read` | PATCH | 🔴 Pending | Mark as read |
| `/notifications/read-all` | PATCH | 🔴 Pending | Mark all as read |

---

## 🖼️ File Upload APIs

| Endpoint | Method | Status | Description |
|----------|--------|--------|-------------|
| `/upload/image` | POST | 🔴 Pending | Upload image (Cloudinary) |
| `/upload/image/:publicId` | DELETE | 🔴 Pending | Delete image |
| `/upload/multiple` | POST | 🔴 Pending | Upload multiple images |

---

## 💬 Support & Help APIs

| Endpoint | Method | Status | Description |
|----------|--------|--------|-------------|
| `/support/tickets` | POST | 🔴 Pending | Create support ticket |
| `/support/tickets/me` | GET | 🔴 Pending | Get my tickets |

---

## 💳 Payment & Payout APIs

| Endpoint | Method | Status | Description |
|----------|--------|--------|-------------|
| `/payouts/partner/me` | GET | 🔴 Pending | Get payouts |
| `/payouts/request` | POST | 🔴 Pending | Request payout |

---

## 🔧 API Client Usage

### Basic API Call
```typescript
import api from '@/utils/apiClient';

// Get current profile
const profile = await api.partner.getCurrentProfile();

// Update profile
const updatedProfile = await api.partner.updateProfile({
  businessName: 'New Name'
});

// Get orders
const { orders, total } = await api.orders.getMyOrders(1, 10, 'pending');
```

### With Error Handling
```typescript
try {
  const profile = await api.partner.getCurrentProfile();
  setProfile(profile);
} catch (error) {
  console.error('Failed to fetch profile:', error);
  showError('Unable to load profile');
}
```

### Using Stores
```typescript
import { usePartnerStore } from '@/store/partnerStore';

function ProfileScreen() {
  const { profile, fetchProfile, updateProfile } = usePartnerStore();
  
  useEffect(() => {
    fetchProfile();
  }, []);
  
  const handleUpdate = async (data) => {
    await updateProfile(data);
  };
}
```

---

## 📝 Request/Response Examples

### Login Request
```typescript
POST /auth/login
{
  "email": "partner@example.com",
  "password": "securepass123"
}

Response: {
  "accessToken": "jwt_token_here",
  "refreshToken": "refresh_token_here",
  "user": {
    "id": "user_id",
    "email": "partner@example.com",
    "role": "PARTNER"
  },
  "partner": {
    "id": "partner_id",
    "businessName": "Restaurant Name",
    "isAcceptingOrders": true
  }
}
```

### Update Profile Request
```typescript
PUT /partners/me
Authorization: Bearer <token>
{
  "businessName": "Updated Name",
  "description": "New description",
  "isAcceptingOrders": false
}
```

---

## 🚨 Error Handling

All endpoints return consistent error responses:

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Resource not found",
  "error": "Not Found"
}
```

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": ["Validation error messages"],
  "error": "Bad Request"
}
```

---

## 🔄 Token Management

### Automatic Token Refresh
The API client automatically handles token refresh:
1. On 401 error, attempts to refresh using refresh token
2. Retries original request with new token
3. Logs out user if refresh fails

### Secure Storage
- Tokens stored in Expo SecureStore (mobile)
- AsyncStorage used for web platform
- Managed by `auth/SecureTokenManager.ts`

---

## 📚 Related Files

- API Client: `utils/apiClient.ts`
- Generated API: `api/generated/api.ts`
- Custom Instance: `api/custom-instance.ts`
- Token Manager: `auth/SecureTokenManager.ts`

