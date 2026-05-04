import { NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  Squares2X2Icon,
  FolderIcon,
  ClipboardDocumentListIcon,
  UsersIcon,
  ClockIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: Squares2X2Icon },
  { to: "/projects", label: "Projects", icon: FolderIcon },
  { to: "/tasks", label: "Tasks", icon: ClipboardDocumentListIcon },
  { to: "/activity", label: "Activity", icon: ClockIcon },
];

const adminItems = [
  { to: "/team", label: "Team Members", icon: UsersIcon },
];

const Sidebar = ({ isOpen, onClose }) => {
  const { isAdmin } = useAuth();

  const linkClasses = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? "bg-white/10 text-sidebar-active"
        : "text-sidebar-inactive hover:bg-white/5 hover:text-sidebar-active"
    }`;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-sidebar bg-sidebar z-50 flex flex-col transition-transform duration-200 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between h-navbar px-5 border-b border-white/10">
          <span className="text-white text-lg font-semibold">Taskboard</span>
          <button
            onClick={onClose}
            className="text-sidebar-inactive hover:text-white lg:hidden"
            id="close-sidebar-btn"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={linkClasses}
              onClick={onClose}
              id={`nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ))}

          {isAdmin &&
            adminItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={linkClasses}
                onClick={onClose}
                id={`nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </NavLink>
            ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
