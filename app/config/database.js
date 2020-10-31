require("dotenv").config();
const mysql = require("mysql");

// Create a connection to the database
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

// // open the MySQL connection
// connection.connect(error => {
//   if (error) throw error;
// });

module.exports = connection;
