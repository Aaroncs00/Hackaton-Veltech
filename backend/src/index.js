require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

app.use('/api', require('./routes'));

app.listen(PORT, () => {
  console.log(`API on http://localhost:${PORT}/api`);
});