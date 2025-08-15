import React from "react";

const DeleteUserModal = ({
  showDeleteConfirm,
  setShowDeleteConfirm,
  handleDeleteUser,
}) =>
  showDeleteConfirm && (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className=" rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Confirm Delete</h3>
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
  );

export default DeleteUserModal;
