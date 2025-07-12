import { Link } from 'react-router-dom';
import Carousel from '../components/Carousel';

function LandingPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-4">Welcome to ReWear Platform</h1>
      <p className="text-lg text-center mb-8">
        ReWear items, earn points, and connect with others! Start swapping today.
      </p>
      <div className="flex justify-center space-x-4 mb-8">
        <Link to="/swaps" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Start Swapping
        </Link>
        <Link to="/items" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Browse Items
        </Link>
        <Link to="/add-item" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          List an Item
        </Link>
      </div>
      <h2 className="text-2xl font-semibold text-center mb-4">Featured Items</h2>
      <Carousel />
    </div>
  );
}

export default LandingPage;