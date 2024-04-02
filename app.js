require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./db/mongoDb");

//Connect to MongoDB
connectDB();
//Middlewares
const app = express();
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

//Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
