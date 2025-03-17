const { db } = require("../../connection/dbConnect");
const { ObjectId } = require("mongodb");

const postComment = async (req, res) => {
  try {
    const { action, productID, reviewIndex, user, review, userId, reply, likeDislike } = req.body;

    if (!productID || !action) {
      return res.status(400).json({ success: false, message: "Product ID and action are required" });
    }

    const productsCollection = db.collection("products");

    switch (action) {
      case "addComment":
        if (!user || !review || !userId) {
          return res.status(400).json({ success: false, message: "All fields are required for adding a comment" });
        }

        const newReview = {
          user,
          userId,
          review,
          likes: 0,
          dislikes: 0,
          date: new Date().toISOString(), // Use ISO string for consistent date formatting
          replies: [],
        };

        await productsCollection.updateOne(
          { _id: new ObjectId(productID) },
          { $push: { review: newReview } }
        );

        return res.status(201).json({ success: true, message: "Comment added successfully", newReview });

      case "addReply":
        if (!reviewIndex || !user || !reply || !userId) {
          return res.status(400).json({ success: false, message: "All fields are required for adding a reply" });
        }

        const newReply = {
          user,
          userId,
          reply,
          date: new Date().toISOString(), // Use ISO string for consistent date formatting
        };

        await productsCollection.updateOne(
          { _id: new ObjectId(productID) },
          { $push: { [`review.${reviewIndex}.replies`]: newReply } }
        );

        return res.status(201).json({ success: true, message: "Reply added successfully", newReply });

      case "likeDislike":
        if (!reviewIndex || !likeDislike) {
          return res.status(400).json({ success: false, message: "Review index and like/dislike action are required" });
        }

        const updateField = likeDislike === "like" ? "likes" : "dislikes";

        await productsCollection.updateOne(
          { _id: new ObjectId(productID) },
          { $inc: { [`review.${reviewIndex}.${updateField}`]: 1 } }
        );

        return res.status(200).json({ success: true, message: `Comment ${likeDislike}d successfully` });

      default:
        return res.status(400).json({ success: false, message: "Invalid action" });
    }
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { postComment };