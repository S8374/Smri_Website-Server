const { db } = require("../../connection/dbConnect");
const couponCollection = db.collection("coupons");

const postCoupon = async (req, res) => {
  try {
    const { name, discount } = req.body;

    if (!name || name.length !== 8) {
      return res.status(400).json({ error: "Coupon must be exactly 8 characters long!" });
    }
    if (!discount || discount < 1 || discount > 100) {
      return res.status(400).json({ error: "Discount must be between 1% and 100%." });
    }

    const existingCoupon = await couponCollection.findOne();
    if (existingCoupon) {
      await couponCollection.updateOne(
        { _id: existingCoupon._id },
        { $set: { name, discount, updatedAt: new Date() } }
      );
      return res.json({ message: "Coupon updated successfully!" });
    } else {
      await couponCollection.insertOne({ name, discount, createdAt: new Date() });
      return res.json({ message: "Coupon added successfully!" });
    }
  } catch (error) {
    console.error("Error updating coupon:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get all coupons
const getCoupon = async (req, res) => {
  try {
    const coupon = await couponCollection.findOne();
    if (!coupon) {
      return res.status(404).json({ message: "No coupon available." });
    }
    res.json(coupon);
  } catch (error) {
    console.error("Error fetching coupon:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { postCoupon, getCoupon };
