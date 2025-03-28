import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useUser, useUpdateUser, useDeleteUser } from "../queries/UserQueries";
import { User, UserRole } from "../../../types";
import UserDetailView from "./UserDetailView";
import UserForm from "./UserForm";

const UserDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Query hooks
  const { data: user, isLoading, error } = useUser(id!);
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  // Local state for edit mode
  const [isEditing, setIsEditing] = useState(false);
  // Local state for edit mode
  const [editForm, setEditForm] = useState<
    Omit<User, "id" | "createdAt" | "updatedAt">
  >({
    name: "",
    email: "",
    role: UserRole.USER,
    password: "", // Add password field for new users
  });

  // Initialize form with user data when available
  useEffect(() => {
    if (user) {
      setEditForm({
        name: user.name,
        email: user.email,
        role: user.role,
      });
    }
  }, [user]);

  // Handle form changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      await updateUser.mutateAsync({
        id,
        data: editForm,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  // Handle user deletion
  const handleDelete = async () => {
    if (!id) return;

    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser.mutateAsync(id);
        navigate("/users");
      } catch (error) {
        console.error("Failed to delete user:", error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">Error: {error.message}</div>
    );
  }

  if (!user) {
    return <div className="text-center p-4">User not found</div>;
  }

  if (isEditing) {
    return (
      <UserForm
        user={editForm}
        onSubmit={handleSubmit}
        onChange={handleInputChange}
        onCancel={() => setIsEditing(false)}
        isSubmitting={updateUser.isPending}
        title="Edit User"
        submitLabel="Update User"
      />
    );
  }

  return (
    <UserDetailView
      user={user}
      onEdit={() => setIsEditing(true)}
      onDelete={handleDelete}
      isDeleting={deleteUser.isPending}
    />
  );
};

export default UserDetail;
