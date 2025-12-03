 📌  Lead Management System (MERN Stack) 

*A complete Lead & Appointment Management Platform*

  👤  Developed By 

*  Muhammad Junaid Anwar
*  Adnan Abid 
*  Department: Web Development

---

  🚀  1. Introduction 

The  Lead Management System  is a MERN-based platform designed to manage leads, appointments, and team workflows with role-based access.
This README provides a complete overview for:

* Administrators
* Developers
* API integrators

---

  🧩  2. System Overview 

The platform manages:

✔ Lead intake & distribution
✔ Appointment scheduling
✔ CSV lead import with duplicate detection
✔ Agent-based assignment
✔ Role-based dashboards & authentication

All users authenticate via JWT and are redirected to dashboards based on their role.

---

  🧑‍💼  3. User Roles & Permissions 

  🔹 Admin 

* Full system access
* Manage users
* Manage all leads & appointments
* Upload CSV files

  🔹 Manager 

* Assign leads to agents
* View/create/modify all appointments
* Upload CSV files

  🔹 Agent 

* View only assigned leads
* Create/edit/delete their own appointments

---

  🔄  4. Core Workflows 

   4.1 Authentication 

1. User submits email/password
2. Server verifies
3. JWT token generated
4. User redirected based on role

   4.2 Lead Workflow 

* Create leads manually OR via CSV
* Duplicate emails auto-skipped
* Leads can be assigned to agents

   4.3 Appointment Workflow 

* Create appointments for a specific lead
* Duplicate appointments (same lead + same agent) are blocked
* Visibility depends on user role

   4.4 CSV Upload Workflow 

* Upload CSV → system parses rows
* If email exists →  skip 
* If new email →  insert 

Returns summary:

* ✔ Total created
* ✔ Total skipped

---

  🖥  5. Admin Interface Guide 

  5.1 Leads 

* View/search/sort
* Assign leads

  5.2 Appointments 

* Admin/Manager → All appointments
* Agent → Only their appointments

  5.3 CSV Upload 

* Upload file
* View duplicate vs created summary

---

  🏗  6. System Architecture 

  Tech Stack 

| Layer       | Technology           |
| ----------- | -------------------- |
| Frontend    | React.js             |
| Backend     | Node.js + Express.js |
| Database    | MongoDB              |
| Auth        | JWT                  |
| File Upload | Multer / CSV Parser  |

---

  Directory Structure 

   Backend 

```
backend/
├── controllers/
├── routes/
├── middleware/
├── models/
├── utils/
└── server.js
```

   Frontend 

```
frontend/
├── src/
│   ├── api/
│   ├── components/
│   ├── context/
│   ├── pages/
│   ├── App.jsx
│   └── main.jsx
```

---

  ⚙  7. Backend Logic Overview 

  7.1 Authentication 

* JWT authentication
* Role-based access middleware

  7.2 Leads Module 

* Manual lead creation
* CSV upload with duplicate filtering
* Assign leads to agents

  7.3 Appointments Module 

* Prevent duplicate appointments
* Agents access only their own data
* Managers/Admins → full access

---

  📁  8. CSV Import Engine 

  Flow 

1. CSV uploaded (in-memory)
2. Parsed line-by-line
3. Email used for uniqueness
4. Insert or skip
5. Summary returned

  Middleware 

* In-memory file parsing
* No disk storage required

---

  🔌  9. Authentication API 

  POST  `/auth/login`

 Body: 

```json
{
  "email": "string",
  "password": "string"
}
```

 Response: 

```json
{
  "token": "JWT_TOKEN",
  "user": { ... }
}
```

---

 🧪  10. Lead API Endpoints 

| Method | Endpoint            | Description                   |
| ------ | ------------------- | ----------------------------- |
| GET    | `/leads`            | Get all leads (Admin/Manager) |
| POST   | `/leads`            | Create lead                   |
| POST   | `/leads/upload`     | Upload CSV                    |
| PUT    | `/leads/assign/:id` | Assign lead                   |

---

 📅  11. Appointment API Endpoints 

| Method | Endpoint            | Description                      |
| ------ | ------------------- | -------------------------------- |
| GET    | `/appointments`     | Admin/Manager → all, Agent → own |
| POST   | `/appointments`     | Create appointment               |
| PUT    | `/appointments/:id` | Update                           |
| DELETE | `/appointments/:id` | Delete                           |

---

 ⚠️  12. Error Handling 

| Error | Meaning                    |
| ----- | -------------------------- |
| 401   | Unauthorized               |
| 409   | Duplicate lead/appointment |
| 400   | Missing fields             |
| 404   | Not found                  |

---

 🚀  13. Future Improvements 

* Appointment reminders
* Lead scoring
* 2-Factor Authentication
* Full audit logs

---

 🎨  14. UI Screenshots (Placeholders) 

Add screenshots here:

* Login Page
* Admin Dashboard
* Leads List
* CSV Upload
* Appointments
* Agent Dashboard

---

 🔁  15. Workflow Diagrams 

Add diagrams for:

* CSV Upload Flow
* Backend Routing Flow

---

 🏁  16. Conclusion 

This Lead & Appointment Management System is a scalable, secure, and user-friendly MERN application designed for teams who want efficient lead distribution, appointment scheduling, and real-time coordination.
