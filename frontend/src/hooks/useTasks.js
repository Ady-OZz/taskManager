import { useState, useEffect, useCallback } from "react";
import { fetchTasks } from "../api/tasks";

const useTasks = (params = {}) => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchTasks(params);
      setTasks(res.data.tasks);
    } catch (err) {
      setError(err.response?.data?.error?.message || "Failed to load tasks");
    } finally {
      setIsLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => {
    load();
  }, [load]);

  return { tasks, isLoading, error, refetch: load };
};

export default useTasks;
