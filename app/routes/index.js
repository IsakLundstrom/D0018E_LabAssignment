var express = require('express');
var router = express.Router();
const mysql = require('mysql');

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "mydb" // ÄNDRA TILL RÄTT DB
});

db.connect(err => {
  if(err) throw err;
  console.log("DB connected")
});





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
  var myText = req.query.sel;
  var sql = `SELECT address FROM customers WHERE address = '${myText}'`;
  // QUERY DB
  db.query(sql, function (err, result) {
    if (err) throw err;
    console.log(result[0].address);
    res.send(result[0].address);
  });
});

module.exports = router;
