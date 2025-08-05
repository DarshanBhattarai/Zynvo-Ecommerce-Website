import React, { useState, useEffect, useContext } from "react";
import {
  LayoutDashboard,
  Users,
  Settings,
  Bell,
  UserCircle,
  LogOut,
} from "lucide-react";
import { AuthContext } from "../../context/AuthContext";

const sidebarItems = [
  { label: "Overview", icon: <LayoutDashboard size={18} /> },
  { label: "Users", icon: <Users size={18} /> },
  { label: "Settings", icon: <Settings size={18} /> },
];

const ModeratorDashboard = () => {
  const [activeMenu, setActiveMenu] = useState("Overview");
  const { auth, logout } = useContext(AuthContext);

  if (!auth) {
    return <p>Loading...</p>; // or a spinner or a loading message
  }


  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-6">Moderator Panel</h2>
        <nav className="flex flex-col gap-2">
          {sidebarItems.map((item) => (
            <button
              key={item.label}
              onClick={() => setActiveMenu(item.label)}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                activeMenu === item.label
                  ? "bg-gray-200 text-gray-900 font-semibold"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">{activeMenu}</h1>
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell size={20} />
            </button>

            {/* User Profile */}
            {auth.user.name && auth.user.email && (
              <div className="flex items-center gap-3 bg-gray-100 px-3 py-2 rounded-lg">
                <UserCircle className="text-gray-600" size={24} />
                <div className="text-sm">
                  <p className="text-gray-900 font-medium">
                    {auth.user.name}
                  </p>
                  <p className="text-gray-500 text-xs">{auth.user.email}</p>
                </div>
              </div>
            )}
            {/* Logout Button */}
            <button
              onClick={logout}
              className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <LogOut size={18} />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </header>

        {/* Page content */}
        <section className="mt-6">
          {activeMenu === "Overview" && (
            <p>Welcome to the Moderator Overview.</p>
          )}
          {activeMenu === "Users" && <p>Manage users from this section.</p>}
          {activeMenu === "Settings" && <p>Moderator settings page.</p>}
        </section>
      </main>
    </div>
  );
};

export default ModeratorDashboard;
