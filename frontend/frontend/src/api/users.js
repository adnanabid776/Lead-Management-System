// src/api/users.js
import api from "./axios";

export const getUsers = () => api.get("/users");
export const createUser = (data) => api.post("/users", data); // admin
export const updateUser = (id, data) => api.put(`/users/${id}`, data);
export const deleteUser = (id) => api.delete(`/users/${id}`);
export const my_agents = () => api.get(`/users/my_agents`);
export const managers = () => api.get("/users/managers");