import { useState } from "react";
import useActivity from "../hooks/useActivity";
import useProjects from "../hooks/useProjects";
import ActivityFeed from "../components/ActivityFeed";

const ActivityLog = () => {
  const [projectFilter, setProjectFilter] = useState("");
  const params = {};
  if (projectFilter) params.project = projectFilter;

  const { logs, isLoading, error } = useActivity(params);
  const { projects } = useProjects();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <select
          value={projectFilter}
          onChange={(e) => setProjectFilter(e.target.value)}
          className="h-9 border border-border rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
          id="activity-filter-project"
        >
          <option value="">All Projects</option>
          {projects.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="text-sm text-text-secondary">Loading activity...</div>
      ) : error ? (
        <div className="text-sm text-danger">{error}</div>
      ) : (
        <div className="bg-white rounded-lg border border-border p-5">
          <ActivityFeed logs={logs} />
        </div>
      )}
    </div>
  );
};

export default ActivityLog;
