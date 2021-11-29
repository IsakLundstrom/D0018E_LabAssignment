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

  var sql1 = `SELECT * FROM Users WHERE UserID=${req.session.userid}`;
  db.query(sql1, function (err, result1) {
    if (err) throw err;

    var sql2 = `SELECT * FROM Products;`;
    db.query(sql2, function (err, result2) {
      if (err) throw err;

      var sql3 = `SELECT * FROM Users WHERE UserID != ${req.session.userid};`;
      db.query(sql3, function (err, result3) {
        if (err) throw err;

        res.render("settings", { UserInfo: result1, Products: result2, Users: result3, session: req.session });
      });

    });
    
  });
  
});

//Post/Change User info to the datbase
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

router.get('/deleteAccount', function(req, res){  

  var sql = `DELETE FROM Users WHERE UserID = ${req.session.userid}`;
  // QUERY DB
  db.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Account deleted"); //For debug

    req.session.destroy();
    res.redirect('/');
    res.end();
  });
});

router.post('/addProduct', function(req, res){  

  if(!req.session.isAdmin){
    res.redirect('/');
    return;
  }

  //Get data from the form  
  var pName = req.body.pName; 
  var price = req.body.price;
  var pDesc = req.body.pDesc;
  var picture = req.body.picture;
  var amount = req.body.amount;

  console.log(picture);

  var sql = `INSERT INTO Products (Pname, Price, Pdesc, Picture, AmountInStock) VALUES ('${pName}', '${price}', '${pDesc}', '/images/${picture}', '${amount}')`;
    // QUERY DB
    db.query(sql, function (err, result) {
      if (err) throw err;
      console.log("1 record inserted"); //For debug

    res.redirect('/settings');
    res.end();
  });
});

//Post/Change User info to the datbase
router.post('/updateProduct', function(req, res){  
  //Get data from the form  
  var pID = req.body.pID; 
  var pName = req.body.pName; 
  var price = req.body.price;
  var pDesc = req.body.pDesc;
  var picture = req.body.picture;
  var amount = req.body.amount;

  var sql = `SELECT * FROM Products WHERE ProdID = ${pID};`;
  db.query(sql, function (err, result) {
    if (err) throw err;

    if (result.length > 0) {

      //Set variables to previous if not changed
      if (pName == undefined) pName = result[0].Pname;
      if (price == '') price = result[0].Price;
      if (pDesc == '') pDesc = result[0].Pdesc;
      if (picture == '') picture = result[0].Picture;
      if (amount == '') amount = 0;

      sql = `UPDATE Products SET Pname = '${pName}', Price = '${price}', Pdesc = '${pDesc}', Picture = '${picture}', AmountInStock = ${result[0].AmountInStock} + ${amount} WHERE ProdID = ${pID}`;
      // QUERY DB
      db.query(sql, function (err, result2) {
        if (err) throw err;
        console.log("Record updated"); //For debug
  
        
      });
    }
    res.redirect('/settings');
    res.end();
  });
});

router.get('/removeProduct', function(req, res, next) {

  if(!req.session.isAdmin){
    res.redirect('/');
    return;
  }

  var prodID = req.query.id;

  var sql = `DELETE FROM Products WHERE ProdID = ${prodID}`;
    db.query(sql, function (err, result) {
      if (err) throw err;
      
      res.redirect("/settings");
      res.end();
    });
});


router.get('/removeUser', function(req, res, next) {

  if(!req.session.isAdmin){
    res.redirect('/');
    return;
  }

  var usersID = req.query.id;

  var sql = `DELETE FROM Users WHERE UserID = ${usersID}`;
    db.query(sql, function (err, result) {
      if (err) throw err;
      
      res.redirect("/settings");
      res.end();
    });
});


module.exports = router;