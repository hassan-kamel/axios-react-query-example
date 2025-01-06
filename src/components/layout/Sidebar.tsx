import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Sidebar.css';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get current section from URL
  const currentSection = location.pathname.split('/')[1];
  
  const menuItems = {
    products: [
      { label: 'All Products', path: '/products' },
      { label: 'Add Product', path: '/products/new' },
      { label: 'Categories', path: '/products/categories' },
    ],
    orders: [
      { label: 'All Orders', path: '/orders' },
      { label: 'Pending Orders', path: '/orders?status=pending' },
      { label: 'Completed Orders', path: '/orders?status=completed' },
    ],
    users: [
      { label: 'All Users', path: '/users' },
      { label: 'Add User', path: '/users/new' },
      { label: 'User Roles', path: '/users/roles' },
    ],
  };

  const getCurrentMenu = () => {
    switch (currentSection) {
      case 'products':
        return menuItems.products;
      case 'orders':
        return menuItems.orders;
      case 'users':
        return menuItems.users;
      default:
        return [];
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-content">
        <h2 className="sidebar-title">
          {currentSection?.charAt(0).toUpperCase() + currentSection?.slice(1)}
        </h2>
        
        <nav className="sidebar-menu">
          {getCurrentMenu().map((item) => (
            <button
              key={item.path}
              className={location.pathname === item.path ? 'active' : ''}
              onClick={() => navigate(item.path)}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
