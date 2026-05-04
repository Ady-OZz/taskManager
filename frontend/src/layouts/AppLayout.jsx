import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const AppLayout = ({ title }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-page">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Navbar title={title} onMenuClick={() => setSidebarOpen(true)} />

      <main className="lg:ml-sidebar mt-navbar px-8 py-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
