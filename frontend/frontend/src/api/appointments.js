// src/api/appointments.js
// import api from "./axios";
import api from './axios'

// export const getAppointments = () => api.get("/appointments");
export const createAppointment = (data) => api.post("/appointments", data);
export const updateAppointment = (id, data) => api.put(`/appointments/${id}`, data);
export const deleteAppointment = (id) => api.delete(`/appointments/${id}`);
// src/api/appointments.js

export const getAppointments = (params = {}) => {
  // if params.agentId provided, send as querystring
  return api.get("/appointments", { params });
};

