const priorityConfig = {
  low: {
    label: "Low",
    bg: "bg-green-50",
    text: "text-priority-low",
  },
  medium: {
    label: "Medium",
    bg: "bg-amber-50",
    text: "text-priority-medium",
  },
  high: {
    label: "High",
    bg: "bg-red-50",
    text: "text-priority-high",
  },
};

const PriorityBadge = ({ priority }) => {
  const config = priorityConfig[priority] || priorityConfig.medium;

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.bg} ${config.text}`}
    >
      {config.label}
    </span>
  );
};

export default PriorityBadge;
