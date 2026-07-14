const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smart-task-tracker';
const PORT = process.env.PORT || 5000;

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    type: { type: String, enum: ['Task', 'Habit'], required: true },
    completed: { type: Boolean, default: false },
    author: { type: String, default: 'demo-user' },
    createdAt: { type: Date, default: Date.now }
  },
  { versionKey: false }
);

const Task = mongoose.model('Task', taskSchema);

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

app.get('/api/tasks', async (req, res) => {
  try {
    const { author = 'demo-user' } = req.query;
    const tasks = await Task.find({ author }).sort({ createdAt: -1 });
    return res.status(200).json(tasks);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.post('/api/tasks', async (req, res) => {
  try {
    const { title, type, completed = false, author = 'demo-user' } = req.body;

    if (!title || !type) {
      return res.status(400).json({ message: 'Title and type are required.' });
    }

    const task = await Task.create({ title, type, completed, author });
    return res.status(201).json(task);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

app.put('/api/tasks/:id', async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    return res.status(200).json(updatedTask);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);

    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    return res.status(200).json({ message: 'Task deleted successfully.', id: req.params.id });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

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