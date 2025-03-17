const { ObjectId } = require("mongodb");
const { db } = require("../../connection/dbConnect");

const updateCartItems = async (req, res) => {
    try {
        const cartCollection = db.collection("cartItems");
        const cartItems = req.body;

        if (!cartItems || cartItems.length === 0) {
            return res.status(400).json({ message: "No cart items provided for update." });
        }

        let updatedCount = 0;

        for (const item of cartItems) {
            const { userEmail, productId, newSubtotal, newQuantity, newSize } = item;

            const query = {
                user_Email: userEmail,
                Product_id: productId,
            };

            const update = {
                $set: {
                    Discount_price: newSubtotal,
                    quantity: newQuantity,
                    // Only update the size if a new size is provided
                    ...(newSize && { size: newSize }),
                },
            };

            const result = await cartCollection.updateOne(query, update);

            if (result.modifiedCount > 0) {
                updatedCount++;
            }
        }

        res.status(200).json({ message: `${updatedCount} cart items updated successfully!` });
    } catch (error) {
        console.error("Error updating cart items:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
const deleteCartItem = async (req, res) => {
    try {
        const { productId, userEmail, userUid } = req.body;

        // if (!productId || !userEmail || !userUid) {
        //     return res.status(400).json({ success: false, message: "Missing required fields" });
        // }

        const cartCollection = db.collection("cartItems");

        // Find and delete the cart item
        const result = await cartCollection.deleteOne({
            Product_id: productId,
            user_Email: userEmail,
            user_Uid: userUid,
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({ success: false, message: "Cart item not found or user mismatch" });
        }

        res.status(200).json({ success: true, message: "Product removed from cart successfully" });
    } catch (error) {
        console.error("Error deleting cart item:", error);
        res.status(500).json({ success: false, message: "Failed to delete cart item" });
    }
};

module.exports = { updateCartItems, deleteCartItem  };
