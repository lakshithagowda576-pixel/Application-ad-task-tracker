const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');
const TASKS_FILE = path.join(DATA_DIR, 'tasks.json');

// Ensure data directory exists
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Load tasks from file
function loadTasks() {
  try {
    ensureDataDir();
    if (fs.existsSync(TASKS_FILE)) {
      const data = fs.readFileSync(TASKS_FILE, 'utf8');
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error('Error loading tasks from file:', error.message);
    return [];
  }
}

// Save tasks to file
function saveTasks(tasks) {
  try {
    ensureDataDir();
    fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2), 'utf8');
  } catch (error) {
    console.error('Error saving tasks to file:', error.message);
  }
}

// Initialize tasks in memory from file
let tasks = loadTasks();

// Get all tasks or filter by author
function getTasks(author) {
  if (author) {
    return tasks.filter((task) => task.author === author);
  }
  return tasks;
}

// Add a new task
function createTask(task) {
  const newTask = {
    id: `${Date.now()}`,
    ...task,
    createdAt: new Date().toISOString()
  };
  tasks.unshift(newTask);
  saveTasks(tasks);
  return newTask;
}

// Update an existing task
function updateTask(id, updates) {
  const index = tasks.findIndex((task) => task.id === id || task._id === id);
  if (index === -1) {
    return null;
  }
  tasks[index] = { ...tasks[index], ...updates };
  saveTasks(tasks);
  return tasks[index];
}

// Delete a task
function deleteTask(id) {
  const index = tasks.findIndex((task) => task.id === id || task._id === id);
  if (index === -1) {
    return false;
  }
  tasks.splice(index, 1);
  saveTasks(tasks);
  return true;
}

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  loadTasks,
  saveTasks
};
