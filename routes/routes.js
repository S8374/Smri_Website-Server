const express = require("express");
const {
  getProducts,
  updateProductItems,
  postProduct,
  returnItemsToShop,
  deleteProduct,
  updateProduct,
} = require("../controllers/productControllers/productControllers");
const { postComment } = require("../controllers/comment/comment");
const {
  addCart_items,
  getCart_items,
  getUserCartItems,
} = require("../controllers/cart/postCart");
const {
  updateCartItems,
  deleteCartItem,
} = require("../controllers/cart/updateCartAndStock ");
const {
  addToWishlist,
  getWishlistItems,
  removeFromWishlist,
} = require("../controllers/wish/wishControllers");
const {
  saveUserInfo,
  getUsers,
  getAllUsers,
  deleteUser,
  updateUserRole,
  getSellerRank,
  getUserRole,
} = require("../controllers/user/userControllers");
const {
  CreatePaymentIntent,
  SavePaymentData,
  getPaymentData,
  getSellerPaymentUser,
  confirmOrder,
} = require("../controllers/stripePaymentsControll/stripePayment");
const { saveUserChat, getUserChats } = require("../controllers/chat/chat");
const {
  cashOnDelivery,
  getCashOnDelivery,
  updateOrderStatus,
  getOrderPaymentUser,
} = require("../controllers/order/orderController");
const {
  getMostProducts,
} = require("../controllers/AggregationQuery/AggregationQuery");
const {
  postJWT,
  verifyToken,
  verifyAdmin,
  verifySeller,
  verify_Admin_Seller,
} = require("../controllers/jwt/jwt");
const { postCoupon, getCoupon } = require("../controllers/marketing/coupon");
const routes = express.Router();
// Get all products
routes.get("/products", getProducts);
routes.put("/products", updateProductItems);
routes.post("/products",verifyToken,verify_Admin_Seller, postProduct); // Changed from patch to post for adding new products
//both admin  and seller
routes.delete("/products/:id",  deleteProduct);
routes.patch("/products/:id", updateProduct); // Use PATCH for partial updates
//only for admin
routes.get("/sellerRank",verifyToken,verifyAdmin,  getSellerRank); 
//post comment // its can do without login 
routes.patch("/products", postComment);
// cartItems
routes.post("/cartItems", addCart_items);
routes.get("/cartItems", getCart_items);
routes.get("/cart/:userUid", getUserCartItems);
routes.put("/cartItems", updateCartItems);
routes.delete("/cartItems", deleteCartItem);
routes.post("/cartItems/return", returnItemsToShop);
// Wishlist
routes.post("/wishItems", addToWishlist);
routes.delete("/wishItems", removeFromWishlist);
// FIXED: Use :userUid instead of ?userUid in the route
routes.get("/wishItems/:userUid", getWishlistItems);

//user
routes.post("/users", saveUserInfo);
routes.get("/users/:email",getUsers);
routes.get('/users/:email/role',getUserRole);
routes.get("/users",verifyToken,verifyAdmin,  getAllUsers);
routes.patch("/users", saveUserInfo);
routes.delete("/users/:id", deleteUser);
routes.patch("/users/:email",verifyToken,verifyAdmin, updateUserRole); //New route for updating user role
// Payment
routes.post("/PaymentIntent", CreatePaymentIntent);
routes.patch("/PaymentData", SavePaymentData);
routes.get("/PaymentData", getPaymentData);
routes.get("/PaymentData/:email", getSellerPaymentUser);
routes.put("/PaymentData/:paymentId", confirmOrder);
//chat box
routes.patch("/chat-data", saveUserChat);
routes.get("/chat-data", getUserChats);
//order
routes.patch("/cashOnDelivery",cashOnDelivery);
routes.get("/cashOnDelivery/:email", getOrderPaymentUser);
routes.get("/cashOnDelivery",getCashOnDelivery);
routes.put("/cashOnDelivery/:id",verifyToken,verifySeller, updateOrderStatus);
//coupons
routes.put("/coupons",verifyToken,verifyAdmin, postCoupon);
routes.get("/coupons", getCoupon);
//Aggregation Query
routes.get("/getMostProducts", getMostProducts);
// ──────────────────────────────────────────
// 🔐 JWT ROUTES
// ──────────────────────────────────────────
routes.post("/jwt", postJWT);
module.exports = { routes };
