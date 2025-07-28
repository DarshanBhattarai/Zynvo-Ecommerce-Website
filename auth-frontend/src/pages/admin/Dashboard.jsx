import React, { useState, useEffect, useContext } from "react";
import {
  LogOut,
  LayoutDashboard,
  Users,
  Bell,
  MoreVertical,
  Crown,
  Shield,
  User,
} from "lucide-react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const sidebarItems = [
  { label: "Overview", icon: <LayoutDashboard size={18} /> },
];

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [adminUser, setAdminUser] = useState(null);
  const [regularUsers, setRegularUsers] = useState([]);
  const [activeMenu, setActiveMenu] = useState("Overview");
  const [filteredUsers, setFilteredUsers] = useState([]);

  const { auth, logout } = useContext(AuthContext);
  const token = auth?.token;
  const Role = auth?.user?.role || "user";
  console.log("Role:", Role);
  console.log("Dashboard auth:", auth);
  console.log("Dashboard token:", token);

  if (!auth) {
    return <p>Loading...</p>;
  }

  useEffect(() => {
    // Separate admin and regular users after users state updates
    const admin = users.find((user) => (user.role || "user") === "admin");
    const nonAdminUsers = users.filter(
      (user) => (user.role || "user") !== "admin"
    );

    setAdminUser(admin);
    setRegularUsers(nonAdminUsers);
    setFilteredUsers(nonAdminUsers);
  }, [users]);

  useEffect(() => {
    if (!token) {
      console.error("No token found, cannot fetch users.");
    }

    const fetchUsers = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/users", {
          withCredentials: true,
        });

        console.log("Fetched users:", data.users);
        setUsers(data.users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [token]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await axios.patch(
        "http://localhost:5000/api/users/update-role",
        { userId, role: newRole },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      setUsers((prev) =>
        prev.map((user) =>
          user._id === userId ? { ...user, role: newRole } : user
        )
      );
    } catch (error) {
      console.error("Failed to update role", error);
    }
  };

  const handleActionClick = (userId) => {
    console.log("Action button clicked for user:", userId);
    // Implement your additional action logic here
  };

  const getRoleIcon = (role) => {
    const userRole = role || "user";
    switch (userRole) {
      case "admin":
        return <Crown size={16} className="text-purple-600" />;
      case "moderator":
        return <Shield size={16} className="text-blue-600" />;
      default:
        return <User size={16} className="text-gray-500" />;
    }
  };

  const getRoleBadgeColor = (role) => {
    const userRole = role || "user";
    switch (userRole) {
      case "admin":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "moderator":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const stats = [
    {
      label: "Total Users",
      value: users.length,
      color: "bg-blue-50 border-blue-200",
    },
    {
      label: "Admins",
      value: adminUser ? 1 : 0,
      color: "bg-purple-50 border-purple-200",
    },
    {
      label: "Moderators",
      value: regularUsers.filter((u) => (u.role || "user") === "moderator")
        .length,
      color: "bg-green-50 border-green-200",
    },
    {
      label: "Regular Users",
      value: regularUsers.filter((u) => (u.role || "user") === "user").length,
      color: "bg-gray-50 border-gray-200",
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 shadow-sm flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <LayoutDashboard size={16} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                Admin Panel
              </h1>
              <p className="text-xs text-gray-500">Management System</p>
            </div>
          </div>
        </div>

        <nav className="flex flex-col gap-1 p-4 flex-grow">
          {sidebarItems.map((item) => (
            <button
              key={item.label}
              onClick={() => setActiveMenu(item.label)}
              className={`flex items-center gap-3 p-3 text-sm rounded-lg transition-all duration-200 ${
                activeMenu === item.label
                  ? "bg-blue-50 text-blue-700 border border-blue-200 shadow-sm"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 w-full bg-gray-900 hover:bg-gray-800 text-white text-sm rounded-lg transition-colors duration-200"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                {activeMenu}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage your application users and permissions
              </p>
            </div>

            <div className="flex items-center gap-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell size={20} />
              </button>

              <div className="w-px h-6 bg-gray-300"></div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {adminUser?.name || "Admin"}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {adminUser?.role || "Administrator"}
                  </p>
                </div>
                <div className="relative">
                  <img
                    src={adminUser?.image || "/api/placeholder/40/40"}
                    className="w-10 h-10 rounded-full border-2 border-gray-200 object-cover"
                    alt="admin avatar"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-8 overflow-auto">
          {activeMenu === "Overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className={`p-6 rounded-lg border ${stat.color}`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          {stat.label}
                        </p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">
                          {stat.value}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                        <Users size={24} className="text-gray-600" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Regular Users Table */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mt-5">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">
                    User Management
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {filteredUsers.length} users found (excluding admin)
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Options
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                          <tr
                            key={user._id}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-3">
                                <img
                                  src={user.image || "/api/placeholder/32/32"}
                                  className="w-8 h-8 rounded-full object-cover"
                                  alt={user.name}
                                />
                                <div>
                                  <p className="text-sm font-medium text-gray-900">
                                    {user.name}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <p className="text-sm text-gray-600">
                                {user.email}
                              </p>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(
                                  user.role
                                )}`}
                              >
                                {getRoleIcon(user.role)}
                                {(user.role || "user").charAt(0).toUpperCase() +
                                  (user.role || "user").slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <select
                                value={user.role || "user"}
                                onChange={(e) =>
                                  handleRoleChange(user._id, e.target.value)
                                }
                                className="border border-gray-300 px-3 py-2 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                disabled={(user.role || "user") === "admin"}
                              >
                                <option value="user">User</option>
                                <option value="moderator">Moderator</option>
                              </select>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <button
                                onClick={() => handleActionClick(user._id)}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                              >
                                <MoreVertical size={16} />
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="px-6 py-12 text-center">
                            <div className="flex flex-col items-center gap-2">
                              <Users size={48} className="text-gray-300" />
                              <p className="text-gray-500 font-medium">
                                No users found
                              </p>
                              <p className="text-sm text-gray-400">
                                Try adjusting your search criteria
                              </p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
