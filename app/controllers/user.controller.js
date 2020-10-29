const User = require("../model/user.model.js");

// Create and Save a new User
exports.create = (req, res) => {
    if (!req.body) {
      res.status(400).send({
        status:false,
        message: "Content can not be empty!!!",
        date:new Date()
      });
      return;
    }
    console.log(req.body.email);

    const user = new User({
      email: req.body.email,
      password: req.body.password,
      created_date:new Date()
    });


    User.create(user, (err, data) => {
      if (err)
        {

        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the User."
        });
      }
      else res.send(data);
    });
  };