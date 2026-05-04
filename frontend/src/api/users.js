import axiosInstance from "./axiosInstance";

export const fetchUsers = () => axiosInstance.get("/users");

export const updateUserRole = (id, role) =>
  axiosInstance.put(`/users/${id}/role`, { role });
