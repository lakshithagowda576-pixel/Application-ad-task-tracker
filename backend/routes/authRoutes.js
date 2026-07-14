const express = require('express');
const router = express.Router();

router.post('/register', (req, res) => {
  res.status(201).json({ message: 'Register endpoint ready' });
});

router.post('/login', (req, res) => {
  res.status(200).json({ message: 'Login endpoint ready' });
});

module.exports = router;
