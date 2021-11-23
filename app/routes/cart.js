var express = require('express');
var router = express.Router();
var db=require('../db'); // GET ACCESS TO DB

// GET home page. 
router.get('/', function(req, res, next) {

    var userID = req.query.id;
    console.log("Cart userID: " + userID);
  
    var sql = `SELECT * FROM Cart WHERE CustID = 1`; // TEST SQL
      db.query(sql, function (err, result) {
          if (err) throw err;
          
          res.render("cart", { cart: result, session: req.session });
  
      });
  });







router.get('/addToCart', function(req, res, next) {

    var prodID = req.query.id;
    console.log("Cart prodID: " + prodID);


    var sql = `INSERT INTO Cart (CustID, ProdID, AmountToBuy) VALUES (1, ${prodID}, 1)`; // JUST TEST SQL
      db.query(sql, function (err, result) {
          if (err) throw err;
          
          res.redirect("/cart")
  
      });
  });
module.exports = router;