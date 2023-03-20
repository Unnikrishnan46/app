const express = require('express');
const db = require('./config/connection');
const userRoutes = require("./routes/user")
const cors = require('cors');




const app = express();

app.use(express.json());
app.use(cors({
  origin: '*'
}));
app.use('/api/auth', userRoutes);

app.get('/', (req, res) => {
  console.log("vannade")
    res.send('Hello World!');
});

app.listen(3000, () => {
    console.log('Server listening on port 3000');
});