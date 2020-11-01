const UserFriendRequest = require("../model/user_Friend_request.model.js");

require("dotenv").config();

exports.add_friend = (req, res) => {
  if (!req.body || !req.body.user_id || !req.body.friend_id) {
    res.status(400).send({
      message: "Content can not be empty!!!",
    });
    return;
  }

  if (req.body.user_id == req.body.friend_id) {
    res.status(400).send({
      message: "You can't add your self",
    });
    return;
  }

  const friend_request_data = new UserFriendRequest({
    user_id: req.body.user_id,
    friend_id: req.body.friend_id,
    created_date: new Date(),
  });
  UserFriendRequest.create(friend_request_data, (err, data) => {
    if (err) {
      if (err.status_code != null) {
        res.status(err.status_code).send({
          message: err.message,
        });
      } else {
        res.status(500).send({
          message: err.message || "Some error occurred while adding friend.",
        });
      }
    } else res.send(data);
  });
};

exports.get_friend_request = (req, res) => {
  if (!req.body || !req.body.user_id) {
    res.status(400).send({
      message: "Content can not be empty!!!",
    });
    return;
  }

  UserFriendRequest.get_friend_request(req.body.user_id, (err, data) => {
    if (err) {
      if (err.status_code != null) {
        res.status(err.status_code).send({
          message: err.message,
        });
      } else {
        res.status(500).send({
          message:
            err.message || "Some error occurred while fetching friend request.",
        });
      }
    } else res.send(data);
  });
};

exports.accept_friend_request = (req, res) => {
  if (!req.body || !req.body.user_id) {
    res.status(400).send({
      message: "Content can not be empty!!!",
    });
    return;
  }

  const friend_request_data = new UserFriendRequest({
    user_id: req.body.user_id,
    friend_id: req.body.friend_id,
  });

  UserFriendRequest.accept_friend_request(req.body, (err, data) => {
    if (err) {
      if (err.status_code != null) {
        res.status(err.status_code).send({
          message: err.message,
        });
      } else {
        res.status(500).send({
          message:
            err.message || "Some error occurred while fetching friend request.",
        });
      }
    } else res.send(data);
  });
};

exports.get_friend = (req, res) => {
  if (!req.body || !req.params.user_id) {
    res.status(400).send({
      message: "Content can not be empty!!!",
    });
    return;
  }

  UserFriendRequest.get_friend(req.params.user_id, (err, data) => {
    if (err) {
      if (err.status_code != null) {
        res.status(err.status_code).send({
          message: err.message,
        });
      } else {
        res.status(500).send({
          message:
            err.message || "Some error occurred while fetching friend request.",
        });
      }
    } else res.send(data);
  });
};

exports.delete_friend = (req, res) => {
  if (!req.body || !req.params.user_id) {
    res.status(400).send({
      message: "Content can not be empty!!!",
    });
    return;
  }

  UserFriendRequest.delete_friend(req.params.user_id, (err, data) => {
    if (err) {
      if (err.status_code != null) {
        res.status(err.status_code).send({
          message: err.message,
        });
      } else {
        res.status(500).send({
          message:
            err.message || "Some error occurred while fetching friend request.",
        });
      }
    } else res.send(data);
  });
};
