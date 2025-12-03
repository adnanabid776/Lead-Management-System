import api from "./axios";


export const login = (credentials) => api.post("/auth/login", credentials);
export const register = (payload) => api.post("/auth/register", payload); // admin only
export const fetchMe = () => api.get("/auth/me");