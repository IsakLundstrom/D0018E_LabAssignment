var express = require("express");
var router = express.Router();
var db = require("../db"); // GET ACCESS TO DB

// GET home page.
router.get("/", function (req, res, next) {
  var prodID = req.query.id;

  var sql2 = `SELECT * FROM Reviews WHERE ProdID = ${prodID}`;
  db.query(sql2, function (err, result2) {
    if (err) throw err;
    var rating = 0;
    var count = 0;
    for (let i = 0; i < result2.length; i++) {
      rating += result2[i].Rating;
      count++;
    }
    if (count > 0) rating /= count;
    rating = Number.parseFloat(rating).toPrecision(2);

    var sql3 = `UPDATE Products SET Rating = ${rating} WHERE ProdID = ${prodID}`;
    db.query(sql3, function (err, result3) {
      if (err) throw err;

      var sql1 = `SELECT * FROM Products WHERE ProdID = ${prodID}`;
      db.query(sql1, function (err, result1) {
        if (err) throw err;

        res.render("product", {
          product: result1,
          review: result2,
          session: req.session,
        });
      });
    });
  });
});

// Reviews
router.post("/makeReview", function (req, res, next) {
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
    });
    res.redirect("/product?id=" + prodID);
    res.end;
  });
});

router.get("/removeReview", function (req, res, next) {
  if (!req.session.isAdmin) {
    res.redirect("/");
    return;
  }

  var revID = req.query.revID;
  var prodID = req.query.prodID;

  var sql1 = `DELETE FROM Reviews WHERE ReviewID = ${revID}`;
  db.query(sql1, function (err, result) {
    if (err) throw err;

    res.redirect("/product?id=" + prodID);
    res.end();
  });
});

module.exports = router;
