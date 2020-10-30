const sql = require("../config/database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// constructor
const User = function (user) {
  this.email = user.email;
  this.password = user.password;
  this.fullname = user.fullname;
  this.created_date = user.created_date;
};

User.findByEmail = (type, userData, result) => {
  sql.query(
    `SELECT * FROM users WHERE email = "` + userData.email + `"`,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (type == "register") {
        if (res.length > 0) {
          result({ message: "Email already used !!!", status_code: 401 }, null);
        } else {
          User.create(userData, result);
        }
      } else if (type == "login") {
        User.login(userData, res, result);
      } else if (type == "change_password") {
        User.change_password(userData, res, result);
      } else if (type == "update_profile") {
        User.update_profile(userData, res, result);
      }
    }
  );
};

User.create = (newUser, result) => {
  sql.query("INSERT INTO users SET ?", newUser, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    console.log("created user: ", { id: res.insertId, ...newUser });
    result(null, { id: res.insertId, ...newUser });
  });
};

User.login = (data, res, result) => {
  if (res.length) {
    bcrypt.compare(data.password.toString(), res[0].password, function (
      err,
      hash_status
    ) {
      if (hash_status) {
        const accessToken = jwt.sign(
          { username: data.email },
          process.env.TOKEN_SECRET,
          { expiresIn: "60m" }
        );
        result(null, { token: accessToken, ...data });
        return;
      } else {
        result({ kind: "Password incorrect !!!", status_code: 401 }, null);
        return;
      }
    });
  } else {
    result({ kind: "not_found" }, null);
  }
};

User.change_password = (userData, res, result) => {
  if (res.length) {
    bcrypt.compare(userData.password.toString(), res[0].password, function (
      err,
      hash_status
    ) {
      if (hash_status) {
        sql.query(
          `UPDATE users set password ="` +
            userData.new_password +
            `" where email = "` +
            userData.email +
            `" `,
          (err, res) => {
            if (err) {
              console.log("error: ", err);
              result(err, null);
              return;
            }
            result(null, { ...userData });
          }
        );
        return;
      } else {
        result({ kind: "Password incorrect !!!", status_code: 401 }, null);
        return;
      }
    });
  } else {
    result({ kind: "not_found" }, null);
  }
};

User.updateById = (id, user, result) => {
  sql.query(
    "UPDATE users SET fullname = ? WHERE user_id = ?",
    [user.fullname, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
      if (res.affectedRows == 0) {
        result({ kind: "not_found" }, null);
        return;
      }
      result(null, { id: id, ...user });
    }
  );
};

User.remove = (id, result) => {
  sql.query("DELETE FROM user WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted user with id: ", id);
    result(null, res);
  });
};

module.exports = User;
