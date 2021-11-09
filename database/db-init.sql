CREATE DATABASE IF NOT EXISTS db;

USE db;

CREATE TABLE Users (
    UserID INT NOT NULL AUTO_INCREMENT,
    Fname VARCHAR(32) NOT NULL,
    Lname VARCHAR(32) NOT NULL,
    HPassword VARCHAR(32) NOT NULL,
    Email VARCHAR(32) NOT NULL UNIQUE,
    HomeAddress VARCHAR(32),
    -- isAdmin BOOLEAN NOT NULL DEFAULT false,
    PRIMARY KEY(UserID)
);

CREATE TABLE Admins (
    AdminID INT NOT NULL AUTO_INCREMENT,
    UserID INT NOT NULL,
    PRIMARY KEY(AdminID),
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

CREATE TABLE Products (
    ProdID INT NOT NULL AUTO_INCREMENT,
    Pname VARCHAR(32) NOT NULL,
    Price INT NOT NULL,
    Pdesc VARCHAR(32) NOT NULL,
    Picture VARCHAR(32) NOT NULL,
    Rating DECIMAL(1,1) DEFAULT 0,
    AmountInStock INT NOT NULL DEFAULT 0,
    PRIMARY KEY(ProdID)
);

CREATE TABLE Cart (
    CartID INT NOT NULL AUTO_INCREMENT,
    CustID INT NOT NULL,
    ProdID INT NOT NULL,
    AmountToBuy INT NOT NULL,
    PRIMARY KEY(CartID),
    FOREIGN KEY (CustID) REFERENCES Users(UserID), 
    FOREIGN KEY (ProdID) REFERENCES Products(ProdID)
);

CREATE TABLE Orders (
    OrderID INT NOT NULL AUTO_INCREMENT,
    CustID INT NOT NULL,
    ProdID INT NOT NULL,
    AmountToBuy INT(4) NOT NULL,
    OrderStatus ENUM('ToOrder', 'Shipped', 'Completed'),
    PRIMARY KEY(OrderID),
    FOREIGN KEY (CustID) REFERENCES Users(UserID), 
    FOREIGN KEY (ProdID) REFERENCES Products(ProdID)
);

CREATE TABLE Reviews (
    ReviewID INT NOT NULL AUTO_INCREMENT,
    CustID INT NOT NULL,
    ProdID INT NOT NULL,
    Rating INT(1) NOT NULL,
    Comment TEXT,
    PRIMARY KEY(ReviewID),
    FOREIGN KEY (CustID) REFERENCES Users(UserID), 
    FOREIGN KEY (ProdID) REFERENCES Products(ProdID)
);