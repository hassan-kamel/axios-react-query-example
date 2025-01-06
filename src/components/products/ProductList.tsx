import React, { useState } from 'react';
import { useProducts, useDeleteProduct, useCreateProduct } from '../../queries/ProductQueries';
import { Product } from '../../types';
import './ProductList.css';

/**
 * ProductList component
 * Demonstrates usage of React Query hooks for product management
 */
const ProductList: React.FC = () => {
  // State for pagination
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Query hooks
  const { data, isLoading, error } = useProducts({
    page,
    limit: ITEMS_PER_PAGE,
  });

  // Mutation hooks
  const deleteProduct = useDeleteProduct();
  const createProduct = useCreateProduct();

  /**
   * Handle product deletion
   */
  const handleDelete = async (id: string) => {
    try {
      await deleteProduct.mutateAsync(id);
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  /**
   * Handle product creation
   */
  const handleCreate = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await createProduct.mutateAsync(productData);
    } catch (error) {
      console.error('Failed to create product:', error);
    }
  };

  // Loading state
  if (isLoading) {
    return <div>Loading products...</div>;
  }

  // Error state
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  // Empty state
  if (!data?.data.length) {
    return <div>No products found</div>;
  }

  return (
    <div className="product-list">
      <h1>Products</h1>
      
      {/* Product Grid */}
      <div className="product-grid">
        {data.data.map((product) => (
          <div key={product.id} className="product-card">
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <div className="product-details">
              <span>Price: ${product.price}</span>
              <span>Stock: {product.stock}</span>
            </div>
            <div className="product-actions">
              <button
                onClick={() => handleDelete(product.id)}
                disabled={deleteProduct.isPending}
              >
                {deleteProduct.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <span>Page {page}</span>
        <button
          onClick={() => setPage(p => p + 1)}
          disabled={!data.hasMore}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ProductList;
