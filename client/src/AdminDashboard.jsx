import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [pendingItems, setPendingItems] = useState([]);

  useEffect(() => {
    // Fetch all pending items
    axios.get('http://127.0.0.1:3001/lostfound/pending')
      .then(response => {
        setPendingItems(response.data);
      })
      .catch(error => {
        console.error('Error fetching pending items:', error);
      });
  }, []);

  // Function to handle approving the item
  const handleApprove = (itemId, itemType) => {
    axios.patch(`http://127.0.0.1:3001/lostfound/update/${itemId}`, { 
      status: 'approved', 
      itemType 
    })
      .then(response => {
        // Update the UI to reflect the changes
        setPendingItems(pendingItems.filter(item => item._id !== itemId));
      })
      .catch(error => {
        console.error('Error approving item:', error);
      });
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <h3>Pending Items</h3>
      <table>
        <thead>
          <tr>
            <th>Item Name</th>
            <th>Category</th>
            <th>Description</th>
            <th>Location</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pendingItems.map(item => (
            <tr key={item._id}>
              <td>{item.name}</td>
              <td>{item.category}</td>
              <td>{item.description}</td>
              <td>{item.location}</td>
              <td><img src={`http://127.0.0.1:3001/${item.image}`} alt={item.name} width="100" /></td>
              <td>
                <button onClick={() => handleApprove(item._id, 'lost')}>Approve as Lost</button>
                <button onClick={() => handleApprove(item._id, 'found')}>Approve as Found</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
