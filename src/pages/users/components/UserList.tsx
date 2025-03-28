import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useUsers, useDeleteUser } from "../queries/UserQueries";
import { User } from "../../../types";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../../api/queryClient";
import UserCard from "./UserCard";
import Pagination from "../../shared/components/Pagination";

const UserList: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Convert params to URLSearchParams string
  const params = new URLSearchParams({
    page: page.toString(),
    limit: ITEMS_PER_PAGE.toString(),
  }).toString();

  const { data, isLoading, error } = useUsers(params);
  const deleteUser = useDeleteUser();
  const queryClient = useQueryClient();

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const previousData = queryClient.getQueryData([
      ...queryKeys.users.all,
      { page, limit: ITEMS_PER_PAGE },
    ]);

    try {
      queryClient.setQueryData(
        [...queryKeys.users.all, { page, limit: ITEMS_PER_PAGE }],
        (old: any) => ({
          ...old,
          data: old.data.filter((user: User) => user.id !== id),
        })
      );

      await deleteUser.mutateAsync(id);

      if (data?.data.length === 1 && page > 1) {
        setPage(page - 1);
      }
    } catch (error) {
      console.error("Failed to delete user:", error);
      queryClient.setQueryData(
        [...queryKeys.users.all, { page, limit: ITEMS_PER_PAGE }],
        previousData
      );
    }
  };

  const navigateToDetail = (id: string) => {
    navigate(`/users/${id}`);
  };

  if (isLoading) {
    return <div className="p-6">Loading users...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">Error: {error.message}</div>;
  }

  if (!data?.data.length) {
    return (
      <div className="p-6">
        <p className="mb-4">No users found</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Users</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.data.map((user: any) => (
          <UserCard
            key={user.id}
            user={user}
            onDelete={handleDelete}
            onClick={navigateToDetail}
            isDeleting={deleteUser.isPending}
          />
        ))}
      </div>

      <Pagination page={page} setPage={setPage} hasMore={data.hasMore} />
    </div>
  );
};

export default UserList;
