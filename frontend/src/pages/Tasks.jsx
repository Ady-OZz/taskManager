import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import useTasks from "../hooks/useTasks";
import useProjects from "../hooks/useProjects";
import TaskCard from "../components/TaskCard";
import { updateTask, deleteTask } from "../api/tasks";

const Tasks = () => {
  const { isAdmin } = useAuth();
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [projectFilter, setProjectFilter] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");

  const params = {};
  if (statusFilter) params.status = statusFilter;
  if (priorityFilter) params.priority = priorityFilter;
  if (projectFilter) params.project = projectFilter;
  params.sortBy = sortBy;
  params.sortOrder = sortBy === "dueDate" ? "asc" : "desc";

  const { tasks, isLoading, error, refetch } = useTasks(params);
  const { projects } = useProjects();

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTask(taskId, { status: newStatus });
      refetch();
    } catch { /* handled */ }
  };

  const handleDelete = async (taskId) => {
    try {
      await deleteTask(taskId);
      refetch();
    } catch { /* handled */ }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="h-9 border border-border rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
          id="task-filter-status">
          <option value="">All Statuses</option>
          <option value="todo">Todo</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>

        <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}
          className="h-9 border border-border rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
          id="task-filter-priority">
          <option value="">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <select value={projectFilter} onChange={(e) => setProjectFilter(e.target.value)}
          className="h-9 border border-border rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
          id="task-filter-project">
          <option value="">All Projects</option>
          {projects.map((p) => (
            <option key={p._id} value={p._id}>{p.name}</option>
          ))}
        </select>

        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
          className="h-9 border border-border rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
          id="task-sort">
          <option value="createdAt">Newest First</option>
          <option value="dueDate">Due Date</option>
          <option value="priority">Priority</option>
        </select>
      </div>

      {isLoading ? (
        <div className="text-sm text-text-secondary">Loading tasks...</div>
      ) : error ? (
        <div className="text-sm text-danger">{error}</div>
      ) : tasks.length === 0 ? (
        <div className="bg-white rounded-lg border border-border p-8 text-center">
          <p className="text-sm text-text-secondary">No tasks found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <TaskCard key={task._id} task={task} onStatusChange={handleStatusChange} onDelete={handleDelete} isAdmin={isAdmin} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Tasks;
