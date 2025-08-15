import React from 'react';
import { LayoutDashboard, Users, TrendingUp, Settings, UserCircle, LogOut } from 'lucide-react';

const sidebarItems = [
  { label: "Overview", icon: <LayoutDashboard size={18} /> },
  { label: "Users", icon: <Users size={18} /> },
  { label: "Analytics", icon: <TrendingUp size={18} /> },
  { label: "Settings", icon: <Settings size={18} /> },
];

const Sidebar = ({ auth, logout, activeMenu, setActiveMenu, isSidebarOpen }) => {
  return (
    <aside
      className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 transition-transform duration-300 ease-in-out z-30 flex flex-col`}
    >
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
            <LayoutDashboard size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">AdminHub</h1>
            <p className="text-xs text-gray-500 font-medium">
              Enterprise Console
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-1">
          {sidebarItems.map((item) => (
            <button
              key={item.label}
              onClick={() => setActiveMenu(item.label)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-lg transition-all duration-200 ${
                activeMenu === item.label
                  ? "bg-indigo-600 text-white"
                  : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      </nav>

      <div className="p-4 border-t border-gray-200 mt-auto">
        {auth?.user?.name && auth?.user?.email && (
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-2">
            <UserCircle className="text-gray-600" size={28} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {auth.user.name}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {auth.user.email}
              </p>
            </div>
          </div>
        )}
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-colors duration-200"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;