import React from "react";
import { User } from "../../../types";

interface UserCardProps {
  user: User;
  onDelete: (id: string, e: React.MouseEvent) => Promise<void>;
  onClick: (id: string) => void;
  isDeleting: boolean;
}

const UserCard: React.FC<UserCardProps> = ({
  user,
  onDelete,
  onClick,
  isDeleting,
}) => {
  if (!user) {
    return null; // Or a loading/error state
  }

  return (
    <div
      key={user.id}
      className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow"
      onClick={() => onClick(user.id)}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold">{user.name}</h3>
          <p className="text-gray-600">{user.email}</p>
          <p className="text-gray-500 mt-2">Role: {user.role}</p>
        </div>
      </div>

      <div className="mb-4">
        <span
          className={`px-2 py-1 rounded text-xs ${
            user.role === "admin"
              ? "bg-purple-100 text-purple-800"
              : user.role === "manager"
              ? "bg-blue-100 text-blue-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          {user.role.toUpperCase()}
        </span>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">
          Joined: {new Date(user.createdAt).toLocaleDateString()}
        </span>
        <button
          onClick={(e) => onDelete(user.id, e)}
          disabled={isDeleting}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 disabled:bg-red-300 text-sm"
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  );
};

export default UserCard;
