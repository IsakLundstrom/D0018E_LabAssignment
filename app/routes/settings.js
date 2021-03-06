var express = require("express");
var router = express.Router();
var db = require("../db"); // GET ACCESS TO DB

// GET settings page.
router.get("/", function (req, res, next) {
  //No userid redirect to home page
  if (!req.session.userid) {
    res.redirect("/");
    return;
  }

  var sql1 = `SELECT * FROM Users WHERE UserID=${req.session.userid}`;
  db.query(sql1, function (err, result1) {
    if (err) throw err;

    var sql2 = `SELECT * FROM Products;`;
    db.query(sql2, function (err, result2) {
      if (err) throw err;

      var sql3 = `SELECT * FROM Users WHERE UserID != ${req.session.userid};`;
      db.query(sql3, function (err, result3) {
        if (err) throw err;

        var sql4 = `SELECT * FROM Orders WHERE UserID = ${req.session.userid};`;
        db.query(sql4, function (err, result4) {
          if (err) throw err;

          res.render("settings", {
            UserInfo: result1,
            Products: result2,
            Users: result3,
            orders: result4,
            session: req.session,
          });
        });
      });
    });
  });
});

//Post/Change User info to the datbase
router.post("/changeUserInfo", function (req, res) {
  //Get data from the form
  var fName = req.body.fName;
  var lName = req.body.lName;
  var password = req.body.password;
  var address = req.body.address;

  var sql = `UPDATE Users SET Fname = '${fName}', Lname = '${lName}', HPassword = '${password}', HomeAddress = '${address}' WHERE UserID = ${req.session.userid}`;
  // QUERY DB
  db.query(sql, function (err, result) {
    if (err) throw err;

    res.redirect("/settings");
    res.end();
  });
});

router.get("/deleteAccount", function (req, res) {
  var sql = `DELETE FROM Users WHERE UserID = ${req.session.userid}`;
  // QUERY DB
  db.query(sql, function (err, result) {
    if (err) throw err;

    req.session.destroy();
    res.redirect("/");
    res.end();
  });
});

const multer = require("multer");
const fs = require("fs");
var path = require("path");

const upload = multer({
  dest: "app/public/images",
});

router.post("/addProduct", upload.single("picture"), function (req, res) {
  if (!req.session.isAdmin) {
    res.redirect("/");
    return;
  }

  //Get data from the form
  var pName = req.body.pName;
  var price = req.body.price;
  var pDesc = req.body.pDesc;
  var picture = req.file.originalname;
  var amount = req.body.amount;

  if (price <= 0) {
    res.redirect("/settings?error=invalidPrice");
    res.end();
    return;
  }

  if (amount < 0) {
    res.redirect("/settings?error=negativeAmount");
    res.end();
    return;
  }

  var sql = `INSERT INTO Products (Pname, Price, Pdesc, Picture, AmountInStock) VALUES ('${pName}', '${price}', '${pDesc}', '/images/${picture}', '${amount}')`;
  // QUERY DB
  db.query(sql, function (err, result) {
    if (err) throw err;
  });

  const tempPath = req.file.path;
  const targetPath = path.join(
    __dirname,
    "../public/images/" + req.file.originalname
  );

  fs.rename(tempPath, targetPath, (err) => {
    if (err) return err;
  });

  res.redirect("/settings");
  res.end();
});

//Post/Change User info to the datbase
router.post("/updateProduct", upload.single("picture"), function (req, res) {
  //Get data from the form

  var pID = req.body.pID;
  var pName = req.body.pName;
  var price = req.body.price;
  var pDesc = req.body.pDesc;
  if (req.file) {
    var picture = "/images/" + req.file.originalname;
  } else {
    var picture = "";
  }
  var amount = req.body.amount;

  var sql = `SELECT * FROM Products WHERE ProdID = ${pID};`;
  db.query(sql, function (err, result) {
    if (err) throw err;

    if (result.length > 0) {
      //Set variables to previous if not changed
      if (pName == "") pName = result[0].Pname;
      if (price == "") price = result[0].Price;
      if (pDesc == "") pDesc = result[0].Pdesc;
      if (amount == "") amount = 0;

      if (price <= 0) {
        res.redirect("/settings?error=invalidPrice");
        res.end();
        return;
      }

      if (result[0].AmountInStock + Number(amount) < 0) {
        res.redirect("/settings?error=negativeAmount");
        res.end();
        return;
      }

      if (picture == "") {
        picture = result[0].Picture;
      } else {
        const tempPath = req.file.path;
        const targetPath = path.join(
          __dirname,
          "../public/images/" + req.file.originalname
        );

        fs.rename(tempPath, targetPath, (err) => {
          if (err) return err;
        });
      }

      sql = `UPDATE Products SET Pname = '${pName}', Price = '${price}', Pdesc = '${pDesc}', Picture = '${picture}', AmountInStock = ${result[0].AmountInStock} + ${amount} WHERE ProdID = ${pID}`;
      // QUERY DB
      db.query(sql, function (err, result2) {
        if (err) throw err;
      });
    }
    res.redirect("/settings");
    res.end();
  });
});

router.get("/changeAvailabilityProduct", function (req, res, next) {
  if (!req.session.isAdmin) {
    res.redirect("/");
    return;
  }

  var prodID = req.query.id;

  var sql = `SELECT IsAvailable FROM Products WHERE ProdID = ${prodID};`;
  db.query(sql, function (err, result1) {
    if (err) throw err;

    var sql = `UPDATE Products SET IsAvailable = ${!result1[0]
      .IsAvailable} WHERE ProdID = ${prodID}`;
    db.query(sql, function (err, result) {
      if (err) throw err;

      res.redirect("/settings");
      res.end();
    });
  });
});

router.get("/removeUser", function (req, res, next) {
  if (!req.session.isAdmin) {
    res.redirect("/");
    return;
  }

  var usersID = req.query.id;

  var sql = `DELETE FROM Users WHERE UserID = ${usersID}`;
  db.query(sql, function (err, result) {
    if (err) throw err;

    res.redirect("/settings");
    res.end();
  });
});

module.exports = router;
