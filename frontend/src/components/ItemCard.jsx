import { Link } from 'react-router-dom';

function ItemCard({ item }) {
  return (
    <div className="border rounded-lg p-4 shadow-md hover:shadow-lg">
      <img
        src={item.images[0] || '/placeholder.png'}
        alt={item.title}
        className="w-full h-48 object-cover rounded-md"
      />
      <h3 className="text-lg font-semibold mt-2">{item.title}</h3>
      <p className="text-gray-600">{item.description.slice(0, 100)}...</p>
      <p className="text-sm text-gray-500">Condition: {item.condition}</p>
      <Link to={`/items/${item._id}`} className="text-blue-500 hover:underline mt-2 block">
        View Details
      </Link>
    </div>
  );
}


export default ItemCard;