import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { queryClient } from './api/queryClient';

// Layout components
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';

// Page components
import ProductList from './components/products/ProductList';
import ProductDetail from './components/products/ProductDetail';
import OrderList from './components/orders/OrderList';
import OrderDetail from './components/orders/OrderDetail';
import UserList from './components/users/UserList';
import UserDetail from './components/users/UserDetail';

// Styles
import 'react-toastify/dist/ReactToastify.css';
import './styles/global.css';

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="app">
          <Navbar />
          <div className="main-container">
            <Sidebar />
            <main className="content">
              <Routes>
                {/* Product routes */}
                <Route path="/products" element={<ProductList />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                
                {/* Order routes */}
                <Route path="/orders" element={<OrderList />} />
                <Route path="/orders/:id" element={<OrderDetail />} />
                
                {/* User routes */}
                <Route path="/users" element={<UserList />} />
                <Route path="/users/:id" element={<UserDetail />} />
                
                {/* Default redirect */}
                <Route path="/" element={<Navigate to="/products" replace />} />
              </Routes>
            </main>
          </div>
        </div>
        
        {/* Toast notifications */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        
        {/* React Query Devtools */}
        {process.env.REACT_APP_ENABLE_QUERY_DEVTOOLS === 'true' && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </Router>
    </QueryClientProvider>
  );
};

export default App;
