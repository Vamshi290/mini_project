import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const FoundItemForm = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form data
    if (!name || !contactNumber || !description || !location || !agreed) {
      setError('All fields are required and you must agree to the terms.');
      return;
    }

    // Submit data to backend
    axios.post('http://127.0.0.1:3001/found', {
      itemId,
      name,
      contactNumber,
      description,
      location,
    })
      .then(response => {
        alert('Thank you! The item has been marked as found.');
        navigate('/'); // Redirect to home after success
      })
      .catch(error => {
        console.error('Error submitting found item:', error);
      });
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f5f5f5',
    }}>
      <div style={{
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '400px',
        textAlign: 'center',
      }}>
        <h2 style={{
          fontSize: '1.8rem',
          color: '#333',
          marginBottom: '20px',
        }}>Found Item Form</h2>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', color: '#555', marginBottom: '5px' }}>Name:</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              style={{
                padding: '12px',
                fontSize: '1rem',
                border: '1px solid #ddd',
                borderRadius: '8px',
                color: '#333',
                width: '100%',
                marginBottom: '10px',
              }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', color: '#555', marginBottom: '5px' }}>Contact Number:</label>
            <input
              type="text"
              value={contactNumber}
              onChange={e => setContactNumber(e.target.value)}
              required
              style={{
                padding: '12px',
                fontSize: '1rem',
                border: '1px solid #ddd',
                borderRadius: '8px',
                color: '#333',
                width: '100%',
                marginBottom: '10px',
              }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', color: '#555', marginBottom: '5px' }}>Description (20 words):</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
              maxLength="200"
              style={{
                padding: '12px',
                fontSize: '1rem',
                border: '1px solid #ddd',
                borderRadius: '8px',
                color: '#333',
                width: '100%',
                marginBottom: '10px',
                resize: 'vertical',
                minHeight: '100px',
              }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', color: '#555', marginBottom: '5px' }}>Location:</label>
            <input
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              required
              style={{
                padding: '12px',
                fontSize: '1rem',
                border: '1px solid #ddd',
                borderRadius: '8px',
                color: '#333',
                width: '100%',
                marginBottom: '10px',
              }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'inline-block', fontWeight: 'bold', color: '#555' }}>
              <input
                type="checkbox"
                checked={agreed}
                onChange={() => setAgreed(!agreed)}
                style={{ marginRight: '10px' }}
              />
              I agree to the terms and conditions
            </label>
          </div>

          {error && <p style={{ color: 'red', fontSize: '0.9rem', marginTop: '10px' }}>{error}</p>}

          <button type="submit" style={{
            padding: '12px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            fontSize: '1.1rem',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
            width: '100%',
            marginTop: '20px',
          }}>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default FoundItemForm;
