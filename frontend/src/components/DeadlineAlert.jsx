import { isOverdue, isDueSoon } from "../utils/dateHelpers";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

const DeadlineAlert = ({ dueDate, status }) => {
  if (isOverdue(dueDate, status)) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium bg-red-50 text-danger">
        <ExclamationTriangleIcon className="w-3 h-3" />
        Overdue
      </span>
    );
  }

  if (isDueSoon(dueDate, status)) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium bg-amber-50 text-priority-medium">
        <ExclamationTriangleIcon className="w-3 h-3" />
        Due Soon
      </span>
    );
  }

  return null;
};

export default DeadlineAlert;
