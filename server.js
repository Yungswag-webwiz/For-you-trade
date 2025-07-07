const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const tradeRoutes = require('./routes/trade');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/trading-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use('/api/auth', authRoutes);
app.use('/api/trade', tradeRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
