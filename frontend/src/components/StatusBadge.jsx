const statusConfig = {
  todo: {
    label: "Todo",
    bg: "bg-status-todo-bg",
    text: "text-status-todo-text",
  },
  in_progress: {
    label: "In Progress",
    bg: "bg-status-progress-bg",
    text: "text-status-progress-text",
  },
  done: {
    label: "Done",
    bg: "bg-status-done-bg",
    text: "text-status-done-text",
  },
};

const StatusBadge = ({ status }) => {
  const config = statusConfig[status] || statusConfig.todo;

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.bg} ${config.text}`}
    >
      {config.label}
    </span>
  );
};

export default StatusBadge;
