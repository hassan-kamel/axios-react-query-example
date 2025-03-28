import React from "react";
import { Product } from "../../../types";

interface ProductCardProps {
  product: Product;
  onDelete: (id: string, e: React.MouseEvent) => Promise<void>;
  onClick: (id: string) => void;
  isDeleting: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onDelete,
  onClick,
  isDeleting,
}) => {
  return (
    <div
      key={product.id}
      className="bg-white shadow-md rounded-lg p-4 cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => onClick(product.id)}
    >
      <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
      <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
      <div className="flex justify-between text-gray-700 mb-4">
        <span>Price: ${product.price}</span>
        <span>Stock: {product.stock}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">
          Category: {product.category}
        </span>
        <button
          onClick={(e) => onDelete(product.id, e)}
          disabled={isDeleting}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 disabled:bg-red-300 text-sm"
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
