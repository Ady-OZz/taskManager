import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { fetchProject, fetchProjectStats, addProjectMember, removeProjectMember } from "../api/projects";
import { fetchTasks, createTask, updateTask, deleteTask } from "../api/tasks";
import TaskCard from "../components/TaskCard";
import StatusBadge from "../components/StatusBadge";
import { PlusIcon, XMarkIcon, UserMinusIcon } from "@heroicons/react/24/outline";

const ProjectDetail = () => {
  const { id } = useParams();
  const { isAdmin, profile } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [memberEmail, setMemberEmail] = useState("");
  const [memberError, setMemberError] = useState("");
  const [taskForm, setTaskForm] = useState({ title: "", description: "", assignedTo: "", priority: "medium", dueDate: "" });
  const [taskFormError, setTaskFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    try {
      const [projRes, tasksRes, statsRes] = await Promise.all([
        fetchProject(id),
        fetchTasks({ project: id }),
        fetchProjectStats(id),
      ]);
      setProject(projRes.data.project);
      setTasks(tasksRes.data.tasks);
      setStats(statsRes.data);
    } catch (err) {
      setError(err.response?.data?.error?.message || "Failed to load project");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [id]);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTask(taskId, { status: newStatus });
      loadData();
    } catch { /* handled */ }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
      loadData();
    } catch { /* handled */ }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setTaskFormError("");
    if (!taskForm.title.trim()) { setTaskFormError("Title is required"); return; }
    setSubmitting(true);
    try {
      const data = { title: taskForm.title.trim(), description: taskForm.description.trim(), project: id, priority: taskForm.priority };
      if (taskForm.assignedTo) data.assignedTo = taskForm.assignedTo;
      if (taskForm.dueDate) data.dueDate = new Date(taskForm.dueDate).toISOString();
      await createTask(data);
      setTaskForm({ title: "", description: "", assignedTo: "", priority: "medium", dueDate: "" });
      setShowTaskForm(false);
      loadData();
    } catch (err) {
      const errors = err.response?.data?.errors;
      setTaskFormError(errors?.[0]?.message || err.response?.data?.error?.message || "Failed to create task");
    } finally { setSubmitting(false); }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    setMemberError("");
    if (!memberEmail.trim()) return;
    try {
      await addProjectMember(id, memberEmail.trim());
      setMemberEmail("");
      loadData();
    } catch (err) {
      setMemberError(err.response?.data?.error?.message || err.response?.data?.errors?.[0]?.message || "Failed to add member");
    }
  };

  const handleRemoveMember = async (userId) => {
    try {
      await removeProjectMember(id, userId);
      loadData();
    } catch { /* handled */ }
  };

  if (loading) return <div className="text-sm text-text-secondary">Loading...</div>;
  if (error) return <div className="text-sm text-danger">{error}</div>;
  if (!project) return <div className="text-sm text-text-secondary">Project not found</div>;

  const filteredTasks = statusFilter === "all" ? tasks : tasks.filter((t) => t.status === statusFilter);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-text-primary">{project.name}</h2>
        {project.description && <p className="text-sm text-text-secondary mt-1">{project.description}</p>}
      </div>

      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {[
            { label: "Total", value: stats.total },
            { label: "Todo", value: stats.todo },
            { label: "In Progress", value: stats.in_progress },
            { label: "Done", value: stats.done },
            { label: "Completion", value: `${stats.completionPercent}%` },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-lg border border-border p-4 text-center">
              <p className="text-xs text-text-secondary">{s.label}</p>
              <p className="text-lg font-semibold text-text-primary mt-0.5">{s.value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-text-primary">Tasks</span>
              <div className="flex gap-1">
                {["all", "todo", "in_progress", "done"].map((s) => (
                  <button key={s} onClick={() => setStatusFilter(s)}
                    className={`h-7 px-3 rounded-md text-xs font-medium transition-colors ${statusFilter === s ? "bg-accent text-white" : "bg-white border border-border text-text-primary hover:bg-page"}`}
                    id={`filter-${s}`}>{s === "all" ? "All" : s === "in_progress" ? "In Progress" : s.charAt(0).toUpperCase() + s.slice(1)}</button>
                ))}
              </div>
            </div>
            {isAdmin && (
              <button onClick={() => setShowTaskForm(!showTaskForm)}
                className="flex items-center gap-1 h-9 px-4 bg-accent text-white rounded-md text-sm font-medium hover:bg-accent-hover transition-colors"
                id="add-task-btn">{showTaskForm ? <><XMarkIcon className="w-4 h-4" />Cancel</> : <><PlusIcon className="w-4 h-4" />Add Task</>}</button>
            )}
          </div>

          {showTaskForm && (
            <div className="bg-white rounded-lg border border-border p-5">
              {taskFormError && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-danger">{taskFormError}</div>}
              <form onSubmit={handleCreateTask} className="space-y-4">
                <div>
                  <label htmlFor="task-title" className="block text-sm font-medium text-text-primary mb-1.5">Title</label>
                  <input id="task-title" type="text" value={taskForm.title} onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })} required
                    className="w-full h-9 border border-border rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent" />
                </div>
                <div>
                  <label htmlFor="task-desc" className="block text-sm font-medium text-text-primary mb-1.5">Description</label>
                  <textarea id="task-desc" value={taskForm.description} onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })} rows={2}
                    className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-none" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="task-assignee" className="block text-sm font-medium text-text-primary mb-1.5">Assign To</label>
                    <select id="task-assignee" value={taskForm.assignedTo} onChange={(e) => setTaskForm({ ...taskForm, assignedTo: e.target.value })}
                      className="w-full h-9 border border-border rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent">
                      <option value="">Unassigned</option>
                      {project.members?.map((m) => <option key={m._id} value={m._id}>{m.displayName}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="task-priority" className="block text-sm font-medium text-text-primary mb-1.5">Priority</label>
                    <select id="task-priority" value={taskForm.priority} onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                      className="w-full h-9 border border-border rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent">
                      <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="task-due" className="block text-sm font-medium text-text-primary mb-1.5">Due Date</label>
                    <input id="task-due" type="date" value={taskForm.dueDate} onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                      className="w-full h-9 border border-border rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent" />
                  </div>
                </div>
                <button type="submit" disabled={submitting}
                  className="h-9 px-4 bg-accent text-white rounded-md text-sm font-medium hover:bg-accent-hover transition-colors disabled:opacity-50"
                  id="create-task-submit">{submitting ? "Creating..." : "Create Task"}</button>
              </form>
            </div>
          )}

          {filteredTasks.length === 0 ? (
            <div className="bg-white rounded-lg border border-border p-8 text-center">
              <p className="text-sm text-text-secondary">No tasks {statusFilter !== "all" ? `with status "${statusFilter}"` : "yet"}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTasks.map((task) => (
                <TaskCard key={task._id} task={task} onStatusChange={handleStatusChange} onDelete={handleDeleteTask} isAdmin={isAdmin} />
              ))}
            </div>
          )}
        </div>

        <div className="w-full lg:w-72 space-y-4">
          <div className="bg-white rounded-lg border border-border p-5">
            <h3 className="text-sm font-medium text-text-primary mb-3">Members ({project.members?.length || 0})</h3>
            <div className="space-y-2">
              {project.members?.map((member) => (
                <div key={member._id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-text-primary">{member.displayName}</p>
                    <p className="text-xs text-text-tertiary">{member.email}</p>
                  </div>
                  {isAdmin && member._id !== project.createdBy._id && (
                    <button onClick={() => handleRemoveMember(member._id)}
                      className="text-text-tertiary hover:text-danger transition-colors" id={`remove-member-${member._id}`}>
                      <UserMinusIcon className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {isAdmin && (
              <form onSubmit={handleAddMember} className="mt-4 pt-4 border-t border-border">
                <label htmlFor="member-email" className="block text-xs font-medium text-text-secondary mb-1.5">Add Member</label>
                {memberError && <p className="text-xs text-danger mb-2">{memberError}</p>}
                <div className="flex gap-2">
                  <input id="member-email" type="email" value={memberEmail} onChange={(e) => setMemberEmail(e.target.value)} placeholder="user@example.com"
                    className="flex-1 h-9 border border-border rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent" />
                  <button type="submit"
                    className="h-9 px-3 bg-accent text-white rounded-md text-sm font-medium hover:bg-accent-hover transition-colors"
                    id="add-member-submit">Add</button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
