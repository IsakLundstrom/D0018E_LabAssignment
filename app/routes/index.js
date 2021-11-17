var express = require('express');
var router = express.Router();
var db=require('../db'); // GET ACCESS TO DB

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/*GET Users info from form*/ 
router.get('/usersForm', function(req, res){  
  var fName = req.query.fName; //mytext is the name of your input box   
  var lName = req.query.lName;
  var password = req.query.password;
  var mail = req.query.mail;
  var address = req.query.address;
  //console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");

  //var sql = `INSERT INTO customers (name, address) VALUES ('Company Inc', '${myText}')`;
  var sql = `INSERT INTO Users (Fname, Lname, HPassword, Email, HomeAddress) VALUES ('${fName}', '${lName}', '${password}', '${mail}', '${address}')`;
  // QUERY DB
  db.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");

    res.redirect('/manageUsers');
  });
});


/*GET info from DB*/ 
router.get('/sel', function(req, res){
  //var myText = req.query.sel;
  // var sql = `SELECT address FROM customers WHERE address = '${myText}'`;
  var sql = `SELECT * FROM Users`;
  // QUERY DB
  db.query(sql, function (err, result) {
    if (err) throw err;
    //console.log(result[0].address);
    res.render("test", { UsersTable: result });
  });
});

module.exports = router;
