const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const net = require('net');
const taskRoutes = require('./routes/taskRoutes');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smart-task-tracker';
const PORT = Number(process.env.PORT || 5000);

function getAvailablePort(startPort) {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        resolve(getAvailablePort(startPort + 1));
      } else {
        reject(error);
      }
    });
    server.once('listening', () => {
      const address = server.address();
      server.close(() => resolve(address.port));
    });
    server.listen(startPort, '127.0.0.1');
  });
}

async function startServer() {
  const port = await getAvailablePort(PORT);
  app.listen(port, '0.0.0.0', () => {
    console.log(`Smart Task Tracker API running on port ${port}`);
    if (process.env.NODE_ENV !== 'test') {
      console.log(`Backend ready on http://127.0.0.1:${port}`);
    }
  });
}

app.get('/', (_req, res) => {
  res.json({ message: 'Smart Task Tracker API', version: '1.0.0', endpoints: { health: '/api/health', tasks: '/api/tasks', login: '/api/auth/login' } });
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Smart Task Tracker API is running' });
});

app.post('/api/auth/login', (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(200).json({ success: false, message: 'Username and password are required.' });
    }

    if (password !== 'password') {
      return res.status(200).json({ success: false, message: 'Invalid password. Use password to continue.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      user: { username, role: 'user' }
    });
  } catch (error) {
    return res.status(200).json({ success: false, message: error.message });
  }
});

app.use('/api/tasks', taskRoutes);

mongoose
  .connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 })
  .then(() => {
    startServer();
  })
  .catch((error) => {
    console.error('MongoDB connection failed:', error.message);
    startServer();
  });