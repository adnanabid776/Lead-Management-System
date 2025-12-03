# Backend Integration Guide

## Overview
This document explains how to integrate the frontend with the backend API. Currently, the frontend is using dummy data stored in localStorage. Follow these steps to connect to a real backend.

## Dependencies Required for Backend Integration

The following dependencies are **already installed** in your `package.json`:

### 1. **Axios** (HTTP Client)
```json
"axios": "^1.13.2"
```
- **Purpose**: Making HTTP requests to the backend API
- **Usage**: Already configured in `src/api/axios.js`
- **Status**: ✅ Installed

### 2. **JWT Decode** (Token Decoding)
```json
"jwt-decode": "^4.0.0"
```
- **Purpose**: Decoding JWT tokens from the backend
- **Usage**: Used in `src/Context/AuthContext.jsx`
- **Status**: ✅ Installed

### 3. **React Router DOM** (Routing)
```json
"react-router-dom": "^7.9.6"
```
- **Purpose**: Client-side routing and navigation
- **Usage**: Used throughout the app for navigation
- **Status**: ✅ Installed

## Environment Variables

Create a `.env` file in the root of your frontend directory:

```env
VITE_API_URL=http://localhost:5000/api/v1/
```

For production:
```env
VITE_API_URL=https://your-backend-domain.com/api/v1/
```

## API Configuration

The API base URL is configured in `src/api/axios.js`:
```javascript
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1/";
```

## Steps to Integrate Backend

### Step 1: Remove Dummy Data
1. Delete or comment out all imports from `src/data/dummyData.js`
2. Remove all `initDummyData()` calls
3. Remove all `DUMMY DATA MODE` comment blocks

### Step 2: Uncomment API Calls

In each file, uncomment the backend API calls that are marked with:
```javascript
// TODO: Uncomment when backend is integrated
```

### Step 3: Update Files

#### 1. **AuthContext.jsx** (`src/Context/AuthContext.jsx`)
- ✅ Uncomment: `import { fetchMe } from "../api/auth";`
- ✅ Uncomment the `fetchMe()` call in `useEffect`
- ❌ Remove dummy data logic

#### 2. **Login.jsx** (`src/Pages/Login.jsx`)
- ✅ Uncomment: `import { login as loginApi } from "../api/auth";`
- ✅ Uncomment the `loginApi()` call
- ❌ Remove dummy data login logic

#### 3. **Dashboard.jsx** (`src/Pages/Dashboard.jsx`)
- ✅ Uncomment: `import { getLeads } from "../api/leads";`
- ✅ Uncomment the `getLeads()` call
- ❌ Remove dummy data logic

#### 4. **LeadList.jsx** (`src/Pages/Leads/LeadList.jsx`)
- ✅ Uncomment: `import { getLeads, deleteLead } from "../../api/leads";`
- ✅ Uncomment API calls
- ❌ Remove dummy data logic

#### 5. **AddLead.jsx** (`src/Pages/Leads/AddLead.jsx`)
- ✅ Uncomment: `import { createLead } from "../../api/leads";`
- ✅ Uncomment the `createLead()` call
- ❌ Remove dummy data logic

#### 6. **LeadDetails.jsx** (`src/Pages/Leads/LeadDetails.jsx`)
- ✅ Uncomment: `import { getLead, updateLead, assignLead } from "../../api/leads";`
- ✅ Uncomment: `import { getUsers } from "../../api/users";`
- ✅ Uncomment all API calls
- ❌ Remove dummy data logic

#### 7. **UserList.jsx** (`src/Pages/Users/UserList.jsx`)
- ✅ Uncomment: `import { getUsers, deleteUser } from "../../api/users";`
- ✅ Uncomment API calls
- ❌ Remove dummy data logic

#### 8. **AddUser.jsx** (`src/Pages/Users/AddUser.jsx`)
- ✅ Uncomment: `import { createUser } from "../../api/users";`
- ✅ Uncomment the `createLead()` call
- ❌ Remove dummy data logic

#### 9. **AppointmentList.jsx** (`src/Pages/Appointments/AppointmentList.jsx`)
- ✅ Uncomment: `import { getAppointments, updateAppointment, deleteAppointment } from "../../api/appointments";`
- ✅ Uncomment all API calls
- ❌ Remove dummy data logic

#### 10. **AddAppointment.jsx** (`src/Pages/Appointments/AddAppointment.jsx`)
- ✅ Uncomment: `import { createAppointment } from "../../api/appointments";`
- ✅ Uncomment the `createAppointment()` call
- ❌ Remove dummy data logic

## Expected Backend API Endpoints

Your backend should implement these endpoints:

### Authentication
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/me` - Get current user
- `POST /api/v1/auth/register` - Register user (admin only)

### Leads
- `GET /api/v1/leads` - Get all leads (role-filtered)
- `GET /api/v1/leads/:id` - Get single lead
- `POST /api/v1/leads` - Create lead
- `PUT /api/v1/leads/:id` - Update lead
- `DELETE /api/v1/leads/:id` - Delete lead
- `POST /api/v1/leads/:id/assign` - Assign lead to user

### Users
- `GET /api/v1/users` - Get all users (admin only)
- `POST /api/v1/users` - Create user (admin only)
- `PUT /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user

### Appointments
- `GET /api/v1/appointments` - Get all appointments (role-filtered)
- `POST /api/v1/appointments` - Create appointment
- `PUT /api/v1/appointments/:id` - Update appointment
- `DELETE /api/v1/appointments/:id` - Delete appointment

## Authentication Flow

1. User logs in via `POST /api/v1/auth/login`
2. Backend returns JWT token
3. Frontend stores token in localStorage
4. Axios interceptor adds token to all requests: `Authorization: Bearer <token>`
5. Backend validates token on protected routes

## CORS Configuration

Make sure your backend has CORS enabled for your frontend URL:
```javascript
// Example (Express.js)
app.use(cors({
  origin: 'http://localhost:5173', // Vite default port
  credentials: true
}));
```

## Testing the Integration

1. Start your backend server (typically on port 5000)
2. Update `.env` with correct backend URL
3. Start frontend: `npm run dev`
4. Test login with real backend credentials
5. Verify all API calls are working

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure backend CORS is configured
   - Check frontend URL matches CORS origin

2. **401 Unauthorized**
   - Verify token is being sent in headers
   - Check token hasn't expired
   - Ensure backend validates token correctly

3. **404 Not Found**
   - Verify API base URL is correct
   - Check endpoint paths match backend routes

4. **Network Errors**
   - Ensure backend server is running
   - Check firewall/port settings
   - Verify API URL in `.env` file

## Quick Integration Checklist

- [ ] Backend server is running
- [ ] `.env` file created with `VITE_API_URL`
- [ ] All dummy data imports removed
- [ ] All API imports uncommented
- [ ] All API calls uncommented
- [ ] CORS configured on backend
- [ ] Test login functionality
- [ ] Test all CRUD operations
- [ ] Verify role-based access control

