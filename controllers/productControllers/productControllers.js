const { db } = require("../../connection/dbConnect");
const { ObjectId } = require("mongodb");
const getProducts = async (req, res) => {
  try {
    const productsCollection = db.collection("products");
    const products = await productsCollection.find({}).toArray();
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const updateProductItems = async (req, res) => {
    try {
        const productsCollection = db.collection("products");
        const cartUpdates = req.body;
       

        if (!cartUpdates || cartUpdates.length === 0) {
            return res.status(400).json({ success: false, message: "No changes detected. Please update quantity before saving." });
        }

        for (const cartItem of cartUpdates) {
            const product = await productsCollection.findOne({ _id: new ObjectId(cartItem.productId) });

            if (!product) {
                return res.status(404).json({ success: false, message: `Product with ID ${cartItem.productId} not found.` });
            }

            const quantityChange = cartItem.newQuantity - cartItem.oldQuantity;

            if (cartItem.newQuantity > product.total_stock) {
                return res.status(400).json({
                    success: false,
                    message: `Only ${product.total_stock} items available in stock for product ID ${cartItem.productId}`,
                });
            }

            await productsCollection.updateOne(
                { _id: new ObjectId(cartItem.productId) },
                { $inc: { total_stock: -quantityChange } }
            );
        }

        res.status(200).json({ success: true, message: "Cart items updated successfully." });
    } catch (error) {
        console.error("Error updating cart items:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

//post products 
const postProduct = async (req, res) => {
  try {
    const productsCollection = db.collection("products");
    const newProduct = req.body;
    const result = await productsCollection.insertOne(newProduct);
    res.status(201).json({ success: true, message: "Product added successfully", insertedId: result.insertedId });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
const returnItemsToShop = async (req, res) => {
  try {
      const cartCollection = db.collection("cartItems");
      const productsCollection = db.collection("products");
      const itemsToReturn = req.body; // Array of items to return

      if (!itemsToReturn || itemsToReturn.length === 0) {
          return res.status(400).json({ success: false, message: "No items provided for return." });
      }

      for (const item of itemsToReturn) {
          const { productId, quantity, userEmail, userUid } = item;

          // Remove the item from the cart
          const deleteResult = await cartCollection.deleteOne({
              Product_id: productId,
              user_Email: userEmail,
              user_Uid: userUid,
          });

          if (deleteResult.deletedCount === 0) {
           
              continue; // Skip to the next item
          }

          // Increase the product stock
          await productsCollection.updateOne(
              { _id: new ObjectId(productId) },
              { $inc: { total_stock: quantity } }
          );
      }

      res.status(200).json({ success: true, message: "Items returned to shop successfully." });
  } catch (error) {
      console.error("Error returning items to shop:", error);
      res.status(500).json({ success: false, message: "Failed to return items to shop." });
  }
};
//delete product with id 
const deleteProduct = async (req, res) => {
    try {
        const productsCollection = db.collection("products"); // Ensure this collection name matches your database
        const { id } = req.params; // Use "id" since your route defines it as ":id"

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid product ID." });
        }

        const deleteResult = await productsCollection.deleteOne({ _id: new ObjectId(id) });

        if (deleteResult.deletedCount === 0) {
            return res.status(404).json({ success: false, message: `Product with ID ${id} not found.` });
        }

        res.status(200).json({ success: true, message: `Product with ID ${id} deleted successfully.` });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ success: false, message: "Failed to delete product." });
    }
};
// Update a product by ID
const updateProduct = async (req, res) => {
    try {
      const productsCollection = db.collection("products");
      const productId = req.params.id; // Get the product ID from the URL
      const updatedData = req.body; // Get the updated data from the request body
  
      if (!ObjectId.isValid(productId)) {
        return res.status(400).json({ success: false, message: "Invalid product ID." });
      }
  
      // Check if the product exists
      const existingProduct = await productsCollection.findOne({ _id: new ObjectId(productId) });
      if (!existingProduct) {
        return res.status(404).json({ success: false, message: "Product not found." });
      }
  
      // Update the product
      const result = await productsCollection.updateOne(
        { _id: new ObjectId(productId) },
        { $set: updatedData }
      );
  
      if (result.modifiedCount === 0) {
        return res.status(400).json({ success: false, message: "No changes were made." });
      }
  
      res.status(200).json({ success: true, message: "Product updated successfully." });
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ success: false, message: "Failed to update product." });
    }
  };
module.exports = { getProducts , updateProductItems , postProduct , returnItemsToShop,deleteProduct,updateProduct };
