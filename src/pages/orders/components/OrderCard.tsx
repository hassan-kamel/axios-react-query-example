import React from "react";
import { Order, OrderStatus } from "../../../types";

interface OrderCardProps {
  order: Order;
  onDelete: (id: string, e: React.MouseEvent) => Promise<void>;
  onClick: (id: string) => void;
  isDeleting: boolean;
}

const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onDelete,
  onClick,
  isDeleting,
}) => {
  return (
    <div
      className="bg-white shadow-md rounded-lg p-4 cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => onClick(order.id)}
    >
      <h3 className="text-xl font-semibold mb-2">
        Order #{order.id ? order.id.slice(-6) : "N/A"}
      </h3>
      <div className="flex justify-between text-gray-700 mb-4">
        <span>Customer: {order.customerName || "Unknown"}</span>
        <span
          className={`px-2 py-1 rounded text-xs ${
            order.status === OrderStatus.DELIVERED
              ? "bg-green-100 text-green-800"
              : order.status === OrderStatus.PENDING
              ? "bg-yellow-100 text-yellow-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {(order.status || OrderStatus.PENDING).toString()}
        </span>
      </div>
      <div className="text-gray-600 mb-4">
        <p>Items: {order.items?.length || 0}</p>
        <p>Total: ${(order.total || 0).toFixed(2)}</p>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">
          {order.orderDate
            ? new Date(order.orderDate).toLocaleDateString()
            : "No date"}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent card click when delete button is clicked
            onDelete(order.id, e);
          }}
          disabled={isDeleting}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 disabled:bg-red-300 text-sm"
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  );
};

export default OrderCard;
