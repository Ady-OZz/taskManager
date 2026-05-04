import axiosInstance from "./axiosInstance";

export const fetchActivityLogs = (params = {}) =>
  axiosInstance.get("/activity", { params });
