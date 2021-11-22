var express = require('express');
var router = express.Router();
var db=require('../db'); // GET ACCESS TO DB

// GET settings page. 
router.get('/', function(req, res, next) {
    //No userid redirect to home page
    if(!req.session.userid){
        res.redirect('/');
        return;
    }

    var sql = `SELECT * FROM Users WHERE UserID=${req.session.userid}`;
    db.query(sql, function (err, result) {
        if (err) throw err;
        res.render("settings", { UserInfo: result, session: req.session });
    });
});

//Post/Resister User info to the datbase
router.post('/settingsForm', function(req, res){  
    //Get data from the form  
    var fName = req.body.fName; 
    var lName = req.body.lName;
    var password = req.body.password;
    var address = req.body.address;
  
    var sql = `UPDATE Users SET Fname = '${fName}', Lname = '${lName}', HPassword = '${password}', HomeAddress = '${address}' WHERE UserID = ${req.session.userid}`;
    // QUERY DB
    db.query(sql, function (err, result) {
      if (err) throw err;
      console.log("Record updated"); //For debug
  
      res.redirect('/settings');
      res.end();
    });
  });

module.exports = router;