require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./app/routes/auth');
const noteRoutes = require('./app/routes/notes');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.json({ message: 'Notes API cholche' }));
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);

// 404
app.use((req, res) => res.status(404).json({ message: 'Route paoa jayni' }));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Server e somossha hoyeche' });
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });
