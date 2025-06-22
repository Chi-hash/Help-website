# Ticket Status Change Routes Documentation

## Overview
This document describes the comprehensive ticket status change routes with email notifications and in-app notifications.

## Base URL
```
/api/tickets
```

## Authentication
All routes require authentication via Bearer token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Routes

### 1. Open Ticket
**PUT** `/api/tickets/:ticketId/open`

Changes ticket status to "Open" and sends notifications to all relevant parties.

**Response:**
```json
{
  "success": true,
  "message": "Ticket opened successfully",
  "ticket": {
    "_id": "ticket_id",
    "ticketNumber": "#001",
    "subject": "Ticket Subject",
    "status": "Open",
    "createdBy": "user_id",
    "assignedTo": "user_id"
  },
  "oldStatus": "Closed",
  "newStatus": "Open"
}
```

**Notifications Sent:**
- To the person who opened the ticket
- To the ticket creator (if different)
- To the assigned user (if different)
- To admins, IT, and superAdmin for monitoring

---

### 2. Start Progress
**PUT** `/api/tickets/:ticketId/start-progress`

Changes ticket status to "InProgress" and notifies relevant parties that work has begun.

**Response:**
```json
{
  "success": true,
  "message": "Ticket progress started successfully",
  "ticket": {
    "_id": "ticket_id",
    "ticketNumber": "#001",
    "subject": "Ticket Subject",
    "status": "InProgress",
    "createdBy": "user_id",
    "assignedTo": "user_id"
  },
  "oldStatus": "Open",
  "newStatus": "InProgress"
}
```

**Notifications Sent:**
- To the person who started progress
- To the ticket creator
- To admins, IT, and superAdmin for monitoring

---

### 3. Resolve Ticket
**PUT** `/api/tickets/:ticketId/resolve`

Changes ticket status to "Resolved" and notifies all parties that the issue has been resolved.

**Response:**
```json
{
  "success": true,
  "message": "Ticket resolved successfully",
  "ticket": {
    "_id": "ticket_id",
    "ticketNumber": "#001",
    "subject": "Ticket Subject",
    "status": "Resolved",
    "createdBy": "user_id",
    "assignedTo": "user_id"
  },
  "oldStatus": "InProgress",
  "newStatus": "Resolved"
}
```

**Notifications Sent:**
- To the person who resolved the ticket
- To the ticket creator (if different)
- To admins, IT, and superAdmin for monitoring

---

### 4. Close Ticket
**PUT** `/api/tickets/:ticketId/close`

Changes ticket status to "Closed" and notifies all parties that the ticket has been closed.

**Response:**
```json
{
  "success": true,
  "message": "Ticket closed successfully",
  "ticket": {
    "_id": "ticket_id",
    "ticketNumber": "#001",
    "subject": "Ticket Subject",
    "status": "Closed",
    "createdBy": "user_id",
    "assignedTo": "user_id"
  },
  "oldStatus": "Resolved",
  "newStatus": "Closed"
}
```

**Notifications Sent:**
- To the person who closed the ticket
- To the ticket creator (if different)
- To the assigned user (if different)
- To admins, IT, and superAdmin for monitoring

---

### 5. Generic Status Update (Legacy)
**PUT** `/api/tickets/status/:ticketId`

Generic route for updating ticket status to any valid status.

**Request Body:**
```json
{
  "status": "Open|InProgress|Resolved|Closed"
}
```

**Response:**
```json
{
  "message": "Ticket status updated",
  "ticket": {
    "_id": "ticket_id",
    "ticketNumber": "#001",
    "subject": "Ticket Subject",
    "status": "NewStatus"
  }
}
```

---

## Error Responses

### 404 - Ticket Not Found
```json
{
  "message": "Ticket not found"
}
```

### 500 - Server Error
```json
{
  "success": false,
  "message": "Server error"
}
```

---

## Notification Types

Each status change creates notifications with specific types:

- `ticket-reopen` - When ticket is opened
- `ticket-progress` - When work starts
- `ticket-resolved` - When ticket is resolved
- `ticket-close` - When ticket is closed
- `status-change` - Generic status change (legacy route)

---

## Email Notifications

All status changes trigger email notifications to:
1. The person performing the action
2. The ticket creator (if different)
3. The assigned user (if different and applicable)
4. Admins, IT, and superAdmin for monitoring

---

## Usage Examples

### Frontend JavaScript Examples

```javascript
// Open a ticket
const openTicket = async (ticketId) => {
  const response = await fetch(`/api/tickets/${ticketId}/open`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return response.json();
};

// Start progress on a ticket
const startProgress = async (ticketId) => {
  const response = await fetch(`/api/tickets/${ticketId}/start-progress`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return response.json();
};

// Resolve a ticket
const resolveTicket = async (ticketId) => {
  const response = await fetch(`/api/tickets/${ticketId}/resolve`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return response.json();
};

// Close a ticket
const closeTicket = async (ticketId) => {
  const response = await fetch(`/api/tickets/${ticketId}/close`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return response.json();
};
```

### cURL Examples

```bash
# Open a ticket
curl -X PUT \
  http://localhost:3000/api/tickets/64f8a1b2c3d4e5f6a7b8c9d0/open \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json"

# Start progress
curl -X PUT \
  http://localhost:3000/api/tickets/64f8a1b2c3d4e5f6a7b8c9d0/start-progress \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json"

# Resolve ticket
curl -X PUT \
  http://localhost:3000/api/tickets/64f8a1b2c3d4e5f6a7b8c9d0/resolve \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json"

# Close ticket
curl -X PUT \
  http://localhost:3000/api/tickets/64f8a1b2c3d4e5f6a7b8c9d0/close \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json"
```

---

## Notes

1. All routes require authentication
2. All status changes trigger both in-app notifications and email notifications
3. The system automatically handles duplicate notifications (won't send to the same person multiple times)
4. All routes return consistent response format with success status
5. Error handling is comprehensive with appropriate HTTP status codes 