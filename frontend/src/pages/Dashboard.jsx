import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import ItemCard from '../components/ItemCard';
import { toast } from 'react-toastify';

function Dashboard() {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState({});
  const [items, setItems] = useState([]);
  const [swaps, setSwaps] = useState([]);

  useEffect(() => {
    if (user) {
      // Fetch profile
      axios.get(`${import.meta.env.VITE_API_URL}/profile`, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
        .then(res => setProfile(res.data.user.profile))
        .catch(err => toast.error(err.response?.data.message || 'Error fetching profile'));

      // Fetch user's items
      axios.get(`${import.meta.env.VITE_API_URL}/items`, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
        .then(res => setItems(res.data.filter(item => item.uploader._id === user.id)))
        .catch(err => toast.error(err.response?.data.message || 'Error fetching items'));

      // Fetch swaps
      axios.get(`${import.meta.env.VITE_API_URL}/swaps`, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
        .then(res => setSwaps(res.data))
        .catch(err => toast.error(err.response?.data.message || 'Error fetching swaps'));
    }
  }, [user]);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-xl font-semibold">Profile</h3>
          <p>Full Name: {profile.fullName || 'Not set'}</p>
          <p>Address: {profile.address || 'Not set'}</p>
          <p>Phone: {profile.phone || 'Not set'}</p>
          <p>Points: {user?.points || 0}</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold">Your Items</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {items.map(item => <ItemCard key={item._id} item={item} />)}
          </div>
        </div>
      </div>
      <h3 className="text-xl font-semibold mt-4">Your Swaps</h3>
      <div className="space-y-2">
        {swaps.map(swap => (
          <div key={swap._id} className="border p-2 rounded">
            <p>Item: {swap.itemRequested.title}</p>
            <p>Status: {swap.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;