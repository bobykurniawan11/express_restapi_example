const sql = require("../config/database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserFriendRequest = function (user_friend_requests) {
  this.user_id = user_friend_requests.user_id;
  this.friend_id = user_friend_requests.friend_id;
  this.created_date = user_friend_requests.created_date;
  this.modified_date = user_friend_requests.modified_date;
};

UserFriendRequest.create = (user_friend_requests, result) => {
  sql.query(
    "INSERT INTO user_friend_requests SET ?",
    user_friend_requests,
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      }
      result(null, { id: res.insertId, ...user_friend_requests });
    }
  );
};

UserFriendRequest.get_friend_request = (user_id, result) => {
  sql.query(
    `SELECT a.user_id as request_from,b.fullname FROM user_friend_requests a inner join users b on a.user_id = b.user_id WHERE friend_id = "` +
      user_id +
      `"`,
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      }
      result(null, { friend_request_data: res, data_count: res.length });
    }
  );
};

UserFriendRequest.get_friend = (user_id, result) => {
  sql.query(
    `SELECT a.user_id as request_from,b.fullname FROM user_friends a inner join users b on a.user_id = b.user_id WHERE friend_id = "` +
      user_id +
      `"`,
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      }
      result(null, { friend_request_data: res, data_count: res.length });
    }
  );
};

UserFriendRequest.accept_friend_request = (user_friend_requests, result) => {
  let current_date = new Date();
  sql.query(
    ` SELECT * FROM user_friend_requests WHERE friend_id = "` +
      user_friend_requests.friend_id +
      `" and user_id = "` +
      user_friend_requests.user_id +
      `" `,
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      }

      sql.query(
        `INSERT INTO user_friends (user_id, friend_id, created_date) values ("` +
          res[0].user_id +
          `","` +
          res[0].friend_id +
          `","` +
          current_date +
          `")  `
      );

      sql.query(
        `INSERT INTO user_friends (user_id, friend_id, created_date) values ("` +
          res[0].friend_id +
          `","` +
          res[0].user_id +
          `","` +
          current_date +
          `")  `
      );

      sql.query(
        `DELETE FROM user_friend_requests where friend_id = "` +
          user_friend_requests.friend_id +
          `" and user_id = "` +
          user_friend_requests.user_id +
          `" `
      );

      result(null, { friend_request_data: res[0] });
    }
  );
};

module.exports = UserFriendRequest;
