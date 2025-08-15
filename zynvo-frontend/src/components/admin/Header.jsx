import React from "react";
import { Menu, Clock, Bell } from "lucide-react";

const Header = ({ isSidebarOpen, setIsSidebarOpen, activeMenu }) => (
  <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          <Menu size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{activeMenu}</h1>
          <p className="text-sm text-gray-500 mt-1 font-medium">
            Comprehensive user management and system administration
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock size={16} />
          <span className="font-medium">{new Date().toLocaleDateString()}</span>
        </div>
        <button className="p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg relative">
          <Bell size={20} />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-600 rounded-full border-2 border-white"></div>
        </button>
      </div>
    </div>
  </header>
);

export default Header;
