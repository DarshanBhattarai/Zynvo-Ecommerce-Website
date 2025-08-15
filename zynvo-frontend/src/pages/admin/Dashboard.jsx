import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Users, Crown, Shield, User, Activity } from "lucide-react";
import {
  fetchAllUsers,
  updateUserRole,
  deleteUser,
} from "../../services/userApi";

import Sidebar from "../../components/admin/Sidebar";
import Header from "../../components/admin/Header";
import StatWidgets from "../../components/admin/StatWidgets";
import UserTable from "../../components/admin/UserTable";
import DeleteUserModal from "../../components/admin/DeleteUserModal";
import RoleChangeModal from "../../components/admin/RoleChangeModal";
import VendorRequests from "../../components/admin/VendorRequests";

const sidebarItems = [
  { label: "Overview", icon: "LayoutDashboard" },
  { label: "Users", icon: "Users" },
  { label: "Vendor Requests", icon: "Store" },
  { label: "Analytics", icon: "TrendingUp" },
  { label: "Settings", icon: "Settings" },
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
      <Sidebar
        auth={auth}
        logout={logout}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        isSidebarOpen={isSidebarOpen}
      />

      <main className="flex-1 flex flex-col min-w-0 md:ml-64">
        <Header
          activeMenu={activeMenu}
          setIsSidebarOpen={setIsSidebarOpen}
          isSidebarOpen={isSidebarOpen}
        />

        <div className="flex-1 p-6 overflow-auto">
          {activeMenu === "Overview" && (
            <div className="space-y-8">
              <StatWidgets
                stats={stats}
                users={users}
                adminUser={adminUser}
                regularUsers={regularUsers}
              />

              <UserTable
                isLoading={isLoading}
                filteredUsers={filteredUsers}
                regularUsers={regularUsers}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                roleFilter={roleFilter}
                setRoleFilter={setRoleFilter}
                handleRoleChangeRequest={handleRoleChangeRequest}
                setShowDeleteConfirm={setShowDeleteConfirm}
                getRoleBadgeColor={getRoleBadgeColor}
                getRoleIcon={getRoleIcon}
              />
            </div>
          )}

          {activeMenu === "Vendor Requests" && <VendorRequests auth={auth} />}
        </div>

        <DeleteUserModal
          showDeleteConfirm={showDeleteConfirm}
          setShowDeleteConfirm={setShowDeleteConfirm}
          handleDeleteUser={handleDeleteUser}
        />

        <RoleChangeModal
          showRoleConfirm={showRoleConfirm}
          setShowRoleConfirm={setShowRoleConfirm}
          handleRoleChange={handleRoleChange}
        />
      </main>
    </div>
  );
};

export default Dashboard;
