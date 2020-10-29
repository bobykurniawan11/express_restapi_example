const express = require("express");

const app = express();
var morgan = require('morgan');
var passport = require('passport');
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



const users = require("./app/controllers/user.controller");

app.get("/", (req, res) => {
  res.json({ message: "IT IS WORKING." });
});

app.get("/users", (req, res) => {
  res.json({ message: "Will Do" });
});

app.post("/users", users.create);



// set port, listen for requests
app.listen(3000, () => {
  console.log("Server is running on port 3000.");
}); 



