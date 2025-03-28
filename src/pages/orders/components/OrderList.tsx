import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useOrders, useDeleteOrder } from "../queries/OrderQueries";
import { Order } from "../../../types";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../../api/queryClient";
import OrderCard from "./OrderCard";
import Pagination from "../../shared/components/Pagination";

const OrderList: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Convert params to URLSearchParams string
  const params = new URLSearchParams({
    page: page.toString(),
    limit: ITEMS_PER_PAGE.toString(),
  }).toString();

  const { data, isLoading, error } = useOrders(params);

  const deleteOrder = useDeleteOrder();
  const queryClient = useQueryClient();

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation when clicking delete
    // Get the current query data
    const previousData = queryClient.getQueryData([
      ...queryKeys.orders.all,
      { page, limit: ITEMS_PER_PAGE },
    ]);
    try {
      // Optimistically update the UI by filtering out the deleted order
      queryClient.setQueryData(
        [...queryKeys.orders.all, { page, limit: ITEMS_PER_PAGE }],
        (old: any) => {
          return {
            ...old,
            data: old.data.filter((order: Order) => order.id !== id),
          };
        }
      );

      // Perform the actual deletion
      await deleteOrder.mutateAsync(id);

      // If the page is now empty and it's not the first page, go to previous page
      if (data?.data.length === 1 && page > 1) {
        setPage(page - 1);
      }
    } catch (error) {
      console.error("Failed to delete order:", error);
      // If there was an error, restore the previous data
      queryClient.setQueryData(
        [...queryKeys.orders.all, { page, limit: ITEMS_PER_PAGE }],
        previousData
      );
    }
  };

  const navigateToDetail = (id: string) => {
    navigate(`/orders/${id}`);
  };

  if (isLoading) {
    return <div className="p-6">Loading orders...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">Error: {error.message}</div>;
  }

  if (!data?.data.length) {
    return (
      <div className="p-6">
        <p className="mb-4">No orders found</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Orders</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.data.map((order: any) => (
          <OrderCard
            key={order.id}
            order={order}
            onDelete={handleDelete}
            onClick={navigateToDetail}
            isDeleting={deleteOrder.isPending}
          />
        ))}
      </div>

      <Pagination page={page} setPage={setPage} hasMore={data.hasMore} />
    </div>
  );
};

export default OrderList;
