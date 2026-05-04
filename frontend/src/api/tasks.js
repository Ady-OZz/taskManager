import axiosInstance from "./axiosInstance";

export const fetchTasks = (params = {}) => axiosInstance.get("/tasks", { params });

export const createTask = (data) => axiosInstance.post("/tasks", data);

export const fetchTask = (id) => axiosInstance.get(`/tasks/${id}`);

export const updateTask = (id, data) => axiosInstance.put(`/tasks/${id}`, data);

export const deleteTask = (id) => axiosInstance.delete(`/tasks/${id}`);
