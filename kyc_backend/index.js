require('dotenv').config();
const express = require('express');
const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('FinTrust local server is running');
});

const PORT = process.env.PORT;
app.listen(PORT);
