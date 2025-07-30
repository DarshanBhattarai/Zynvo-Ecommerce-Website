import React, { useState, useEffect, useContext } from "react";
import {
  LogOut,
  LayoutDashboard,
  Users,
  Bell,
  Crown,
  Shield,
  User,
  UserCircle,
  Activity,
  Settings,
  Search,
  Filter,
  Download,
  ChevronDown,
  TrendingUp, 
  Clock,
  Menu,
  Trash2,
} from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import { fetchAllUsers, updateUserRole, deleteUser } from "../../services/userApi";

const sidebarItems = [
  { label: "Overview", icon: <LayoutDashboard size={18} /> },
  { label: "Users", icon: <Users size={18} /> },
  { label: "Analytics", icon: <TrendingUp size={18} /> },
  { label: "Settings", icon: <Settings size={18} /> },
];

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [adminUser, setAdminUser] = useState(null);
  const [regularUsers, setRegularUsers] = useState([]);
  const [activeMenu, setActiveMenu] = useState("Overview");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showRoleConfirm, setShowRoleConfirm] = useState(null);

  const { auth, logout } = useContext(AuthContext);
  const token = auth?.token;
  const Role = auth?.user?.role || "user";

  if (!auth) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <span className="text-gray-700 font-semibold text-lg">
            Loading dashboard...
          </span>
        </div>
      </div>
    );
  }

  useEffect(() => {
    const admin = users.find((user) => (user.role || "user") === "admin");
    const nonAdminUsers = users.filter(
      (user) => (user.role || "user") !== "admin"
    );

    setAdminUser(admin);
    setRegularUsers(nonAdminUsers);

    let filtered = nonAdminUsers;

    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (roleFilter !== "all") {
      filtered = filtered.filter(
        (user) => (user.role || "user") === roleFilter
      );
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, roleFilter]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const users = await fetchAllUsers(token);
        setUsers(users);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateUserRole(userId, newRole, token);
      setUsers((prev) =>
        prev.map((user) =>
          user._id === userId ? { ...user, role: newRole } : user
        )
      );
      setShowRoleConfirm(null);
    } catch (error) {
      console.error("Failed to update role", error);
      alert("Failed to update role. Please try again.");
    }
  };

  const handleRoleChangeRequest = (userId, newRole) => {
    setShowRoleConfirm({ userId, newRole });
  };

  const handleDeleteUser = async (userId) => {
    try {
      await deleteUser(userId, token);
      setUsers((prev) => prev.filter((user) => user._id !== userId));
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error("Failed to delete user", error);
      alert("Failed to delete user. Please try again.");
    }
  };

  const getRoleIcon = (role) => {
    const userRole = role || "user";
    switch (userRole) {
      case "admin":
        return <Crown size={14} className="text-indigo-600" />;
      case "moderator":
        return <Shield size={14} className="text-blue-500" />;
      default:
        return <User size={14} className="text-gray-500" />;
    }
  };

  const getRoleBadgeColor = (role) => {
    const userRole = role || "user";
    switch (userRole) {
      case "admin":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "moderator":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatIcon = (index) => {
    const icons = [
      <Users size={20} className="text-indigo-600" />,
      <Crown size={20} className="text-indigo-600" />,
      <Shield size={20} className="text-blue-500" />,
      <User size={20} className="text-gray-500" />,
    ];
    return icons[index] || <Activity size={20} className="text-gray-600" />;
  };

  const stats = [
    { label: "Total Users", value: users.length, change: "+12%", trend: "up" },
    {
      label: "Administrators",
      value: adminUser ? 1 : 0,
      change: "0%",
      trend: "neutral",
    },
    {
      label: "Moderators",
      value: regularUsers.filter((u) => (u.role || "user") === "moderator")
        .length,
      change: "+8%",
      trend: "up",
    },
    {
      label: "Standard Users",
      value: regularUsers.filter((u) => (u.role || "user") === "user").length,
      change: "+15%",
      trend: "up",
    },
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="flex min-h-screen font-Inter bg-gray-100">
      {/* Sidebar */}
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
          {auth.user.name && auth.user.email && (
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

      <main className="flex-1 flex flex-col min-w-0 md:ml-64">
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
                <h1 className="text-2xl font-bold text-gray-900">
                  {activeMenu}
                </h1>
                <p className="text-sm text-gray-500 mt-1 font-medium">
                  Comprehensive user management and system administration
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock size={16} />
                <span className="font-medium">
                  {new Date().toLocaleDateString()}
                </span>
              </div>
              <button className="p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg relative">
                <Bell size={20} />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-600 rounded-full border-2 border-white"></div>
              </button>
            </div>
          </div>
        </header>

        <div className="flex-1 p-6 overflow-auto">
          {activeMenu === "Overview" && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                          {stat.label}
                        </p>
                        <div className="flex items-baseline gap-2">
                          <p className="text-3xl font-bold text-gray-900">
                            {stat.value}
                          </p>
                          <span
                            className={`text-xs font-semibold px-2 py-1 rounded ${
                              stat.trend === "up"
                                ? "text-green-600 bg-green-100"
                                : "text-gray-600 bg-gray-100"
                            }`}
                          >
                            {stat.change}
                          </span>
                        </div>
                      </div>
                      <div className="w-12 h-12 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center">
                        {getStatIcon(index)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="px-6 py-6 border-b border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        User Directory
                      </h2>
                      <p className="text-sm text-gray-500 mt-1 font-medium">
                        {filteredUsers.length} of {regularUsers.length} users
                        displayed
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors">
                        <Download size={16} />
                        Export
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="relative flex-1 max-w-md">
                      <Search
                        size={16}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="text"
                        placeholder="Search users by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      />
                    </div>
                    <div className="relative">
                      <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-sm font-semibold text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      >
                        <option value="all">All Roles</option>
                        <option value="user">Standard Users</option>
                        <option value="moderator">Moderators</option>
                      </select>
                      <ChevronDown
                        size={16}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                          User Details
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                          Contact Information
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                          Access Level
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                          Role Management
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                          Delete
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {isLoading ? (
                        <tr>
                          <td colSpan="5" className="px-6 py-20 text-center">
                            <div className="flex flex-col items-center gap-4">
                              <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                              <p className="text-gray-900 font-semibold text-lg">
                                Loading users...
                              </p>
                            </div>
                          </td>
                        </tr>
                      ) : filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                          <tr
                            key={user._id}
                            className="hover:bg-gray-50 transition-colors duration-200 group"
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gray-100 border border-gray-200 rounded-lg overflow-hidden">
                                  <img
                                    src={user.image || "/api/placeholder/48/48"}
                                    className="w-full h-full object-cover"
                                    alt={user.name}
                                  />
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-gray-900">
                                    {user.name}
                                  </p>
                                  <p className="text-xs text-gray-500 font-medium mt-1">
                                    ID: {user._id.slice(-12).toUpperCase()}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-sm font-medium text-gray-700">
                                {user.email}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                Verified Account
                              </p>
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-bold border rounded-full ${getRoleBadgeColor(
                                  user.role
                                )}`}
                              >
                                {getRoleIcon(user.role)}
                                {(user.role || "user").charAt(0).toUpperCase() +
                                  (user.role || "user").slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <select
                                value={user.role || "user"}
                                onChange={(e) =>
                                  handleRoleChangeRequest(user._id, e.target.value)
                                }
                                className="border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all min-w-[140px]"
                                disabled={(user.role || "user") === "admin"}
                              >
                                <option value="user">Standard User</option>
                                <option value="moderator">Moderator</option>
                              </select>
                            </td>
                            <td className="px-6 py-4">
                              <button
                                onClick={() => setShowDeleteConfirm(user._id)}
                                className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors group-hover:opacity-100 disabled:text-gray-300 disabled:hover:bg-transparent"
                                disabled={(user.role || "user") === "admin"}
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="px-6 py-20 text-center">
                            <div className="flex flex-col items-center gap-4">
                              <div className="w-16 h-16 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center">
                                <Users size={28} className="text-gray-400" />
                              </div>
                              <div>
                                <p className="text-gray-900 font-bold text-lg">
                                  No Users Found
                                </p>
                                <p className="text-sm text-gray-500 mt-2 max-w-md">
                                  {searchTerm || roleFilter !== "all"
                                    ? "No users match your current search criteria. Try adjusting your filters."
                                    : "There are currently no users registered in the system."}
                                </p>
                              </div>
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

        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Confirm Delete
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to delete this user? This action cannot be
                undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteUser(showDeleteConfirm)}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {showRoleConfirm && (
          <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Confirm Role Change
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to change this user's role to{" "}
                {showRoleConfirm.newRole.charAt(0).toUpperCase() +
                  showRoleConfirm.newRole.slice(1)}? This action will affect their
                access permissions.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowRoleConfirm(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() =>
                    handleRoleChange(showRoleConfirm.userId, showRoleConfirm.newRole)
                  }
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;