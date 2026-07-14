const mongoose = require('mongoose');

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

module.exports = mongoose.model('Task', taskSchema);
