import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar: React.FC = () => {
  const location = useLocation();
  
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Data Management App</Link>
      </div>
      
      <div className="navbar-menu">
        <Link
          to="/products"
          className={location.pathname.includes('/products') ? 'active' : ''}
        >
          Products
        </Link>
        <Link
          to="/orders"
          className={location.pathname.includes('/orders') ? 'active' : ''}
        >
          Orders
        </Link>
        <Link
          to="/users"
          className={location.pathname.includes('/users') ? 'active' : ''}
        >
          Users
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
