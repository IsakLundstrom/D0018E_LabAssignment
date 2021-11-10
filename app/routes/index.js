var express = require('express');
var router = express.Router();
var db=require('../db'); // GET ACCESS TO DB

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/*GET info from form*/ 
router.get('/myform', function(req, res){  
    var myText = req.query.mytext; //mytext is the name of your input box   
    console.log(myText);   
    var sql = `INSERT INTO customers (name, address) VALUES ('Company Inc', '${myText}')`;
    // QUERY DB
    db.query(sql, function (err, result) {
      if (err) throw err;
      console.log("1 record inserted");
  });
});

/*GET info from DB*/ 
router.get('/sel', function(req, res){
  //var myText = req.query.sel;
  // var sql = `SELECT address FROM customers WHERE address = '${myText}'`;
  var sql = `SELECT * FROM customers`;
  // QUERY DB
  db.query(sql, function (err, result) {
    if (err) throw err;
    //console.log(result[0].address);
    res.render("index", { customerTable: result });
  });
});

module.exports = router;
