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

router.get('/', function(req, res, next) {
    var sql = `SELECT * FROM Users`;
    db.query(sql, function (err, result) {
        if (err) throw err;
        
        res.render("manageUsers", { UsersTable: result });

    });
    //console.log(getDB("SELECT * FROM customers"));

    // db.query("SELECT * FROM customers", function (err, result) {
    //     if (err) throw err;
    //     console.log(result);
        
    // });
});

/*GET Users info from form*/ 
router.get('/UsersForm', function(req, res){  
    var fName = req.query.fName; //mytext is the name of your input box   
    var lName = req.query.lName;
    var password = req.query.password;
    var mail = req.query.mail;
    var address = req.query.address;

    //var sql = `INSERT INTO customers (name, address) VALUES ('Company Inc', '${myText}')`;
    var sql = `INSERT INTO Users (Fname, Lname, HPassword, Email, HomeAddress) VALUES ('${fName}', '${lName}', '${password}', '${mail}', '${address}')`;
    // QUERY DB
    db.query(sql, function (err, result) {
      if (err) throw err;
      console.log("1 record inserted");

    //   res.render("manageUsers");
  });
});




module.exports = router;