import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // For navigation

function LostFoundForm() {
  // State variables for form fields
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [itemType, setItemType] = useState('lost');
  const [image, setImage] = useState(null); // Image file state

  const navigate = useNavigate(); // To navigate after form submission

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    const formData = new FormData(); // FormData to include all fields and file
    formData.append('name', name);
    formData.append('category', category);
    formData.append('description', description);
    formData.append('location', location);
    formData.append('date', date);
    formData.append('itemType', itemType);
    if (image) formData.append('image', image); // Add image only if selected

    try {
      // Send POST request to server
      const response = await axios.post('http://127.0.0.1:3001/lostfound', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('Item submitted successfully:', response.data);
      navigate('/login'); // Redirect to login page
    } catch (error) {
      console.error('Error submitting item:', error);
    }
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    setImage(e.target.files[0]); // Update image state with the selected file
  };

  return (
    <div className="container">
      <h2>Submit Lost/Found Item</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Item Name</label>
          <input
            type="text"
            name="name"
            className="form-control"
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            name="category"
            className="form-control"
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select a category</option>
            <option value="electronics">Electronics</option>
            <option value="furniture">Furniture</option>
            <option value="clothing">Clothing</option>
            <option value="books">Books</option>
            <option value="documents">Documents</option>
            <option value="jewelry">Jewelry</option>
            <option value="bags">Bags</option>
            <option value="others">Others</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            name="description"
            className="form-control"
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            name="location"
            className="form-control"
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            name="date"
            className="form-control"
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="itemType">Item Type</label>
          <select
            name="itemType"
            className="form-control"
            onChange={(e) => setItemType(e.target.value)}
            required
          >
            <option value="lost">Lost</option>
            <option value="found">Found</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="image">Choose an image</label>
          <input
            type="file"
            name="image"
            className="form-control"
            onChange={handleImageChange}
            accept="image/*" // Accept only image files
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Submit Item
        </button>
      </form>
    </div>
  );
}

export default LostFoundForm;
