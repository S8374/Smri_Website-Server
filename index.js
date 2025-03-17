const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 3000;
const { connect } = require("./connection/dbConnect");
const { routes } = require("./routes/routes");
const cookieParser = require('cookie-parser');

// Middleware
app.use(cors({ 
  origin: [
    'http://localhost:5173',
    'https://smrishop.web.app',
    'https://smrishop.firebaseapp.com'
  ],
   credentials: true }));
app.use(express.json());
app.use(cookieParser());

connect();

// Routes
app.use("/api", routes);

app.get('/', (req, res) => {
  res.send('Smri_Shop World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});