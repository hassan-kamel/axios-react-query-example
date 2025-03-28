import React from "react";
import { Product } from "../../../types";

interface ProductDetailViewProps {
  product: Product;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}

const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
  onEdit,
  onDelete,
  isDeleting,
}) => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white shadow-md rounded-lg">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">{product.name}</h2>
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
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Description</h3>
            <p className="text-gray-700">{product.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Details</h3>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-medium">${product.price}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Stock:</span>
                  <span className="font-medium">{product.stock} units</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-medium">{product.category}</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Metadata</h3>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span className="text-gray-600">ID:</span>
                  <span className="font-medium">{product.id}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Created:</span>
                  <span className="font-medium">
                    {new Date(product.createdAt).toLocaleString()}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Updated:</span>
                  <span className="font-medium">
                    {new Date(product.updatedAt).toLocaleString()}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailView;