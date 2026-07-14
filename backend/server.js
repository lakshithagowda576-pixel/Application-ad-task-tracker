const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const taskRoutes = require('./routes/taskRoutes');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smart-task-tracker';
const PORT = process.env.PORT || 5000;

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Smart Task Tracker API is running' });
});

app.post('/api/auth/login', (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
    }

    if (password !== 'password') {
      return res.status(401).json({ message: 'Invalid password. Use password to continue.' });
    }

    return res.status(200).json({
      message: 'Login successful',
      user: { username, role: 'user' }
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.use('/api/tasks', taskRoutes);

mongoose
  .connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Smart Task Tracker API running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection failed:', error.message);
    app.listen(PORT, () => {
      console.log(`Server started without MongoDB on port ${PORT}`);
    });
  });