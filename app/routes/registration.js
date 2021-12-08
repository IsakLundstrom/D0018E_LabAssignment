var express = require('express');
var router = express.Router();
var db = require('../db');

// GET reg page
router.get('/', function (req, res, next) {
  //TMP show table on website for debugg
  var sql = `SELECT * FROM Users`;
  db.query(sql, function (err, result) {
    if (err) throw err;
    res.render("registration", { UsersTable: result, session: req.session });
  });
});

//Post/Resister User info to the datbase
router.post('/usersForm', function (req, res) {
  //Get data from the form  
  var fName = req.body.fName;
  var lName = req.body.lName;
  var password = req.body.password;
  var mail = req.body.mail;
  var address = req.body.address;

  var sql = `INSERT INTO Users (Fname, Lname, HPassword, Email, HomeAddress) VALUES ('${fName}', '${lName}', '${password}', '${mail}', '${address}')`;
  // QUERY DB
  db.query(sql, function (err, result) {
    if (err) throw err;

    res.redirect('/login');
    res.end();
  });
});





module.exports = router;