import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom

const Found = () => {
  const [foundItems, setFoundItems] = useState([]);
  const [zoomedImage, setZoomedImage] = useState(null);
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState(null); // Track error state
  const navigate = useNavigate(); // Hook to handle navigation

  useEffect(() => {
    axios.get('http://127.0.0.1:3001/lostfound/found')
      .then(response => {
        setFoundItems(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError('Error fetching found items. Please try again later.');
        setLoading(false);
      });
  }, []);

  const handleImageClick = (image) => {
    setZoomedImage(image);
  };

  const handleCloseZoom = () => {
    setZoomedImage(null);
  };

  const handleLostButtonClick = (itemId) => {
    // Navigate to LostItemForm with itemId as a route parameter
    navigate(`/lost/${itemId}`);
  };

  if (loading) {
    return <div>Loading found items...</div>; // Loading indicator
  }

  if (error) {
    return <div>{error}</div>; // Display error message
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Found Items</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '20px',
        marginTop: '20px',
      }}>
        {foundItems.map(item => (
          <div key={item._id} style={{
            background: '#f9f9f9',
            border: '1px solid #ddd',
            padding: '10px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          }}>
            <div style={{ marginBottom: '10px' }}>
              <h3 style={{ margin: '0', fontSize: '1.2rem', fontWeight: 'bold' }}><strong>Item name: </strong>{item.name}</h3>
              <p style={{ margin: '8px 0', fontSize: '0.9rem' }}><strong>Category: </strong>{item.category}</p>
              <p style={{ margin: '8px 0', fontSize: '0.9rem' }}><strong>Description: </strong>{item.description}</p>
              <p style={{ margin: '8px 0', fontSize: '0.9rem' }}><strong>Posted On:</strong> {new Date(item.date).toLocaleDateString()}</p>
              <p style={{ margin: '8px 0', fontSize: '0.9rem' }}><strong>Location:</strong> {item.location}</p>
            </div>
            <div>
              <img
                src={`http://127.0.0.1:3001/${item.image}`}
                alt={item.name}
                width="200"
                style={{ cursor: 'pointer', transition: 'transform 0.2s ease', borderRadius: '8px', maxWidth: '100%' }}
                onClick={() => handleImageClick(`http://127.0.0.1:3001/${item.image}`)}
                aria-label={`Click to zoom in on image of ${item.name}`} // Accessibility label
              />
            </div>
            <button
              style={{
                marginTop: '10px',
                padding: '10px 20px',
                background: '#007bff',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '1rem',
              }}
              onClick={() => handleLostButtonClick(item._id)} // Navigate to LostItemForm with itemId
            >
              Lost
            </button>
          </div>
        ))}
      </div>

      {/* Image Zoom Popup */}
      {zoomedImage && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
        }} onClick={handleCloseZoom}>
          <img
            src={zoomedImage}
            alt="Zoomed"
            style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain', borderRadius: '8px' }}
          />
          <button
            onClick={handleCloseZoom}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              padding: '10px',
              background: '#ff0000',
              color: '#fff',
              border: 'none',
              borderRadius: '50%',
              cursor: 'pointer',
              fontSize: '1.5rem',
            }}
            aria-label="Close zoomed image" // Accessibility label
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default Found;
