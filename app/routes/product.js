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

module.exports = router;