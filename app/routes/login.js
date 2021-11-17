var express = require('express');
var router = express.Router();
var db=require('../db');



router.post('/loginForm', function(req, res){  
    var mail = req.body.mail;
    var password = req.body.password;
    
    console.log("loginRA"); //weird log
  
    //var sql = `INSERT INTO Users (Fname, Lname, HPassword, Email, HomeAddress) VALUES ('${fName}', '${lName}', '${password}', '${mail}', '${address}')`;
    var sql = `SELECT * FROM Users WHERE Email = '${mail}' AND HPassword = '${password}'`;
    // QUERY DB
    db.query(sql, function (err, result, fields) {
      if (err) throw err;

      if (result.length > 0){
        console.log("home");
        res.redirect('/');
      } 
      else {
        console.log("did not login");
        res.redirect('/login');
      }
      res.end();
    });
  });


/* GET users listing. */
router.get('/', function(req, res, next) {
  
    res.render("login");
});

module.exports = router;
