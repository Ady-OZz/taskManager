import { useState, useEffect, useCallback } from "react";
import { fetchActivityLogs } from "../api/activity";

const useActivity = (params = {}) => {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchActivityLogs(params);
      setLogs(res.data.logs);
    } catch (err) {
      setError(err.response?.data?.error?.message || "Failed to load activity");
    } finally {
      setIsLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => {
    load();
  }, [load]);

  return { logs, isLoading, error, refetch: load };
};

export default useActivity;
