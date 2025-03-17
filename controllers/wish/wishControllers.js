const { db } = require("../../connection/dbConnect");
const wishCollection = db.collection('wishlist');
const addToWishlist = async (req, res) => {
    try {
        const { Product_id, user_Email, user_Uid, ...rest } = req.body;
   
        // Check if item already exists in wishlist
        const existingItem = await wishCollection.findOne({ Product_id, $or: [{ user_Email }, { user_Uid }] });

        if (existingItem) {
            return res.status(400).json({ message: 'Item already added to wishlist' });
        }

        // Insert new wishlist item
        const result = await wishCollection.insertOne({ Product_id, user_Email, user_Uid, ...rest });

        if (result.acknowledged) {
            return res.status(201).json({ message: 'Item added to wishlist successfully' });
        }

        res.status(500).json({ message: 'Failed to add item to wishlist' });
    } catch (error) {
        console.error('Error adding item:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const getWishlistItems = async (req, res) => {
    try {
        const userUid = req.params.userUid; // FIXED: Read from req.params instead of req.query

        if (!userUid) {
            return res.status(400).json({ success: false, message: "userUid is required" });
        }

        // Fix: Create proper query
        const query = { user_Uid: userUid };
        const wishlistItems = await wishCollection.find(query).toArray();
        
        res.status(200).json({ success: true, data: wishlistItems });
    } catch (error) {
        console.error("Error fetching wishlist items:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};


const removeFromWishlist = async (req, res) => {
    try {
        const { Product_id, user_Email, user_Uid } = req.body;

        // Delete the item from the wishlist
        const result = await wishCollection.deleteOne({ Product_id, $or: [{ user_Email }, { user_Uid }] });

        if (result.deletedCount > 0) {
            return res.status(200).json({ message: 'Item removed from wishlist successfully' });
        }

        // If no item was deleted, return 404
        res.status(404).json({ message: 'Item not found in wishlist' });
    } catch (error) {
        console.error('Error removing item:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = {
    addToWishlist,
    getWishlistItems,
    removeFromWishlist,
};