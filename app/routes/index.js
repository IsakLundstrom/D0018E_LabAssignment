var express = require("express");
var router = express.Router();
var db = require("../db"); // GET ACCESS TO DB

// GET home page.
router.get("/", function (req, res, next) {
  var sql = `SELECT * FROM Products WHERE IsAvailable = 1`;
  db.query(sql, function (err, result) {
    if (err) throw err;

    res.render("index", { ProductTable: result, session: req.session });
  });
});

// GET Logout function
router.get("/logout", function (req, res, next) {
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
