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
      console.log("Successfull Login");
      req.session.userid = result[0].UserID;
      if (result[0].isAdmin) {
        req.session.isAdmin = true;
      } else {
        req.session.isAdmin = false;
      }


      //req.session.isAdmin = false;


      //isAdmin Check
      // sql = `SELECT * FROM Admins WHERE Admins.UserID = '${result[0].UserID}'`;
      // db.query(sql, function (err, result, fields) {
      //   if (err) throw err;

      //   if (result.length > 0){
      //     req.session.isAdmin = true;
      //     console.log("Admin Login");
      //   } else {
      //     req.session.isAdmin = false;
      //     console.log("NOT Admin Login");
      //   }
      //   console.log("ADmin");
      //   console.log(req.session);

      //   
      // });

      console.log("LOgin");
      console.log(req.session);
      res.redirect('/');
    }
    //Login falied, reload page
    else {
      console.log("did not login");
      var url = encodeURIComponent('notExist');
      res.redirect('/login?login=' + url);
    }
    res.end();
  });

});

module.exports = router;
