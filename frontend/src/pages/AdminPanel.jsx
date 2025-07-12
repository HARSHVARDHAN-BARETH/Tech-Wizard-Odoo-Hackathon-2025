import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import ItemCard from '../components/ItemCard';

function AdminPanel() {
  const { user } = useContext(AuthContext);
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (user) {
      axios.get(`${import.meta.env.VITE_API_URL}/admin/items`, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
        .then(res => setItems(res.data))
        .catch(err => toast.error(err.response?.data.message || 'Error fetching items'));
    }
  }, [user]);

  const handleApprove = async (itemId) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/admin/items/${itemId}/approve`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      toast.success('Item approved!');
      setItems(items.filter(item => item._id !== itemId));
    } catch (error) {
      toast.error(error.response?.data.message || 'Error approving item');
    }
  };

  const handleReject = async (itemId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/admin/items/${itemId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      toast.success('Item rejected!');
      setItems(items.filter(item => item._id !== itemId));
    } catch (error) {
      toast.error(error.response?.data.message || 'Error rejecting item');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Admin Panel - Item Moderation</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {items.map(item => (
          <div key={item._id} className="border rounded p-4 shadow">
            <ItemCard item={item} />
            <div className="space-x-2 mt-2">
              <button
                onClick={() => handleApprove(item._id)}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Approve
              </button>
              <button
                onClick={() => handleReject(item._id)}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminPanel;