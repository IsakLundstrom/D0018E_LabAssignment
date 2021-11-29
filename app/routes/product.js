var express = require('express');
var router = express.Router();
var db=require('../db'); // GET ACCESS TO DB

// GET home page. 
router.get('/', function(req, res, next) {

  var prodID = req.query.id;
  console.log("PRODUCT ID = " + prodID);

  var sql = `SELECT * FROM Products WHERE ProdID = '${prodID}'`;
    db.query(sql, function (err, result) {
        if (err) throw err;
        
        res.render("product", { product: result, session: req.session });

    });
});


// Reviews
router.post('/makeReview', function(req, res, next) {

  var prodID = req.body.id;
  var userID = req.session.userid;
  var rating = req.body.rating;
  var comment = req.body.comment;
  var userName;
  

  var sql1 = `SELECT Fname FROM Users WHERE UserID = ${userID}`;
    db.query(sql1, function (err, result) {
        if (err) throw err;
        userName = result[0].Fname;

        var sql2 = `INSERT INTO Reviews (ProdID, UserName, Rating, Comment) VALUES ('${prodID}', '${userName}', ${rating}, '${comment}')`;
        db.query(sql2, function (err, result) {
            if (err) throw err;
            console.log("Review prod = " + prodID + " RATING = " + rating + " comment = " + comment);
        });
      res.redirect("/product?id=" +prodID);
      res.end;
    });

  

  
});


module.exports = router;