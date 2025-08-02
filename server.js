const express = require('express');
const cors = require('cors');
const locationsRouter = require('./routes/Locations.js'); 
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth.js');
const cookieParser = require('cookie-parser');

dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());

app.use('/uploads', express.static('uploads'));
app.use('/Locations', locationsRouter);
app.use('/api/auth', authRoutes);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.listen(4000, () => {
  console.log('REST API running at http://localhost:4000');
});
