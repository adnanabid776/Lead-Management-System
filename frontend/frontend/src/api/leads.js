// src/api/leads.js

import { data } from "react-router-dom";
import api from "./axios";

export const getLeads = (params) => api.get("/leads", { params }); // backend handles role filtering
export const getLead = (id) => api.get(`/leads/${id}`);
export const createLead = (data) => api.post("/leads", data);
export const updateLead = (id, data) => api.put(`/leads/${id}`, data);
export const deleteLead = (id) => api.delete(`/leads/${id}`);
export const assignLead = (id, userEmail) => api.post(`/leads/${id}/assign`, { userEmail });
export const bulkAssign = (data) => api.post("/leads/bulk-assign", data);
// export const bulkDeleteLeads = (data) => api.post("/leads/bulk-delete", data);
export const bulkDeleteLeads = (payload) =>
  api.post("/leads/bulk-delete", payload);
export const uploadLeadsCsv = (file) => {
  const formData = new FormData();
  formData.append("file", file); // file field MUST be "file"

  return api.post("/leads/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};



