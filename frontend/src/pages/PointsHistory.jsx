import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

function PointsHistory() {
  const { user } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    if (user) {
      axios.get(`${import.meta.env.VITE_API_URL}/points/history`, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
        .then(res => setTransactions(res.data))
        .catch(err => toast.error(err.response?.data.message || 'Error fetching points history'));
    }
  }, [user]);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Points History</h2>
      <div className="space-y-4">
        {transactions.map(transaction => (
          <div key={transaction._id} className="border p-4 rounded shadow">
            <p>Points: {transaction.points > 0 ? `+${transaction.points}` : transaction.points}</p>
            <p>Type: {transaction.type}</p>
            <p>Description: {transaction.description}</p>
            <p>Date: {new Date(transaction.createdAt).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PointsHistory;