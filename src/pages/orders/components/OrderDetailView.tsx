import React from "react";
import { Order, OrderStatus } from "../../../types";

interface OrderDetailViewProps {
  order: Order;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}

const OrderDetailView: React.FC<OrderDetailViewProps> = ({
  order,
  onEdit,
  onDelete,
  isDeleting,
}) => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white shadow-md rounded-lg">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-semibold">
                Order #{order.id.slice(-6)}
              </h2>
              <p className="text-gray-500">
                {new Date(order.orderDate).toLocaleString()}
              </p>
            </div>
            <div className="space-x-2">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={onEdit}
              >
                Edit
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:bg-red-300"
                onClick={onDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Customer Information</h3>
              <p className="text-gray-700 mb-1">
                <span className="font-medium">Name:</span> {order.customerName}
              </p>
              <p className="text-gray-700 mb-1">
                <span className="font-medium">Status:</span>{" "}
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    order.status === OrderStatus.DELIVERED
                      ? "bg-green-100 text-green-800"
                      : order.status === OrderStatus.PENDING
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {order.status.toUpperCase()}
                </span>
              </p>
              <p className="text-gray-700 mb-1">
                <span className="font-medium">Total:</span> $
                {order.total.toFixed(2)}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Shipping Address</h3>
              <p className="text-gray-700 whitespace-pre-line">
                {order.shippingAddress}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Order Items</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Product
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Quantity
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Price
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {order.items.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {item.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {item.productId}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${item.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${(item.price * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td
                      colSpan={3}
                      className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
                    >
                      Total:
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      ${order.total.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailView;
