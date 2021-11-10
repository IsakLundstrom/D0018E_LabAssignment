const mysql = require('mysql');

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "mydb" // ÄNDRA TILL RÄTT DB
});

db.connect(err => {
  if(err) throw err;
  console.log("DB connected")
});

module.exports = db;