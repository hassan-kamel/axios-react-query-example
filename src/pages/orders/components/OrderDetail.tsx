import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import {
  useOrder,
  useUpdateOrder,
  useDeleteOrder,
} from "../queries/OrderQueries";
import { Order, OrderItem, OrderStatus } from "../../../types";
import OrderDetailView from "./OrderDetailView";
import OrderForm from "./OrderForm";

const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Query hooks
  const { data: order, isLoading, error } = useOrder(id!);
  const updateOrder = useUpdateOrder();
  const deleteOrder = useDeleteOrder();

  // Local state for edit mode
  const [isEditing, setIsEditing] = useState(false);
  // Local state for edit mode
  const [editForm, setEditForm] = useState<
    Omit<Order, "id" | "createdAt" | "updatedAt">
  >({
    customerName: "",
    userId: "", // Add userId field
    status: OrderStatus.PENDING,
    shippingAddress: "",
    items: [],
    total: 0,
    orderDate: new Date().toISOString(),
  });

  // Initialize form with order data when available
  useEffect(() => {
    if (order) {
      setEditForm({
        customerName: order.customerName,
        userId: order.userId, // Add userId field
        status: order.status,
        shippingAddress: order.shippingAddress,
        items: [...order.items],
        total: order.total,
        orderDate: order.orderDate,
      });
    }
  }, [order]);

  // Handle form changes
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle adding a new item
  const handleAddItem = () => {
    setEditForm((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { productId: "", name: "", quantity: 1, price: 0 },
      ],
    }));
  };

  // Handle removing an item
  const handleRemoveItem = (index: number) => {
    setEditForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  // Handle item field changes
  const handleItemChange = (
    index: number,
    field: keyof OrderItem,
    value: any
  ) => {
    setEditForm((prev) => {
      const updatedItems = [...prev.items];
      updatedItems[index] = {
        ...updatedItems[index],
        [field]: value,
      };

      // Recalculate total
      const total = updatedItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      return {
        ...prev,
        items: updatedItems,
        total: total,
      };
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      await updateOrder.mutateAsync({
        id,
        data: editForm,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update order:", error);
    }
  };

  // Handle order deletion
  const handleDelete = async () => {
    if (!id) return;

    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        await deleteOrder.mutateAsync(id);
        navigate("/orders");
      } catch (error) {
        console.error("Failed to delete order:", error);
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

  if (!order) {
    return <div className="text-center p-4">Order not found</div>;
  }

  if (isEditing) {
    return (
      <OrderForm
        order={editForm}
        onSubmit={handleSubmit}
        onChange={handleInputChange}
        onAddItem={handleAddItem}
        onRemoveItem={handleRemoveItem}
        onItemChange={handleItemChange}
        onCancel={() => setIsEditing(false)}
        isSubmitting={updateOrder.isPending}
        title="Edit Order"
        submitLabel="Update Order"
      />
    );
  }

  return (
    <OrderDetailView
      order={order}
      onEdit={() => setIsEditing(true)}
      onDelete={handleDelete}
      isDeleting={deleteOrder.isPending}
    />
  );
};

export default OrderDetail;
