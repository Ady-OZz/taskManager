import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Bars3Icon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

const Navbar = ({ title, onMenuClick }) => {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="fixed top-0 left-0 lg:left-sidebar right-0 h-navbar bg-white border-b border-border z-30 flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="text-text-secondary hover:text-text-primary lg:hidden"
          id="menu-toggle-btn"
        >
          <Bars3Icon className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-semibold text-text-primary">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm text-text-secondary hidden sm:block">
          {profile?.displayName}
        </span>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 h-9 px-3 rounded-md text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-page transition-colors"
          id="logout-btn"
        >
          <ArrowRightOnRectangleIcon className="w-4 h-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
