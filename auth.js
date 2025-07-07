const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const userExist = await User.findOne({ username });
  if (userExist) return res.status(400).json({ msg: 'User exists' });
  const hash = await bcrypt.hash(password, 10);
  const newUser = new User({ username, password: hash });
  await newUser.save();
  res.json({ msg: 'Registered successfully' });
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ msg: 'User not found' });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ msg: 'Wrong password' });
  const token = jwt.sign({ id: user._id }, 'secretkey');
  res.json({ token });
});

module.exports = router;
