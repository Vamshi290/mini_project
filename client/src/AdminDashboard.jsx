import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPortal = () => {
  const [pendingItems, setPendingItems] = useState([]);
  const [approvedLostItems, setApprovedLostItems] = useState([]);
  const [approvedFoundItems, setApprovedFoundItems] = useState([]);
  const [activeTab, setActiveTab] = useState('pending'); // tabs: 'pending', 'lost', 'found'

  useEffect(() => {
    // Fetch pending items
    axios.get('http://127.0.0.1:3001/lostfound/pending')
      .then(response => setPendingItems(response.data))
      .catch(error => console.error('Error fetching pending items:', error));

    // Fetch approved lost items
    axios.get('http://127.0.0.1:3001/lostfound/lost')
      .then(response => setApprovedLostItems(response.data))
      .catch(error => console.error('Error fetching approved lost items:', error));

    // Fetch approved found items
    axios.get('http://127.0.0.1:3001/lostfound/found')
      .then(response => setApprovedFoundItems(response.data))
      .catch(error => console.error('Error fetching approved found items:', error));
  }, []);

  const handleApprove = (itemId, itemType) => {
    axios.patch(`http://127.0.0.1:3001/lostfound/update/${itemId}`, { status: 'approved' })
      .then(response => {
        if (itemType === 'lost') {
          setPendingItems(pendingItems.filter(item => item._id !== itemId));
          setApprovedLostItems([...approvedLostItems, response.data]);
        } else if (itemType === 'found') {
          setPendingItems(pendingItems.filter(item => item._id !== itemId));
          setApprovedFoundItems([...approvedFoundItems, response.data]);
        }
      })
      .catch(error => console.error('Error approving item:', error));
  };

  const handleReject = (itemId, itemType) => {
    axios.patch(`http://127.0.0.1:3001/lostfound/update/${itemId}`, { status: 'rejected' })
      .then(() => {
        if (itemType === 'lost') {
          setPendingItems(pendingItems.filter(item => item._id !== itemId));
        } else if (itemType === 'found') {
          setPendingItems(pendingItems.filter(item => item._id !== itemId));
        }
      })
      .catch(error => console.error('Error rejecting item:', error));
  };

  return (
    <div className="admin-portal">
      <h2>Admin Dashboard</h2>
      <div className="tabs">
        <button onClick={() => setActiveTab('pending')}>Pending Items</button>
        <button onClick={() => setActiveTab('lost')}>Approved Lost Items</button>
        <button onClick={() => setActiveTab('found')}>Approved Found Items</button>
      </div>

      {activeTab === 'pending' && (
        <div>
          <h3>Pending Lost and Found Items</h3>
          <table>
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Category</th>
                <th>Description</th>
                <th>Location</th>
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
                  <td>
                    <button onClick={() => handleApprove(item._id, item.itemType)}>Approve</button>
                    <button onClick={() => handleReject(item._id, item.itemType)}>Reject</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'lost' && (
        <div>
          <h3>Approved Lost Items</h3>
          <table>
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Description</th>
                <th>Location</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {approvedLostItems.map(item => (
                <tr key={item._id}>
                  <td>{item.name}</td>
                  <td>{item.description}</td>
                  <td>{item.location}</td>
                  <td>{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'found' && (
        <div>
          <h3>Approved Found Items</h3>
          <table>
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Description</th>
                <th>Location</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {approvedFoundItems.map(item => (
                <tr key={item._id}>
                  <td>{item.name}</td>
                  <td>{item.description}</td>
                  <td>{item.location}</td>
                  <td>{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPortal;
