import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const FoundItemForm = () => {
  const [name, setName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState(null); // Declare the image state
  const navigate = useNavigate();
  // Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file); // Store the selected image
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('contactNumber', contactNumber);
    formData.append('description', description);
    formData.append('location', location);
    
    if (image) {
      formData.append('image', image); // Append the image file to the form data
    }

    axios
      .post('http://127.0.0.1:3001/founditems', formData)
      .then((response) => {
        console.log('Item submitted successfully:', response);
        navigate('/login');
      })
      .catch((error) => {
        console.error('Error submitting item:', error);
      });
  };


  return (
    <div className="container">
    <h2>Found Item Form</h2>
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          className="form-control"
          value={name}
          onChange={(e) => setName(e.target.value)} // Directly update state
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="contactNumber">Contact Number:</label>
        <input
          type="text"
          id="contactNumber"
          name="contactNumber"
          className="form-control"
          value={contactNumber}
          onChange={(e) => setContactNumber(e.target.value)} // Directly update state
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="description">Description (20 words):</label>
        <textarea
          id="description"
          name="description"
          className="form-control"
          value={description}
          onChange={(e) => setDescription(e.target.value)} // Directly update state
          required
          maxLength="500"
        />
      </div>
      <div className="form-group">
        <label htmlFor="location">Location:</label>
        <input
          type="text"
          id="location"
          name="location"
          className="form-control"
          value={location}
          onChange={(e) => setLocation(e.target.value)} // Directly update state
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="image">Upload Image:</label>
        <input
          type="file"
          id="image"
          name="image"
          className="form-control"
          onChange={(e) => setImage(e.target.files[0])} // Directly update image state
        />
      </div>
      <div className="form-group">
        <input type="checkbox" id="terms" name="terms" required />
        <label htmlFor="terms"> I agree to the terms and conditions</label>
      </div>
      <button type="submit" className="btn btn-primary">Submit</button>
    </form>
  </div>
  );
};

export default FoundItemForm;
