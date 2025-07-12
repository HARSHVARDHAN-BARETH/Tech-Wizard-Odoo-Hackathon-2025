import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

function AddItem() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    type: '',
    size: '',
    condition: '',
    tags: '',
    images: [],
  });

  const handleChange = (e) => {
    if (e.target.name === 'images') {
      setFormData({ ...formData, images: Array.from(e.target.files) });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to add an item');
      return navigate('/login');
    }
    const form = new FormData();
    form.append('title', formData.title);
    form.append('description', formData.description);
    form.append('category', formData.category);
    form.append('type', formData.type);
    form.append('size', formData.size);
    form.append('condition', formData.condition);
    form.append('tags', formData.tags);
    formData.images.forEach(image => form.append('images', image));

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/items`, form, {
        headers: { 
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Item added, awaiting approval!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data.message || 'Error adding item');
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h2 className="text-2xl font-bold mb-4">Add New Item</h2>
      <div className="space-y-4">
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Title"
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
          placeholder="Category"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="type"
          value={formData.type}
          onChange={handleChange}
          placeholder="Type"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="size"
          value={formData.size}
          onChange={handleChange}
          placeholder="Size (optional)"
          className="w-full p-2 border rounded"
        />
        <select
          name="condition"
          value={formData.condition}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select Condition</option>
          <option value="new">New</option>
          <option value="like new">Like New</option>
          <option value="used">Used</option>
          <option value="worn">Worn</option>
        </select>
        <input
          type="text"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          placeholder="Tags (comma-separated)"
          className="w-full p-2 border rounded"
        />
        <input
          type="file"
          name="images"
          onChange={handleChange}
          multiple
          accept="image/*"
          className="w-full p-2 border rounded"
        />
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Add Item
        </button>
      </div>
    </div>
  );
}

export default AddItem;