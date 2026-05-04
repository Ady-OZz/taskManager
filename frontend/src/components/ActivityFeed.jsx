import { timeAgo } from "../utils/dateHelpers";

const ActivityFeed = ({ logs, showProject = true }) => {
  if (!logs || logs.length === 0) {
    return (
      <p className="text-sm text-text-tertiary">No recent activity</p>
    );
  }

  return (
    <div className="space-y-3">
      {logs.map((log) => (
        <div
          key={log._id}
          className="flex items-start gap-3 text-sm"
          id={`activity-item-${log._id}`}
        >
          <div className="w-2 h-2 mt-1.5 rounded-full bg-accent flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-text-primary">{log.action}</p>
            <div className="flex items-center gap-2 mt-0.5 text-xs text-text-tertiary">
              <span>by {log.performedBy?.displayName || "Unknown"}</span>
              {showProject && log.project?.name && (
                <>
                  <span>in {log.project.name}</span>
                </>
              )}
              <span>{timeAgo(log.createdAt)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivityFeed;
