import StatusBadge from "./StatusBadge";
import PriorityBadge from "./PriorityBadge";
import DeadlineAlert from "./DeadlineAlert";
import { formatDate } from "../utils/dateHelpers";

const TaskCard = ({ task, onStatusChange, onDelete, isAdmin }) => {
  const handleStatusChange = (e) => {
    if (onStatusChange) {
      onStatusChange(task._id, e.target.value);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-border p-5" id={`task-card-${task._id}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-text-primary truncate">
            {task.title}
          </h3>
          {task.description && (
            <p className="text-xs text-text-secondary mt-1 line-clamp-2">
              {task.description}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <PriorityBadge priority={task.priority} />
          <StatusBadge status={task.status} />
          <DeadlineAlert dueDate={task.dueDate} status={task.status} />
        </div>
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
        <div className="flex items-center gap-4 text-xs text-text-secondary">
          {task.assignedTo && (
            <span>Assigned to: {task.assignedTo.displayName}</span>
          )}
          {task.dueDate && <span>Due: {formatDate(task.dueDate)}</span>}
          {task.project?.name && <span>{task.project.name}</span>}
        </div>

        <div className="flex items-center gap-2">
          <select
            value={task.status}
            onChange={handleStatusChange}
            className="h-7 border border-border rounded-md px-2 text-xs focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            id={`task-status-select-${task._id}`}
          >
            <option value="todo">Todo</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>

          {isAdmin && onDelete && (
            <button
              onClick={() => onDelete(task._id)}
              className="h-7 px-2 text-xs font-medium text-danger hover:bg-red-50 rounded-md transition-colors"
              id={`task-delete-btn-${task._id}`}
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
