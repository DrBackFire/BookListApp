const express = require("express");
const path = require("path");
const postBooks = require("./Books");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv/config");

const app = express();

//Getting Data from HTML form
app.use(express.urlencoded({ extended: false }));

// Setting a static folder
app.use(express.static(path.join(__dirname, "public")));

//Body parser
app.use(bodyParser.json());

//Routes & Middleware
app.use("/books", postBooks);

//Connecting to DB
mongoose.connect(
  process.env.DB,
  { useUnifiedTopology: true, useNewUrlParser: true },
  () => console.log("Connected to DB")
);

// Setting a Port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server is running on ${PORT}`));
