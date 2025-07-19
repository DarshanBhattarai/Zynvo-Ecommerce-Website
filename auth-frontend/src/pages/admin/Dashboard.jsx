import React, { useState, useEffect } from "react";

const sidebarItems = [
  { label: "Dashboard", icon: "📊" },
  { label: "Users", icon: "👥" },
  { label: "Reports", icon: "📈" },
  { label: "Settings", icon: "⚙️" },
];

const Dashboard = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [activeMenu, setActiveMenu] = useState("Dashboard");

  useEffect(() => {
    const data = localStorage.getItem("user-info");
    if (data) {
      setUserInfo(JSON.parse(data).user || JSON.parse(data));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user-info");
    window.location.href = "/login"; // or use react-router navigate
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-indigo-900 text-white flex flex-col">
        <div className="p-6 text-2xl font-bold border-b border-indigo-700">
          Admin Panel
        </div>
        <nav className="flex-grow">
          {sidebarItems.map((item) => (
            <button
              key={item.label}
              className={`flex items-center gap-3 px-6 py-3 w-full text-left hover:bg-indigo-700 transition ${
                activeMenu === item.label ? "bg-indigo-700 font-semibold" : ""
              }`}
              onClick={() => setActiveMenu(item.label)}
            >
              <span>{item.icon}</span> {item.label}
            </button>
          ))}
        </nav>
        <button
          onClick={handleLogout}
          className="m-6 p-3 bg-red-600 hover:bg-red-700 rounded-md font-semibold"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-8">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {userInfo?.name || "Admin"}</h1>
          <div className="flex items-center gap-4">
            <img
              src={userInfo?.image || "/default-avatar.png"}
              alt="Avatar"
              className="w-12 h-12 rounded-full border-2 border-indigo-600 object-cover"
            />
          </div>
        </header>

        {/* Dashboard Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-700 text-lg font-semibold mb-2">Total Users</h3>
            <p className="text-indigo-600 text-3xl font-bold">1,234</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-700 text-lg font-semibold mb-2">Active Sessions</h3>
            <p className="text-indigo-600 text-3xl font-bold">56</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-700 text-lg font-semibold mb-2">Pending Requests</h3>
            <p className="text-indigo-600 text-3xl font-bold">12</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-700 text-lg font-semibold mb-2">Revenue</h3>
            <p className="text-indigo-600 text-3xl font-bold">$34,567</p>
          </div>
        </section>

        {/* Placeholder for more content */}
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
          <p className="text-gray-600">Coming soon...</p>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
