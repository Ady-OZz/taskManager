import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const pageTitles = {
  "/dashboard": "Dashboard",
  "/projects": "Projects",
  "/tasks": "Tasks",
  "/team": "Team Members",
  "/activity": "Activity Log",
};

const AppShell = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const getTitle = () => {
    if (location.pathname.startsWith("/projects/")) return "Project Detail";
    return pageTitles[location.pathname] || "Taskboard";
  };

  return (
    <div className="min-h-screen bg-page">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Navbar title={getTitle()} onMenuClick={() => setSidebarOpen(true)} />

      <main className="lg:ml-sidebar mt-navbar px-8 py-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AppShell;
