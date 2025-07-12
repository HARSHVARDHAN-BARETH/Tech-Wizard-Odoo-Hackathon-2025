const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const itemRoutes = require('./routes/ItemRoutes');
const swapRoutes = require('./routes/swapRoutes');
const pointsRoutes = require('./routes/pointsRoutes');
const adminRoutes = require('./routes/adminRoutes');

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Root Route
app.get('/', (req, res) => {
  res.send('Welcome to the ReWear');
});

// Routes
app.use('/api', userRoutes);
app.use('/api', itemRoutes);
app.use('/api', swapRoutes);
app.use('/api', pointsRoutes);
app.use('/api', adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));