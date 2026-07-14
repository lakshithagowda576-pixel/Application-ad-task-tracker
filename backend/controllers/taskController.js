const mongoose = require('mongoose');
const Task = require('../models/Task');

let memoryTasks = [];

const toResponseTask = (task) => ({
  ...task,
  id: task._id ? task._id.toString() : task.id,
  _id: task._id ? task._id.toString() : task.id,
  createdAt: task.createdAt || new Date().toISOString()
});

const getTasks = async (req, res) => {
  try {
    const author = req.query.author || 'demo-user';

    if (mongoose.connection.readyState === 1) {
      const tasks = await Task.find({ author }).sort({ createdAt: -1 });
      return res.status(200).json(tasks.map(toResponseTask));
    }

    const tasks = memoryTasks.filter((task) => task.author === author);
    return res.status(200).json(tasks.map(toResponseTask));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const createTask = async (req, res) => {
  try {
    const { title, type, completed = false, author = 'demo-user' } = req.body;

    if (!title || !type) {
      return res.status(400).json({ message: 'Title and type are required.' });
    }

    if (mongoose.connection.readyState === 1) {
      const task = await Task.create({ title, type, completed, author });
      return res.status(201).json(toResponseTask(task));
    }

    const task = {
      id: `${Date.now()}`,
      title,
      type,
      completed,
      author,
      createdAt: new Date().toISOString()
    };
    memoryTasks.unshift(task);
    return res.status(201).json(toResponseTask(task));
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
      });

      if (!updatedTask) {
        return res.status(404).json({ message: 'Task not found.' });
      }

      return res.status(200).json(toResponseTask(updatedTask));
    }

    const index = memoryTasks.findIndex((task) => task.id === req.params.id || task._id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    memoryTasks[index] = { ...memoryTasks[index], ...req.body };
    return res.status(200).json(toResponseTask(memoryTasks[index]));
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const deletedTask = await Task.findByIdAndDelete(req.params.id);

      if (!deletedTask) {
        return res.status(404).json({ message: 'Task not found.' });
      }

      return res.status(200).json({ message: 'Task deleted successfully.', id: req.params.id });
    }

    const index = memoryTasks.findIndex((task) => task.id === req.params.id || task._id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    memoryTasks.splice(index, 1);
    return res.status(200).json({ message: 'Task deleted successfully.', id: req.params.id });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };
