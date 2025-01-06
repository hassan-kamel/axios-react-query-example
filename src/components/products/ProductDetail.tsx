import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProduct, useUpdateProduct, useDeleteProduct } from '../../queries/ProductQueries';
import { Product } from '../../types';
import './ProductDetail.css';

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
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? Number(value) : value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      await updateProduct.mutateAsync({
        id,
        data: editForm
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update product:', error);
    }
  };

  // Handle product deletion
  const handleDelete = async () => {
    if (!id) return;
    
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct.mutateAsync(id);
        navigate('/products');
      } catch (error) {
        console.error('Failed to delete product:', error);
      }
    }
  };

  if (isLoading) {
    return <div className="loading-spinner" />;
  }

  if (error) {
    return <div className="text-center text-danger">Error: {error.message}</div>;
  }

  if (!product) {
    return <div className="text-center">Product not found</div>;
  }

  return (
    <div className="product-detail">
      <div className="card">
        <div className="card-header">
          <div className="d-flex justify-content-between align-items-center">
            <h2>{isEditing ? 'Edit Product' : product.name}</h2>
            <div>
              {!isEditing && (
                <>
                  <button
                    className="btn btn-primary me-2"
                    onClick={() => {
                      setEditForm(product);
                      setIsEditing(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={handleDelete}
                    disabled={deleteProduct.isPending}
                  >
                    {deleteProduct.isPending ? 'Deleting...' : 'Delete'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="card-body">
          {isEditing ? (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={editForm.name || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  className="form-control"
                  value={editForm.description || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Price</label>
                <input
                  type="number"
                  name="price"
                  className="form-control"
                  value={editForm.price || ''}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Stock</label>
                <input
                  type="number"
                  name="stock"
                  className="form-control"
                  value={editForm.stock || ''}
                  onChange={handleInputChange}
                  required
                  min="0"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <input
                  type="text"
                  name="category"
                  className="form-control"
                  value={editForm.category || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="mt-3">
                <button
                  type="submit"
                  className="btn btn-primary me-2"
                  disabled={updateProduct.isPending}
                >
                  {updateProduct.isPending ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div>
              <div className="mb-3">
                <h3>Description</h3>
                <p>{product.description}</p>
              </div>

              <div className="mb-3">
                <h3>Details</h3>
                <ul className="list-unstyled">
                  <li><strong>Price:</strong> ${product.price}</li>
                  <li><strong>Stock:</strong> {product.stock} units</li>
                  <li><strong>Category:</strong> {product.category}</li>
                </ul>
              </div>

              <div className="mb-3">
                <h3>Timestamps</h3>
                <ul className="list-unstyled">
                  <li><strong>Created:</strong> {new Date(product.createdAt).toLocaleString()}</li>
                  <li><strong>Last Updated:</strong> {new Date(product.updatedAt).toLocaleString()}</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
