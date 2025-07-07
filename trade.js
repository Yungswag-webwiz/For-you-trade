const express = require('express');
const User = require('../models/User');
const router = express.Router();

router.post('/', async (req, res) => {
  const { username, action, amount } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(404).json({ msg: 'User not found' });

  if (action === 'buy' && user.balance >= amount) {
    user.balance -= amount;
    user.trades.push({ action, amount, time: Date.now() });
  } else if (action === 'sell') {
    user.balance += amount;
    user.trades.push({ action, amount, time: Date.now() });
  } else {
    return res.status(400).json({ msg: 'Insufficient balance' });
  }

  await user.save();
  res.json({ msg: 'Trade successful', balance: user.balance });
});

module.exports = router;
