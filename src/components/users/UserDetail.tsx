import React from 'react';
import { useParams } from 'react-router-dom';

const UserDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div>
      <h1>User Details</h1>
      <p>User details for ID: {id}</p>
      <p>User detail component coming soon...</p>
    </div>
  );
};

export default UserDetail;
