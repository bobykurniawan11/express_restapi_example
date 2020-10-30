const sql = require("../config/database");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

// constructor
const User = function(user) {
  this.email = user.email;
  this.password = user.password;
  this.created_date = user.created_date;
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

User.findByEmail = (userData, result) => {
  sql.query(`SELECT * FROM users WHERE email = "`+userData.email+`"`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    if (res.length) {
      bcrypt.compare(userData.password.toString(), res[0].password, function(err, hash_status) {
        if(hash_status) {
          const accessToken = jwt.sign({ username: userData.email}, process.env.TOKEN_SECRET);
          result(null, { token: accessToken, ...userData });
          return;
        } else {
          result({ kind: "Password incorrect !!!",status_code: 401 }, null);
          return;
        } 
      });
    
    }else{
      result({ kind: "not_found" }, 401);

    }
  });
};

User.change_password = (userData, result) => {
  sql.query(`SELECT * FROM users WHERE email = "`+userData.email+`"`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    if (res.length) {
      bcrypt.compare(userData.password.toString(), res[0].password, function(err, hash_status) {
        if(hash_status) {
          sql.query(`UPDATE users set password ="`+userData.new_password+`" where email = "` +userData.email+ `" `,(err,res) => {
            if (err) {
              console.log("error: ", err);
              result(err, null);
              return;
            }
            result(null, { ...userData });
          });
          return;
        } else {
          result({ kind: "Password incorrect !!!",status_code: 401 }, null);
          return;
        } 
      });
    
    }else{
      result({ kind: "not_found" }, 401);
    }
  });
};

module.exports = User;