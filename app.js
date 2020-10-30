const express = require("express");
const jwt = require('jsonwebtoken');

const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const users = require("./app/controllers/user.controller");

app.get("/", (req, res) => {
  res.json({ message: "IT IS WORKING." });
});


app.post("/users", users.create);
app.post("/users/login", users.login);
app.post('/users/change_password',authenticateToken, users.change_password);
app.post('/users/forget_password', users.forget_password);


// set port, listen for requests
app.listen(3000, () => {
  console.log("Server is running on port 3000.");
}); 


function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    console.log(err)
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}



