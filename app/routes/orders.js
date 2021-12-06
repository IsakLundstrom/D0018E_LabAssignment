var express = require('express');
var router = express.Router();
var db = require('../db'); // GET ACCESS TO DB


// GET orders page.
router.get('/', function (req, res, next) {

    var sql1 = `SELECT * FROM Orders`;
    db.query(sql1, function (err, result1) {
        if (err) throw err;

        res.render("orders", { orders: result1, session: req.session });
        res.end();
    });
});


router.get('/changeOrderStatus', function (req, res, next) {
    var orderID = req.query.orderID;
    var prodID = req.query.prodID;
    var status = req.query.status;


    db.beginTransaction(function (err) {
        if (err) throw err;

        var sql1 = `SELECT AmountInStock FROM Products WHERE ProdID = ${prodID}`;
        db.query(sql1, function (err, amountInStockResult) {
            if (err) throw err;

            var sql2 = `SELECT AmountToBuy FROM Orders WHERE OrderID = ${orderID} AND ProdID = ${prodID}`;
            db.query(sql2, function (err, amountToBuyResult) {
                if (err) throw err;

                if (amountToBuyResult[0].AmountToBuy < amountInStockResult[0].AmountInStock && status === "Shipped") {
                    var sql1 = `UPDATE Orders SET OrderStatus = '${status}' WHERE OrderID = ${orderID} AND ProdID = ${prodID}`;
                    db.query(sql1, function (err, result1) {
                        if (err) throw err;
                        var amount = amountInStockResult[0].AmountInStock - amountToBuyResult[0].AmountToBuy;

                        var sql = `UPDATE Products SET AmountInStock = ${amount} WHERE ProdID = ${prodID}`;
                        db.query(sql, function (err, result1) {
                            if (err) throw err;

                        });
                        res.redirect("/orders");
                        res.end();
                    });
                }
                else if (amountToBuyResult[0].AmountToBuy > amountInStockResult[0].AmountInStock && status === "Shipped") {
                    res.redirect("/");
                    res.end();
                }
                else {
                    var sql1 = `UPDATE Orders SET OrderStatus = '${status}' WHERE OrderID = ${orderID} AND ProdID = ${prodID}`;
                    db.query(sql1, function (err, result1) {
                        if (err) throw err;
                        res.redirect("/orders");
                        res.end();
                    });

                }
                db.commit(function (err) {
                    if (err) throw err;
                });
            });
        });
    });
});



module.exports = router;