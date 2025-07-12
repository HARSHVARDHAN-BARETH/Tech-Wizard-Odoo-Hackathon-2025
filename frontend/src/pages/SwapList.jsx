import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

function SwapList() {
  const { user } = useContext(AuthContext);
  const [swaps, setSwaps] = useState([]);

  useEffect(() => {
    if (user) {
      axios
        .get(`${import.meta.env.VITE_API_URL}/swaps`, {
          headers: { Authorization: `Bearer ${user.token}` },
        })
        .then((res) => setSwaps(res.data))
        .catch((err) => toast.error(err.response?.data.message || 'Error fetching swaps'));
    }
  }, [user]);

  const handleUpdateStatus = async (swapId, status) => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/swaps/${swapId}`,
        { status },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      toast.success(`Swap ${status}!`);
      setSwaps(swaps.map((swap) => (swap._id === swapId ? { ...swap, status } : swap)));
    } catch (error) {
      toast.error(error.response?.data.message || 'Error updating swap');
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto p-4">
        <p className="text-red-600">Please <Link to="/login" className="text-blue-600 hover:underline">login</Link> to view your swaps.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Your Swaps</h2>
      {swaps.length === 0 ? (
        <p className="text-gray-600">No swaps found.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {swaps.map((swap) => (
            <div key={swap._id} className="border rounded-lg p-4 shadow-md">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">Requested Item</h3>
                  <Link to={`/items/${swap.itemRequested._id}`} className="text-blue-600 hover:underline">
                    {swap.itemRequested.title}
                  </Link>
                  <img
                    src={swap.itemRequested.images[0] || '/placeholder.png'}
                    alt={swap.itemRequested.title}
                    className="w-32 h-32 object-cover rounded mt-2"
                  />
                </div>
                {swap.itemOffered && (
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">Offered Item</h3>
                    <Link to={`/items/${swap.itemOffered._id}`} className="text-blue-600 hover:underline">
                      {swap.itemOffered.title}
                    </Link>
                    <img
                      src={swap.itemOffered.images[0] || '/placeholder.png'}
                      alt={swap.itemOffered.title}
                      className="w-32 h-32 object-cover rounded mt-2"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-gray-600">Status: <span className="capitalize">{swap.status}</span></p>
                  <p className="text-gray-600">Requester: {swap.requester.username}</p>
                  {swap.itemRequested.uploader._id === user.id && swap.status === 'pending' && (
                    <div className="space-x-2 mt-4">
                      <button
                        onClick={() => handleUpdateStatus(swap._id, 'accepted')}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(swap._id, 'rejected')}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                  {swap.itemRequested.uploader._id === user.id && swap.status === 'accepted' && (
                    <button
                      onClick={() => handleUpdateStatus(swap._id, 'completed')}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-4"
                    >
                      Mark as Completed
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SwapList;