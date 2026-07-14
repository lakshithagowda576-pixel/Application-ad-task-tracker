const mongoose = require('mongoose');

const itemSchema = mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    company: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Interviewing', 'Offered', 'Rejected'], default: 'Pending' },
    notes: { type: String },
    dueDate: { type: Date }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Item', itemSchema);