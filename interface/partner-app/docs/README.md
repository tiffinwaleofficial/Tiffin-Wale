# Partner App Documentation

Welcome to the Partner App documentation! This guide helps restaurant partners manage their business through our mobile application.

## 🚀 **LATEST UPDATE - December 2024**

### ✅ **7 Critical Partner APIs Now Available!**

We've successfully implemented the most essential APIs for partner functionality:

- **Profile Management**: Get and update partner profile
- **Order Management**: View all orders and today's orders  
- **Menu Management**: Access partner's menu items
- **Analytics**: View business statistics and performance
- **Status Control**: Toggle accepting new orders on/off

**👉 See [API_Status.md](./API_Status.md) for complete integration details and examples.**

---

## 📱 App Overview

The Partner App enables restaurant partners to:

- ✅ **Manage Profile** - Update business information, hours, and contact details
- ✅ **View Orders** - See incoming orders and track order history
- ✅ **Monitor Analytics** - Track earnings, performance, and customer feedback
- ✅ **Control Availability** - Toggle accepting new orders on/off
- 🔄 **Manage Menu** - Add, edit, and organize menu items *(coming soon)*
- 🔄 **Process Orders** - Accept, prepare, and mark orders ready *(coming soon)*
- 🔄 **Handle Payments** - View earnings and request payouts *(coming soon)*

## 🛠️ Quick Start for Developers

### **Ready-to-Use APIs (Phase 2A - December 2024)**

#### 1. Get Current Partner Profile
```typescript
GET /partners/user/me
Authorization: Bearer <jwt_token>
```

#### 2. Update Partner Profile  
```typescript
PUT /partners/me
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "businessName": "Updated Restaurant Name",
  "description": "New description",
  "isAcceptingOrders": true
}
```

#### 3. Get Partner's Orders
```typescript
GET /partners/orders/me?page=1&limit=10&status=pending
Authorization: Bearer <jwt_token>
```

#### 4. Get Today's Orders
```typescript
GET /partners/orders/me/today  
Authorization: Bearer <jwt_token>
```

#### 5. Get Partner's Menu
```typescript
GET /partners/menu/me
Authorization: Bearer <jwt_token>
```

#### 6. Get Business Statistics
```typescript
GET /partners/stats/me
Authorization: Bearer <jwt_token>
```

#### 7. Toggle Accepting Orders
```typescript
PUT /partners/status/me
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "isAcceptingOrders": false
}
```

### **Environment Setup**

Make sure your app is configured to use the correct backend URL:

```typescript
// config/environment.ts
export const config = {
  // Local development
  API_URL: 'http://localhost:3000',
  
  // Production
  // API_URL: 'https://your-backend-domain.com'
};
```

---

## 📂 Project Structure

```
partner-app/
├── app/                    # Main app screens
│   ├── (auth)/            # Authentication screens
│   │   ├── login.tsx      # ✅ Login with real API
│   │   └── signup.tsx     # 🔄 Ready for integration
│   └── (tabs)/            # Main app navigation
│       ├── index.tsx      # ✅ Dashboard with stats API
│       ├── earnings.tsx   # 🔄 Awaiting analytics APIs  
│       └── profile/       # ✅ Ready for profile APIs
├── components/            # Reusable UI components
├── store/                 # State management (Zustand)
├── types/                 # TypeScript definitions
├── utils/                 # API client and services
└── docs/                  # Documentation (you are here!)
```

## 🔗 API Integration Status

| Feature | Frontend Status | Backend Status | Integration Status |
|---------|----------------|----------------|-------------------|
| **Authentication** | ✅ Complete | ✅ Complete | ✅ **CONNECTED** |
| **Partner Profile** | ✅ Complete | ✅ Complete | 🔄 **READY TO CONNECT** |
| **Order Management** | ✅ Complete | ✅ Complete | 🔄 **READY TO CONNECT** |
| **Menu Management** | ✅ Complete | ✅ Complete | 🔄 **READY TO CONNECT** |
| **Analytics/Stats** | ✅ Complete | ✅ Complete | 🔄 **READY TO CONNECT** |
| **Status Control** | ✅ Complete | ✅ Complete | 🔄 **READY TO CONNECT** |
| Order Actions | 🔄 UI Ready | ❌ Pending | ⏳ **WAITING FOR BACKEND** |
| Image Upload | 🔄 UI Ready | ❌ Pending | ⏳ **WAITING FOR BACKEND** |
| Advanced Analytics | 🔄 UI Ready | ❌ Pending | ⏳ **WAITING FOR BACKEND** |

## 📖 Documentation Files

- **[API_Status.md](./API_Status.md)** - Complete API reference with examples and payloads
- **[Development_Guide.md](./Development_Guide.md)** - Setup and development workflow
- **[README.md](./README.md)** - This overview document (you are here!)

## 🎯 Next Development Priorities

### **Phase 2A - Frontend Integration (Current)**
- Connect existing UI to the 7 newly created APIs
- Update stores with real API calls
- Add proper error handling and loading states
- Test all flows with real backend data

### **Phase 2B - Backend Expansion (Next)**
- Create advanced analytics APIs
- Implement image upload functionality  
- Add order action endpoints (accept, reject, ready)
- Build notification system

### **Phase 3 - Advanced Features (Future)**
- Real-time order updates
- Payment and payout management
- Support ticket system
- Advanced reporting

## 🚨 Important Notes

### **Authentication Required**
All partner APIs require JWT Bearer token authentication. Make sure to:
1. Store the JWT token securely after login
2. Include it in the Authorization header for all API calls
3. Handle token expiration and refresh appropriately

### **Error Handling**
The APIs return consistent error responses. Always handle:
- `401 Unauthorized` - Invalid or missing token
- `404 Not Found` - Partner profile not found
- `400 Bad Request` - Validation errors
- `500 Internal Server Error` - Server issues

### **API Base URLs**
- **Local Development**: `http://localhost:3000`
- **Production**: Use your deployed backend URL

## 🔧 Development Setup

See [Development_Guide.md](./Development_Guide.md) for detailed setup instructions.

## 📞 Support

For technical questions or issues:
1. Check the [API_Status.md](./API_Status.md) for detailed API information
2. Review error responses and status codes
3. Verify authentication tokens and permissions
4. Contact the backend team for API-specific issues

---

**Happy Coding! 🍕📱**

*Last Updated: December 2024*  
*Status: 7 Critical APIs Ready for Integration* 