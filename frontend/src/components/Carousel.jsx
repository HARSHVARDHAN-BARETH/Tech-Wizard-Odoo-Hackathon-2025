import { useState, useEffect } from 'react';
import axios from 'axios';
import ItemCard from './ItemCard';
import { toast } from 'react-toastify';

function Carousel() {
  const [items, setItems] = useState([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL;
    console.log('API URL:', apiUrl); // Debug: Log the API URL

    if (!apiUrl) {
      toast.error('API URL is not defined in .env');
      return;
    }

    axios
      .get(`${apiUrl}/items`)
      .then((res) => {
        setItems(res.data);
      })
      .catch((err) => {
        console.error('Error fetching items:', err);
        toast.error(err.response?.data.message || 'Error fetching featured items');
      });
  }, []);

  const next = () => setCurrent((current + 1) % items.length);
  const prev = () => setCurrent((current - 1 + items.length) % items.length);

  if (!items.length) {
    return <div className="text-center p-4">Loading featured items...</div>;
  }

  return (
    <div className="relative">
      <div className="flex justify-center">
        <ItemCard item={items[current]} />
      </div>
      <button
        onClick={prev}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
      >
        Prev
      </button>
      <button
        onClick={next}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
      >
        Next
      </button>
    </div>
  );
}

export default Carousel;