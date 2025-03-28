import React, { useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
  useProduct,
  useUpdateProduct,
  useDeleteProduct,
} from "../queries/ProductQueries";
import { Product } from "../../../types";
import ProductDetailView from "./ProductDetailView";
import ProductForm from "./ProductForm";

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Query hooks
  const { data: product, isLoading, error } = useProduct(id!);
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  // Local state for edit mode
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Product>>({});

  // Handle form changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: name === "price" || name === "stock" ? Number(value) : value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      await updateProduct.mutateAsync({
        id,
        data: editForm,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update product:", error);
    }
  };

  // Handle product deletion
  const handleDelete = async () => {
    if (!id) return;

    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct.mutateAsync(id);
        navigate("/products");
      } catch (error) {
        console.error("Failed to delete product:", error);
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

  if (!product) {
    return <div className="text-center p-4">Product not found</div>;
  }

  if (isEditing) {
    return (
      <ProductForm
        product={editForm as Omit<Product, "id" | "createdAt" | "updatedAt">}
        onSubmit={handleSubmit}
        onChange={handleInputChange}
        onCancel={() => setIsEditing(false)}
        isSubmitting={updateProduct.isPending}
        title="Edit Product"
        submitLabel="Update Product"
      />
    );
  }

  return (
    <ProductDetailView
      product={product}
      onEdit={() => {
        setEditForm(product);
        setIsEditing(true);
      }}
      onDelete={handleDelete}
      isDeleting={deleteProduct.isPending}
    />
  );
};

export default ProductDetail;
