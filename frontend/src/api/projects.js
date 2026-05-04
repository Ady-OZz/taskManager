import axiosInstance from "./axiosInstance";

export const fetchProjects = () => axiosInstance.get("/projects");

export const createProject = (data) => axiosInstance.post("/projects", data);

export const fetchProject = (id) => axiosInstance.get(`/projects/${id}`);

export const updateProject = (id, data) => axiosInstance.put(`/projects/${id}`, data);

export const deleteProject = (id) => axiosInstance.delete(`/projects/${id}`);

export const addProjectMember = (id, email) =>
  axiosInstance.post(`/projects/${id}/members`, { email });

export const removeProjectMember = (projectId, userId) =>
  axiosInstance.delete(`/projects/${projectId}/members/${userId}`);

export const fetchProjectStats = (id) => axiosInstance.get(`/projects/${id}/stats`);
