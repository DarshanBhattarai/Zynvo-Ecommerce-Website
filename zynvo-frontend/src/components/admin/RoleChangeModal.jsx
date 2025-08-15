import React from "react";

const RoleChangeModal = ({
  showRoleConfirm,
  setShowRoleConfirm,
  handleRoleChange,
}) =>
  showRoleConfirm && (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          Confirm Role Change
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          Are you sure you want to change this user's role to{" "}
          {showRoleConfirm.newRole.charAt(0).toUpperCase() +
            showRoleConfirm.newRole.slice(1)}
          ? This action will affect their access permissions.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() =>
              onConfirm(showRoleConfirm.userId, showRoleConfirm.newRole)
            }
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );

export default RoleChangeModal;
