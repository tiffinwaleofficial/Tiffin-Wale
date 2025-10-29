# 🔐 Super Admin Authentication Guide

## ✅ Backend Configuration (Verified Correct)

### Role Enum
```typescript
// services/monolith_backend/src/common/interfaces/user.interface.ts
export enum UserRole {
  CUSTOMER = "customer",
  PARTNER = "partner", 
  ADMIN = "admin",
  SUPER_ADMIN = "super_admin", // ✅ Correct value
}
```

### Endpoints

**Registration:**
```
POST /api/auth/super-admin/register
Body: {
  email: string,
  password: string (min 8 chars, uppercase, lowercase, number, special char),
  role: "super_admin", // Auto-set by backend
  firstName?: string,
  lastName?: string,
  phoneNumber?: string
}
```

**Login (Same for all roles):**
```
POST /api/auth/login
Body: {
  email: string,
  password: string
}

Response: {
  token: string,
  refreshToken: string,
  user: {
    _id: string,
    email: string,
    role: "super_admin",
    firstName?: string,
    lastName?: string,
    isActive: boolean
  }
}
```

### Authorization

**Super Admin Has Full Access:**
```typescript
// services/monolith_backend/src/modules/auth/guards/roles.guard.ts (line 22)
if (user?.role === UserRole.SUPER_ADMIN) {
  return true; // ✅ Super admins bypass ALL role checks!
}
```

**All Super Admin Endpoints Protected:**
```typescript
// services/monolith_backend/src/modules/super-admin/super-admin.controller.ts
@ApiBearerAuth()
@Roles(UserRole.SUPER_ADMIN)  // ✅ Applied at controller level
@Controller("super-admin")
export class SuperAdminController {
  // All endpoints require SUPER_ADMIN role
}
```

---

## 🐛 Common Issues & Solutions

### Issue 1: Can't Login After Registration

**Symptom:** Created super admin via `/api/auth/super-admin/register` but login fails

**Causes:**
1. ❌ Wrong role value in database
2. ❌ Token not being stored in frontend
3. ❌ Frontend not sending correct credentials
4. ❌ CORS issues

**Solution:**
```bash
# 1. Verify user was created with correct role
# In MongoDB/Database, check:
db.users.findOne({ email: "your-email" })
# Should show: role: "super_admin"

# 2. Test login directly with curl:
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"Password123!"}'

# Should return token + user object
```

### Issue 2: "Access Denied" After Login

**Symptom:** Login works but can't access super-admin endpoints

**Causes:**
1. ❌ Token not being sent in requests
2. ❌ User role is not `"super_admin"` in database
3. ❌ Firebase auth token instead of JWT token

**Solution:**
Check browser DevTools → Application → Local Storage:
- Should have: `token` (JWT from backend)
- Should NOT use: Firebase token for super admin

### Issue 3: Role Mismatch

**Symptom:** User has role `"SUPER_ADMIN"` instead of `"super_admin"`

**Fix:** The backend ALWAYS uses lowercase with underscore:
```typescript
UserRole.SUPER_ADMIN = "super_admin" // ✅ Correct
```

---

## 🔧 Frontend Integration Fixes

### Current Auth Provider Issue

The auth provider is trying to use Firebase auth, but super admin should use **JWT tokens from backend**, not Firebase!

**Problem:**
```typescript
// src/context/auth-provider.tsx
const auth = getAuth(); // ❌ Firebase - wrong for super admin!
const user = auth.currentUser; // ❌ This won't work for super admin
const token = await user.getIdToken(); // ❌ Firebase token, not JWT
```

**Solution:**
Super admin should use:
1. **Registration:** Backend JWT-based registration
2. **Login:** Backend JWT-based login  
3. **Token Storage:** LocalStorage (not Firebase)
4. **API Calls:** JWT Bearer token (not Firebase token)

---

## ✅ Correct Flow

### Registration Flow
```
1. POST /api/auth/super-admin/register
   └─> Returns: { token, refreshToken, user }
   
2. Store token in localStorage
   
3. Use token for all API calls:
   Authorization: Bearer <token>
```

### Login Flow (Current - Needs Fix!)
```
1. POST /api/auth/login
   Body: { email, password }
   └─> Returns: { token, refreshToken, user }
   
2. ❌ CURRENT: Trying to use Firebase auth
   ✅ SHOULD: Store JWT token from response
   
3. ❌ CURRENT: Getting Firebase ID token
   ✅ SHOULD: Use JWT token from localStorage
```

---

## 🛠️ What Needs to be Fixed

### 1. Auth Provider (src/context/auth-provider.tsx)

**Current (Wrong for JWT):**
```typescript
const auth = getAuth();
const user = auth.currentUser;
const token = await user.getIdToken(); // Firebase token
```

**Should Be:**
```typescript
const token = localStorage.getItem('token'); // JWT token
```

### 2. API Client (src/lib/api/client.ts)

**Current (Wrong):**
```typescript
const auth = getAuth();
const user = auth.currentUser;
const token = await user.getIdToken(); // Firebase token
config.headers.Authorization = `Bearer ${token}`;
```

**Should Be:**
```typescript
const token = localStorage.getItem('token'); // JWT from backend
if (token) {
  config.headers.Authorization = `Bearer ${token}`;
}
```

---

## 🎯 Recommended Approach

### Dual Auth System

**For Customer/Partner:**
- Use Firebase Authentication (phone-based)
- Firebase ID tokens

**For Super Admin/Admin:**
- Use Backend JWT Authentication
- Store JWT in localStorage
- Don't use Firebase

### Implementation

**Option A: Separate Auth Flows**
```typescript
// Check user type
if (role === 'super_admin' || role === 'admin') {
  // Use JWT auth
  const token = localStorage.getItem('token');
} else {
  // Use Firebase auth
  const token = await firebaseUser.getIdToken();
}
```

**Option B: Backend-Only Auth (Recommended)**
```typescript
// Remove Firebase dependency
// Use ONLY backend JWT for all users
const token = localStorage.getItem('token');
```

---

## 📝 Testing Super Admin

### 1. Create Super Admin
```bash
curl -X POST http://localhost:3001/api/auth/super-admin/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "superadmin@tiffinwale.com",
    "password": "SuperAdmin123!",
    "firstName": "Super",
    "lastName": "Admin",
    "role": "super_admin"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "superadmin@tiffinwale.com",
    "password": "SuperAdmin123!"
  }'

# Response:
{
  "token": "eyJhbGc...",
  "refreshToken": "...",
  "user": {
    "_id": "...",
    "email": "superadmin@tiffinwale.com",
    "role": "super_admin", // ✅ Must be this value!
    "isActive": true
  }
}
```

### 3. Access Super Admin Endpoints
```bash
curl -X GET http://localhost:3001/api/super-admin/dashboard/stats \
  -H "Authorization: Bearer <your-token>"
```

---

## 🚨 Critical Findings

1. ✅ **Correct Registration Endpoint:** `/api/auth/super-admin/register`
2. ✅ **Correct Role Value:** `"super_admin"` (lowercase with underscore)
3. ✅ **Super Admin Bypass:** Line 22 in roles.guard.ts allows super admin to access everything
4. ❌ **Frontend Issue:** Using Firebase auth instead of JWT auth
5. ❌ **Token Mismatch:** Frontend sends Firebase token, backend expects JWT

---

## 🔧 Immediate Fixes Needed

1. Fix `src/lib/api/client.ts` - Use localStorage JWT instead of Firebase token
2. Fix `src/context/auth-provider.tsx` - Handle JWT auth properly for super admin
3. Verify token is stored after registration/login

---

**Next: I'll implement these fixes!**


