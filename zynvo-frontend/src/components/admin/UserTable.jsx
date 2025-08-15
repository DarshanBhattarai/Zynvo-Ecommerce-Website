import React from 'react';
import { Search, Download, ChevronDown, Crown, Shield, User, Users, Trash2 } from 'lucide-react';

const UserTable = ({ 
  isLoading, 
  filteredUsers, 
  regularUsers, 
  searchTerm, 
  setSearchTerm, 
  roleFilter, 
  setRoleFilter, 
  handleRoleChangeRequest, 
  setShowDeleteConfirm 
}) => {
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

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="px-6 py-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">User Directory</h2>
            <p className="text-sm text-gray-500 mt-1 font-medium">
              {filteredUsers.length} of {regularUsers.length} users displayed
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
  );
};

export default UserTable;