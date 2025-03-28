import React, { useState } from "react";
import { useNavigate } from "react-router";
import {
  useProducts,
  useDeleteProduct,
  useCreateProduct,
} from "../queries/ProductQueries";
import { Product } from "../../../types";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../../api/queryClient";
import ProductCard from "./ProductCard";
import ProductForm from "./ProductForm";
import Pagination from "./Pagination";

const ProductList: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newProduct, setNewProduct] = useState<
    Omit<Product, "id" | "createdAt" | "updatedAt">
  >({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    category: "",
  });

  const { data, isLoading, error } = useProducts({
    page,
    limit: ITEMS_PER_PAGE,
  });

  const deleteProduct = useDeleteProduct();
  const createProduct = useCreateProduct();
  const queryClient = useQueryClient();

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation when clicking delete
    // Get the current query data
    const previousData = queryClient.getQueryData([
      ...queryKeys.products.all,
      { page, limit: ITEMS_PER_PAGE },
    ]);
    try {
      // Optimistically update the UI by filtering out the deleted product
      queryClient.setQueryData(
        [...queryKeys.products.all, { page, limit: ITEMS_PER_PAGE }],
        (old: any) => {
          return {
            ...old,
            data: old.data.filter((product: Product) => product.id !== id),
          };
        }
      );

      // Perform the actual deletion
      await deleteProduct.mutateAsync(id);

      // If the page is now empty and it's not the first page, go to previous page
      if (data?.data.length === 1 && page > 1) {
        setPage(page - 1);
      }
    } catch (error) {
      console.error("Failed to delete product:", error);
      // If there was an error, restore the previous data
      queryClient.setQueryData(
        [...queryKeys.products.all, { page, limit: ITEMS_PER_PAGE }],
        previousData
      );
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createProduct.mutateAsync(newProduct);
      // Reset form and hide it after successful creation
      setNewProduct({
        name: "",
        description: "",
        price: 0,
        stock: 0,
        category: "",
      });
      setShowCreateForm(false);
    } catch (error) {
      console.error("Failed to create product:", error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: name === "price" || name === "stock" ? Number(value) : value,
    }));
  };

  const navigateToDetail = (id: string) => {
    navigate(`/products/${id}`);
  };

  if (isLoading) {
    return <div className="p-6">Loading products...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">Error: {error.message}</div>;
  }

  if (!data?.data.length) {
    return (
      <div className="p-6">
        <p className="mb-4">No products found</p>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add New Product
        </button>
        {showCreateForm && (
          <ProductForm
            product={newProduct}
            onSubmit={handleCreate}
            onChange={handleInputChange}
            onCancel={() => setShowCreateForm(false)}
            isSubmitting={createProduct.isPending}
            title="Add New Product"
            submitLabel="Create Product"
          />
        )}
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add New Product
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.data.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onDelete={handleDelete}
            onClick={navigateToDetail}
            isDeleting={deleteProduct.isPending}
          />
        ))}
      </div>

      <Pagination page={page} setPage={setPage} hasMore={data.hasMore} />

      {showCreateForm && (
        <ProductForm
          product={newProduct}
          onSubmit={handleCreate}
          onChange={handleInputChange}
          onCancel={() => setShowCreateForm(false)}
          isSubmitting={createProduct.isPending}
          title="Add New Product"
          submitLabel="Create Product"
        />
      )}
    </div>
  );
};

export default ProductList;
