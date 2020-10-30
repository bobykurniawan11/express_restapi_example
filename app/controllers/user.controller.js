const User = require("../model/user.model.js");
const bcrypt = require("bcryptjs");
const validator = require("email-validator");
require("dotenv").config();

// Create and Save a new User
exports.create = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      status: false,
      message: "Content can not be empty!!!",
      date: new Date(),
    });
    return;
  }

  if (!validator.validate(req.body.email)) {
    res.status(400).send({
      status: false,
      message: "Invalid email format",
      date: new Date(),
    });
    return;
  }
  bcrypt.hash(req.body.password.toString(), 10, function (
    err,
    bcryptedPassword
  ) {
    const user = new User({
      email: req.body.email,
      password: bcryptedPassword,
      fullname: req.body.fullname,
      created_date: new Date(),
    });
    User.findByEmail("register", user, (err, data) => {
      if (err) {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the User.",
        });
      } else res.send(data);
    });
  });
};

exports.login = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      status: false,
      message: "Content can not be empty!!!",
      date: new Date(),
    });
    return;
  }
  const user = new User({
    email: req.body.email,
    password: req.body.password,
  });
  User.findByEmail("login", user, (err, data) => {
    if (err) {
      if (err.kind == "not_found") {
        res.status(404).send({
          message: "Email not found",
        });
      }
      res.status(err.status_code || 500).send({
        message: err.kind || "Some error occurred while creating the User.",
      });
    } else res.send(data);
  });
};

exports.change_password = (req, res) => {
  if (
    !req.body ||
    !req.body.email ||
    !req.body.password ||
    !req.body.new_password
  ) {
    res.status(400).send({
      status: false,
      message: "All field are required {email, password, new_password}",
      date: new Date(),
    });
    return;
  }
  bcrypt.hash(req.body.new_password.toString(), 10, function (
    err,
    bcryptedPassword
  ) {
    req.body.new_password = bcryptedPassword;
    User.findByEmail("change_password", req.body, (err, data) => {
      if (err) {
        if (err.kind == "not_found") {
          res.status(404).send({
            message: "Email not found",
          });
        } else {
          res.status(err.status_code || 500).send({
            message: err.kind || "Some error occurred while creating the User.",
          });
        }
      } else res.send(data);
    });
  });
};

exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  User.updateById(req.params.user_id, new User(req.body), (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found User with id ${req.params.customerId}.`,
        });
      } else {
        res.status(500).send({
          message: "Error updating User with id " + req.params.customerId,
        });
      }
    } else res.send(data);
  });
};

exports.delete = (req, res) => {
  User.remove(req.params.user_id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found User with id ${req.params.customerId}.`,
        });
      } else {
        res.status(500).send({
          message: "Could not delete User with id " + req.params.customerId,
        });
      }
    } else res.send({ message: `Customer was deleted successfully!` });
  });
};
