const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const users = require("./app/controllers/user.controller.js");
const user_friend_request = require("./app/controllers/user_friend_request.controller.js");

app.get("/", (req, res) => {
  res.json({ message: "IT IS WORKING." });
});

app.post("/users", users.create);
app.post("/users/login", users.login);
app.post("/users/change_password", authenticateToken, users.change_password);
app.post("/users/forget_password", users.change_password);
app.put("/users/:user_id", authenticateToken, users.update);
app.delete("/users/:user_id", authenticateToken, users.delete);

//USER FRIEND
app.post(
  "/user_friend_request",
  authenticateToken,
  user_friend_request.add_friend
);
app.get(
  "/user_friend_request",
  authenticateToken,
  user_friend_request.get_friend_request
);

app.get(
  "/user_friend/:user_id",
  authenticateToken,
  user_friend_request.get_friend
);

app.post(
  "/accept_friend_request",
  authenticateToken,
  user_friend_request.accept_friend_request
);

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

module.exports = app;
