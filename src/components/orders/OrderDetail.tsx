import React from 'react';
import { useParams } from 'react-router-dom';

const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div>
      <h1>Order Details</h1>
      <p>Order details for ID: {id}</p>
      <p>Order detail component coming soon...</p>
    </div>
  );
};

export default OrderDetail;
