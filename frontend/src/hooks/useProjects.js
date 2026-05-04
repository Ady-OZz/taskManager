import { useState, useEffect, useCallback } from "react";
import { fetchProjects, fetchProjectStats } from "../api/projects";

const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchProjects();
      setProjects(res.data.projects);
    } catch (err) {
      setError(err.response?.data?.error?.message || "Failed to load projects");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { projects, isLoading, error, refetch: load };
};

export default useProjects;
