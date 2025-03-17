const jwt = require("jsonwebtoken");
const { db } = require("../../connection/dbConnect");

// JWT related API
const postJWT = async (req, res) => {
  try {
    const user = req.body;
  
    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "1h"});
    res.send({ token });
  } catch (error) {
    console.error("Error generating JWT:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Middleware to verify token
const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Forbidden: Invalid token" });
      }
      req.decoded = decoded; // Store decoded user info
   
      next(); // ✅ Only call `next()` if token verification is successful
    });
  } catch (error) {
    console.error("Error in verifyToken middleware:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Middleware to verify admin
const verifyAdmin = async (req, res, next) => {
  try {
    const email = req.decoded.email;
    const query = { email: email };


    const userCollections = db.collection("users");
    const user = await userCollections.findOne(query);

    if (user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: Not an admin" });
    }

    next();
  } catch (error) {
    console.error("Error in verifyAdmin middleware:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Middleware to verify seller
const verifySeller = async (req, res, next) => {
  try {
    const email = req.decoded.email;
    const query = { email: email };


    const userCollections = db.collection("users");
    const user = await userCollections.findOne(query);

    if (user.role !== "seller") {
      return res.status(403).json({ message: "Forbidden: Not a seller" });
    }

    next();
  } catch (error) {
    console.error("Error in verifySeller middleware:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Middleware to verify admin or seller
const verify_Admin_Seller = async (req, res, next) => {

    const email = req.decoded.email;
    const query = { email: email };
   

    const userCollections = db.collection("users");
    const user = await userCollections.findOne(query);
    isAdmin_Seller=user?.role === 'admin' || user?.role === 'seller'
    if (!isAdmin_Seller) {
      return res.status(403).send({ message: 'forbidden access' });
    }
    next();
};

module.exports = {
  postJWT,
  verifyToken,
  verifyAdmin,
  verifySeller,
  verify_Admin_Seller,
};