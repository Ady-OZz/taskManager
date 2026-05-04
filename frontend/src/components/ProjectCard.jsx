import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchProjectStats } from "../api/projects";

const ProjectCard = ({ project }) => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await fetchProjectStats(project._id);
        setStats(res.data);
      } catch (err) {
        setStats(null);
      }
    };
    loadStats();
  }, [project._id]);

  return (
    <Link
      to={`/projects/${project._id}`}
      className="block bg-white rounded-lg border border-border p-5 hover:border-accent/30 transition-colors"
      id={`project-card-${project._id}`}
    >
      <h3 className="text-sm font-medium text-text-primary truncate">
        {project.name}
      </h3>
      {project.description && (
        <p className="text-xs text-text-secondary mt-1 line-clamp-2">
          {project.description}
        </p>
      )}

      <div className="flex items-center gap-4 mt-3 text-xs text-text-secondary">
        <span>{project.members?.length || 0} members</span>
        {stats && <span>{stats.total} tasks</span>}
      </div>

      <div className="mt-3">
        {stats === null ? (
          <div className="text-xs text-text-tertiary">Loading...</div>
        ) : stats.total === 0 ? (
          <div className="text-xs text-text-tertiary">No tasks yet</div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-text-secondary">Progress</span>
              <span className="text-xs font-medium text-text-primary">
                {stats.completionPercent}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-page rounded-full overflow-hidden">
              <div
                className="h-full bg-accent rounded-full transition-all duration-300"
                style={{ width: `${stats.completionPercent}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </Link>
  );
};

export default ProjectCard;
