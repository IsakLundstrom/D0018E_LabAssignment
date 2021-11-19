var express = require('express');
var router = express.Router();
var db=require('../db');

// GET login page.
router.get('/', function(req, res, next) {
  res.render("login");
});

//POST form data for login
router.post('/loginForm', function(req, res){  
    var mail = req.body.mail;
    var password = req.body.password;
  
    var sql = `SELECT * FROM Users WHERE Email = '${mail}' AND HPassword = '${password}'`;
    // QUERY DB
    db.query(sql, function (err, result, fields) {
      if (err) throw err;

      //Login Successfull, redirect to home page
      if (result.length > 0){
        console.log("Successfull Login");
        req.session.userid = result[0].UserID;
        //console.log(req.session);
        res.redirect('/');
      } 
      //Login falied, reload page
      else {
        console.log("did not login");
        var url = encodeURIComponent('fail');
        res.redirect('/login/?valid=' + url);
      }
      res.end();
    });
  });

module.exports = router;
