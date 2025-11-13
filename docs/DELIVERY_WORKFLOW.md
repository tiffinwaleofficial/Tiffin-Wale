# Delivery Workflow: Out for Delivery → Delivered

## Current Implementation
Orders can transition from `ready` → `out_for_delivery` → `delivered`.

## Recommended Approach for Tiffin Service

### Option 1: Partner Marks as Delivered (Current - Simple)
**How it works:**
- Partner marks order as "Out for Delivery" when delivery person leaves
- Partner marks order as "Delivered" after delivery person confirms delivery
- **Pros:** Simple, full control with partner
- **Cons:** Relies on delivery person communication with partner

### Option 2: Customer Confirms Delivery (Best UX - Recommended)
**How it works:**
- Partner marks order as "Out for Delivery"
- When order is `out_for_delivery`, customer sees a "Confirm Delivery" button
- Customer clicks button to confirm receipt → Status changes to `delivered`
- **Pros:** Customer has control, accurate delivery tracking, better UX
- **Cons:** Requires customer action (but they're expecting food anyway)

### Option 3: Hybrid Approach (Best for Production)
**How it works:**
- Partner marks as "Out for Delivery"
- Customer can confirm delivery (primary method)
- If customer doesn't confirm within 2 hours, partner can mark as delivered (fallback)
- System can auto-mark as delivered after 24 hours if still unconfirmed (safety net)
- **Pros:** Flexible, handles edge cases, accurate
- **Cons:** Slightly more complex logic

## Recommended Implementation: Option 3 (Hybrid)

### Backend Endpoints Needed:
1. **Customer endpoint**: `POST /api/orders/:id/confirm-delivery`
   - Validates order is in `out_for_delivery` status
   - Updates to `delivered` with `actualDeliveryTime`
   - Broadcasts via WebSocket
   
2. **Partner endpoint**: `PATCH /api/orders/:id/status` (already exists)
   - Allows partner to manually mark as delivered if customer doesn't confirm

3. **Cron job** (optional): Auto-mark as delivered after 24 hours if still `out_for_delivery`

### Frontend Changes:
1. On track page, show "Confirm Delivery" button when status is `out_for_delivery`
2. Button calls `/api/orders/:id/confirm-delivery`
3. After confirmation, status updates to `delivered` with success message



