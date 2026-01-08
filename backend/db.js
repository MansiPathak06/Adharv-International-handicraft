const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',        // Put your password
  database: 'anushka_handcraft' // Your DB name
});

module.exports = db;
