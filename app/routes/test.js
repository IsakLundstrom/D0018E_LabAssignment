var express = require('express');
var router = express.Router();
var db=require('../db');

// function getDB(sql) {
//     db.query(sql, function (err, result) {
//         if (err) throw err;
//         console.log("result");
//         callback(null, result)
//     });

// }

router.get('/', function(req, res, next) {
    var sql = `SELECT * FROM customers`;
    db.query(sql, function (err, result) {
        if (err) throw err;
        
        res.render("index", { customerTable: result });

    });
    //console.log(getDB("SELECT * FROM customers"));

    // db.query("SELECT * FROM customers", function (err, result) {
    //     if (err) throw err;
    //     console.log(result);
        
    // });
});





module.exports = router;