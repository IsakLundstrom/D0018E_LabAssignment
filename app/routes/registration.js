var express = require('express');
var router = express.Router();
var db=require('../db');

// function getDB(sql) {
//     db.query(sql, function (err, result) {
//         if (err) throw err;
//         console.log("result");
//         callback(null, result)
//     });

// }

/*Post/Resister User info to the datbase*/ 
router.post('/usersForm', function(req, res){  
    var fName = req.body.fName; //Get data from the form  
    var lName = req.body.lName;
    var password = req.body.password;
    var mail = req.body.mail;
    var address = req.body.address;
    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"); //weird log
  
    //var sql = `INSERT INTO customers (name, address) VALUES ('Company Inc', '${myText}')`;
    var sql = `INSERT INTO Users (Fname, Lname, HPassword, Email, HomeAddress) VALUES ('${fName}', '${lName}', '${password}', '${mail}', '${address}')`;
    // QUERY DB
    db.query(sql, function (err, result) {
      if (err) throw err;
      console.log("1 record inserted");
  
      res.redirect('/registration');
      res.end();
    });
  });

router.get('/', function(req, res, next) {
    var sql = `SELECT * FROM Users`;
    db.query(sql, function (err, result) {
        if (err) throw err;
        
        res.render("registration", { UsersTable: result });

    });
    //console.log(getDB("SELECT * FROM customers"));

    // db.query("SELECT * FROM customers", function (err, result) {
    //     if (err) throw err;
    //     console.log(result);
        
    // });
});




module.exports = router;