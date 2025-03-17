const { db } = require("../../connection/dbConnect");

// Cart Items Collection
const cartCollection = db.collection("cartItems");
const addCart_items = async (req, res) => {
  try {
    const cartItem = req.body;

    // Check if the item already exists in the cart for the current user
    const existingCartItem = await cartCollection.findOne({
      Product_id: cartItem.Product_id,
      user_Uid: cartItem.user_Uid, // Check by user_UID to ensure it's the correct user
    });

    if (existingCartItem) {
      // If the item already exists, return a response indicating it
      return res
        .status(400)
        .json({ message: "Item already added to the cart" });
    }

    // If the item doesn't exist, add it to the cart
    const result = await cartCollection.insertOne(cartItem);
    res.status(201).json({ message: "Item added to cart!", result });
  } catch (error) {
    res.status(500).json({ message: "Error adding item", error });
  }
};

// Get Cart Items
const getCart_items = async (req, res) => {
  try {
    const cartItems = await cartCollection.find().toArray();
    res
      .status(200)
      .json({ message: "Cart items fetched successfully!", cartItems });
  } catch (error) {
    res.status(500).json({ message: "Error fetching cart items", error });
  }
};
const getUserCartItems = async (req, res) => {
    try {
        const { userUid } = req.params;

        // Find only items added by the specific user
        const cartItems = await cartCollection.find({ user_Uid: userUid }).toArray();

        res.status(200).json({ message: "User's cart items fetched successfully!", cartItems });
    } catch (error) {
        res.status(500).json({ message: "Error fetching cart items", error });
    }
};

module.exports = { addCart_items, getCart_items,getUserCartItems };
