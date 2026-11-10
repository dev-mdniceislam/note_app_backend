require('dotenv').config();
const express = require('express');
const connectDB = require('./app/config/db');
const responseHandler = require('./app/middleware/responseHandler');
const errorHandler = require('./app/middleware/errorHandlerMiddleware');
const authRoutes = require('./app/routes/auth');
const noteRoutes = require('./app/routes/notes');

const app = express();

app.use(express.json());
app.use(responseHandler); // res.success() / res.error() ব্যবহারের জন্য আগে লাগবে

app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);

// 404 handler
app.use((req, res) => {
  res.error(404, `Route not found: ${req.originalUrl}`);
});

// সবার শেষে error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
