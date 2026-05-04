import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import useProjects from "../hooks/useProjects";
import useActivity from "../hooks/useActivity";
import { fetchTasks } from "../api/tasks";
import { fetchProjectStats } from "../api/projects";
import { isOverdue, isDueSoon } from "../utils/dateHelpers";
import ActivityFeed from "../components/ActivityFeed";
import TaskCard from "../components/TaskCard";
import { updateTask } from "../api/tasks";
import {
  FolderIcon,
  ClipboardDocumentListIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

const Dashboard = () => {
  const { profile, isAdmin } = useAuth();
  const { projects } = useProjects();
  const { logs } = useActivity({ limit: 20 });
  const [allTasks, setAllTasks] = useState([]);
  const [projectStats, setProjectStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const tasksRes = await fetchTasks();
        setAllTasks(tasksRes.data.tasks);

        const statsPromises = projects.map(async (p) => {
          try {
            const res = await fetchProjectStats(p._id);
            return { id: p._id, stats: res.data };
          } catch {
            return { id: p._id, stats: null };
          }
        });

        const statsResults = await Promise.all(statsPromises);
        const statsMap = {};
        statsResults.forEach(({ id, stats }) => {
          statsMap[id] = stats;
        });
        setProjectStats(statsMap);
      } catch {
        // errors handled by individual hooks
      } finally {
        setLoading(false);
      }
    };

    if (projects.length > 0) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [projects]);

  const myOpenTasks = allTasks.filter(
    (t) => t.assignedTo?._id === profile?._id && t.status !== "done"
  );

  const overdueTasks = allTasks.filter((t) => isOverdue(t.dueDate, t.status));

  const needsAttention = allTasks.filter(
    (t) =>
      t.assignedTo?._id === profile?._id &&
      (isOverdue(t.dueDate, t.status) || isDueSoon(t.dueDate, t.status))
  );

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTask(taskId, { status: newStatus });
      const tasksRes = await fetchTasks();
      setAllTasks(tasksRes.data.tasks);
    } catch {
      // error handled silently
    }
  };

  const metricCards = [
    {
      label: "Total Projects",
      value: projects.length,
      icon: FolderIcon,
      color: "text-accent",
    },
    {
      label: "Total Tasks",
      value: allTasks.length,
      icon: ClipboardDocumentListIcon,
      color: "text-accent",
    },
    {
      label: "My Open Tasks",
      value: myOpenTasks.length,
      icon: CheckCircleIcon,
      color: "text-status-progress-text",
    },
    {
      label: "Overdue Tasks",
      value: overdueTasks.length,
      icon: ExclamationCircleIcon,
      color: "text-danger",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-lg border border-border p-5"
            id={`metric-${card.label.toLowerCase().replace(/\s+/g, "-")}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-text-secondary font-medium">
                  {card.label}
                </p>
                <p className="text-2xl font-semibold text-text-primary mt-1">
                  {loading ? "-" : card.value}
                </p>
              </div>
              <card.icon className={`w-8 h-8 ${card.color} opacity-60`} />
            </div>
          </div>
        ))}
      </div>

      {needsAttention.length > 0 && (
        <div>
          <h2 className="text-base font-medium text-text-primary mb-3">
            Needs Attention
          </h2>
          <div className="space-y-3">
            {needsAttention.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onStatusChange={handleStatusChange}
                isAdmin={isAdmin}
              />
            ))}
          </div>
        </div>
      )}

      {projects.length > 0 && (
        <div>
          <h2 className="text-base font-medium text-text-primary mb-3">
            Project Progress
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => {
              const stats = projectStats[project._id];
              return (
                <div
                  key={project._id}
                  className="bg-white rounded-lg border border-border p-5"
                >
                  <h3 className="text-sm font-medium text-text-primary truncate">
                    {project.name}
                  </h3>
                  <p className="text-xs text-text-secondary mt-1">
                    {project.members?.length || 0} members
                  </p>
                  <div className="mt-3">
                    {!stats ? (
                      <div className="text-xs text-text-tertiary">Loading...</div>
                    ) : stats.total === 0 ? (
                      <div className="text-xs text-text-tertiary">No tasks yet</div>
                    ) : (
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-text-secondary">
                            {stats.done}/{stats.total} done
                          </span>
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
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-base font-medium text-text-primary mb-3">
          Recent Activity
        </h2>
        <div className="bg-white rounded-lg border border-border p-5">
          <ActivityFeed logs={logs} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
