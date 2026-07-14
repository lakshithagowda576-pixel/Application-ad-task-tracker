const Item = require('../models/Item');

// Get all items for logged in user
const getItems = async (req, res) => {
  try {
    const items = await Item.find({ userId: req.user.id });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create Item
const createItem = async (req, res) => {
  const { title, company, status, notes, dueDate } = req.body;
  try {
    const item = await Item.create({
      userId: req.user.id,
      title,
      company,
      status,
      notes,
      dueDate
    });
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update Item
const updateItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item || item.userId.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Item not found or unauthorized' });
    }
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete Item
const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item || item.userId.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Item not found or unauthorized' });
    }
    await item.deleteOne();
    res.status(200).json({ id: req.params.id, message: 'Item removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getItems, createItem, updateItem, deleteItem };