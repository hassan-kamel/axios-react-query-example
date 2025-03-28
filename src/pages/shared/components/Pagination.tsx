import React from "react";

interface PaginationProps {
  page: number;
  setPage: (page: number) => void;
  hasMore: boolean;
}

const Pagination: React.FC<PaginationProps> = ({ page, setPage, hasMore }) => {
  return (
    <div className="flex justify-center items-center mt-8 space-x-4">
      <button
        onClick={() => setPage(Math.max(1, page - 1))}
        disabled={page === 1}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
      >
        Previous
      </button>
      <span className="text-gray-700">Page {page}</span>
      <button
        onClick={() => setPage(page + 1)}
        disabled={!hasMore}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;