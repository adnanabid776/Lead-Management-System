// DUMMY DATA FOR FRONTEND ONLY - Remove when backend is integrated

// Dummy Users
export const dummyUsers = [
  {
    _id: "1",
    name: "John Admin",
    email: "admin@example.com",
    password: "admin123",
    role: "admin"
  },
  { 
    _id: "2",
    name: "Jane Manager",
    email: "manager@example.com",
    password: "manager123",
    role: "manager"
  },
  {
    _id: "3",
    name: "Bob Agent",
    email: "agent@example.com",
    password: "agent123",
    role: "agent"
  },
  {
    _id: "4",
    name: "Alice Agent",
    email: "alice@example.com",
    password: "agent123",
    role: "agent"
  }
];

// Dummy Leads
export const dummyLeads = [
  {
    _id: "lead1",
    name: "Acme Corporation",
    company: "Acme Corp",
    email: "contact@acme.com",
    phone: "+1234567890",
    source: "Website",
    status: "new",
    assignee: { _id: "3", name: "Bob Agent" },
    createdAt: new Date("2024-01-15").toISOString()
  },
  {
    _id: "lead2",
    name: "Tech Solutions Inc",
    company: "Tech Solutions",
    email: "info@techsolutions.com",
    phone: "+1234567891",
    source: "Referral",
    status: "contacted",
    assignee: { _id: "4", name: "Alice Agent" },
    createdAt: new Date("2024-01-16").toISOString()
  },
  {
    _id: "lead3",
    name: "Global Enterprises",
    company: "Global Ent",
    email: "hello@global.com",
    phone: "+1234567892",
    source: "Email Campaign",
    status: "in-progress",
    assignee: { _id: "2", name: "Jane Manager" },
    createdAt: new Date("2024-01-17").toISOString()
  },
  {
    _id: "lead4",
    name: "StartupXYZ",
    company: "XYZ Startup",
    email: "founder@xyz.com",
    phone: "+1234567893",
    source: "Social Media",
    status: "pending",
    assignee: null,
    createdAt: new Date("2024-01-18").toISOString()
  },
  {
    _id: "lead5",
    name: "Big Corp",
    company: "Big Corp Ltd",
    email: "sales@bigcorp.com",
    phone: "+1234567894",
    source: "Cold Call",
    status: "won",
    assignee: { _id: "3", name: "Bob Agent" },
    createdAt: new Date("2024-01-19").toISOString()
  },
  {
    _id: "lead6",
    name: "Small Business Co",
    company: "SmallBiz Co",
    email: "owner@smallbiz.com",
    phone: "+1234567895",
    source: "Website",
    status: "lost",
    assignee: { _id: "4", name: "Alice Agent" },
    createdAt: new Date("2024-01-20").toISOString()
  }
];

// Dummy Appointments
export const dummyAppointments = [
  {
    _id: "appt1",
    title: "Product Demo - Acme Corp",
    leadId: "lead1",
    lead: { _id: "lead1", name: "Acme Corporation" },
    date: new Date("2024-02-01T10:00:00").toISOString(),
    notes: "Initial product demonstration",
    status: "scheduled"
  },
  {
    _id: "appt2",
    title: "Follow-up Meeting - Tech Solutions",
    leadId: "lead2",
    lead: { _id: "lead2", name: "Tech Solutions Inc" },
    date: new Date("2024-02-02T14:30:00").toISOString(),
    notes: "Discuss pricing and implementation timeline",
    status: "scheduled"
  },
  {
    _id: "appt3",
    title: "Contract Review - Global Enterprises",
    leadId: "lead3",
    lead: { _id: "lead3", name: "Global Enterprises" },
    date: new Date("2024-01-25T09:00:00").toISOString(),
    notes: "Review contract terms",
    status: "done"
  },
  {
    _id: "appt4",
    title: "Initial Consultation - StartupXYZ",
    leadId: "lead4",
    lead: { _id: "lead4", name: "StartupXYZ" },
    date: new Date("2024-02-05T11:00:00").toISOString(),
    notes: "Understand their requirements",
    status: "scheduled"
  }
];

// Local storage keys
const STORAGE_KEYS = {
  LEADS: "dummy_leads",
  USERS: "dummy_users",
  APPOINTMENTS: "dummy_appointments"
};

// Initialize dummy data in localStorage if not present
export const initDummyData = () => {
  if (!localStorage.getItem(STORAGE_KEYS.LEADS)) {
    localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(dummyLeads));
  }
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(dummyUsers));
  }
  if (!localStorage.getItem(STORAGE_KEYS.APPOINTMENTS)) {
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(dummyAppointments));
  }
};

// Helper functions to get data from localStorage
export const getDummyLeads = () => {
  const data = localStorage.getItem(STORAGE_KEYS.LEADS);
  return data ? JSON.parse(data) : dummyLeads;
};

export const getDummyUsers = () => {
  const data = localStorage.getItem(STORAGE_KEYS.USERS);
  return data ? JSON.parse(data) : dummyUsers;
};

export const getDummyAppointments = () => {
  const data = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
  return data ? JSON.parse(data) : dummyAppointments;
};

// Helper functions to save data to localStorage
export const saveDummyLeads = (leads) => {
  localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(leads));
};

export const saveDummyUsers = (users) => {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

export const saveDummyAppointments = (appointments) => {
  localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
};

// Simulate API delay
export const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

