var express = require('express');
const session = require('express-session');
var router = express.Router();
var db = require('../db');

// GET login page.
router.get('/', function (req, res, next) {
  res.render("login", { session: req.session });
});

//POST form data for login
router.post('/loginForm', function (req, res) {
  var mail = req.body.mail;
  var password = req.body.password;

  var sql = `SELECT UserID, isAdmin FROM Users WHERE Email = '${mail}' AND HPassword = '${password}'`;
  // QUERY DB
  db.query(sql, function (err, result, fields) {
    if (err) throw err;

    //Login Successfull, redirect to home page
    if (result.length > 0) {

      req.session.userid = result[0].UserID;
      if (result[0].isAdmin) {
        req.session.isAdmin = true;
      } else {
        req.session.isAdmin = false;
      }

      res.redirect('/');
    }
    //Login falied, reload page
    else {
      var url = encodeURIComponent('notExist');
      res.redirect('/login?login=' + url);
    }
    res.end();
  });

});

module.exports = router;
