var express = require('express');
var router = express.Router();
var db=require('../db'); // GET ACCESS TO DB

// GET home page. 
router.get('/', function(req, res, next) {

  if(!req.session.userid){
    res.redirect('/');
    return;
  }

  var userID = req.query.id;
  console.log("Cart userID: " + userID);
  var sql = `SELECT * FROM Cart, Products WHERE Cart.UserID = ${req.session.userid} AND Products.ProdID = Cart.ProdID;`;
    db.query(sql, function (err, result) {
        if (err) throw err;
        
        
        res.render("cart", { cart: result, session: req.session });

    });
});



router.get('/addToCart', function(req, res, next) {

    var prodID = req.query.id;
    var amount = req.query.amount;
    var from = req.query.from;
    console.log("From: " + from);

    
    var sql = `SELECT * FROM Cart WHERE UserID = ${req.session.userid} AND ProdID = ${prodID}`;
    db.query(sql, function (err, result) {
      if (err) {
        throw err;
      }
      else if(result.length === 0) {
        var sql = `INSERT INTO Cart (UserID, ProdID, AmountToBuy) VALUES (${req.session.userid}, ${prodID}, ${amount})`; // JUST TEST SQL
        db.query(sql, function (err, result) {
            if (err) throw err;
            
            if(from == "homepage"){
              
             res.redirect("/");
             
            } 
            else if(from == "product"){
              
              res.redirect("/product?id=" + prodID);
              
            }
            else {

              res.redirect("/cart")
            }

    
        });
      }

      else {
        var sql = `UPDATE Cart SET AmountToBuy = AmountToBuy + ${amount} WHERE UserID = ${req.session.userid} AND ProdID = ${prodID}`; // JUST TEST SQL
        db.query(sql, function (err, result) {
            if (err) throw err;

            if(from == "homepage"){
              
              res.redirect("/");
              
             } 
             else if(from == "product"){
               
               res.redirect("/product?id=" + prodID);
               
             }
             else {
 
               res.redirect("/cart")
             }
    
        });
      }
  });

});




router.get('/removeFromCart', function(req, res, next) {

  var prodID = req.query.id;
  console.log("Cart prodID: " + prodID);

  var sql = `DELETE FROM Cart WHERE ProdID = ${prodID} AND UserID = ${req.session.userid}`;
    db.query(sql, function (err, result) {
        if (err) throw err;
        
        res.redirect("/cart")

    });
});

router.post('/orderCart', function(req, res, next) {

  var sql = `SELECT * FROM Cart, Products WHERE Cart.UserID = ${req.session.userid} AND Products.ProdID = Cart.ProdID;`;
    db.query(sql, function (err, resultCart) {
      if (err) throw err;

      sql = `SELECT * FROM Users WHERE UserID = ${req.session.userid};`;
      db.query(sql, function (err, resultUser) {
        if (err) throw err;

        sql = `SELECT COUNT(DISTINCT(OrderID)) AS NumOrders FROM Orders;`;
        db.query(sql, function (err, resultNumOrders) {
          if (err) throw err;
          // console.log(resultNumOrders[0]);
          // console.log(resultNumOrders[0].NumOrders);

          sql = `INSERT INTO Orders (OrderID, ProdID, Pname, UserID, UserName, Address, Price, AmountToBuy) VALUES `;
          for (let i = 0; i < resultCart.length; i++) {
            const cart = resultCart[i];
            sql += `(${resultNumOrders[0].NumOrders + 1}, ${cart.ProdID}, '${cart.Pname}', ${resultUser[0].UserID}, '${resultUser[0].Fname} ${resultUser[0].Lname}', '${resultUser[0].HomeAddress}', ${cart.Price}, ${cart.AmountToBuy})`
            if(i+1 < resultCart.length) sql += `, `;
          }
          sql += `;`

          db.query(sql, function (err, resultOrderMoved) {
          if (err) throw err;
            

          });

    
        });
      
      });

      var sql1 = `DELETE FROM Cart WHERE Cart.UserID = ${req.session.userid};`;

      db.query(sql1, function (err, resultOrderMoved) {
      if (err) throw err;
      
      });

  });
  res.redirect("/cart");
});

module.exports = router;


