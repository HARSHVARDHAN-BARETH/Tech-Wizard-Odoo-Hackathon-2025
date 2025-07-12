import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

function ItemDetail() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [item, setItem] = useState(null);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/items/${id}`)
      .then(res => setItem(res.data))
      .catch(err => toast.error(err.response?.data.message || 'Error fetching item'));
  }, [id]);

  const handleSwapRequest = async () => {
    if (!user) {
      toast.error('Please login to request a swap');
      return navigate('/login');
    }
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/swaps`,
        { itemRequested: id },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      toast.success('Swap request sent!');
    } catch (error) {
      toast.error(error.response?.data.message || 'Error sending swap request');
    }
  };

  const handleRedeem = async () => {
    if (!user) {
      toast.error('Please login to redeem');
      return navigate('/login');
    }
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/points/redeem`,
        { itemId: id },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      toast.success('Item redeemed!');
      navigate('/points-history');
    } catch (error) {
      toast.error(error.response?.data.message || 'Error redeeming item');
    }
  };

  if (!item) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">{item.title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          {item.images.length > 0 ? (
            <div className="grid grid-cols-2 gap-2">
              {item.images.map((img, index) => (
                <img key={index} src={img} alt={item.title} className="w-full h-48 object-cover rounded" />
              ))}
            </div>
          ) : (
            <img src="/placeholder.png" alt="No image" className="w-full h-48 object-cover rounded" />
          )}
        </div>
        <div>
          <p>{item.description}</p>
          <p className="text-gray-600">Category: {item.category}</p>
          <p className="text-gray-600">Type: {item.type}</p>
          <p className="text-gray-600">Size: {item.size || 'N/A'}</p>
          <p className="text-gray-600">Condition: {item.condition}</p>
          <p className="text-gray-600">Uploader: {item.uploader.username}</p>
          <p className="text-gray-600">Status: {item.availability ? 'Available' : 'Unavailable'}</p>
          {item.availability && (
            <div className="space-x-2 mt-4">
              <button
                onClick={handleSwapRequest}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Request Swap
              </button>
              <button
                onClick={handleRedeem}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Redeem with Points
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ItemDetail;