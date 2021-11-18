var express = require('express');
var router = express.Router();
var db=require('../db'); // GET ACCESS TO DB

/* GET home page. */
router.get('/', function(req, res, next) {

  var sql = `SELECT * FROM Products`;
    db.query(sql, function (err, result) {
        if (err) throw err;
        
        res.render("index", { ProductTable: result, session: req.session });

    });
});

router.get('/logout', function(req, res, next) {
  req.session.destroy();
  res.redirect('/');
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
