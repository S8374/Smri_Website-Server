const { db } = require("../../connection/dbConnect");
const { ObjectId } = require("mongodb");
const cashOnDelivery = async (req, res) => {
    const data = req.body;

  
    try {
      const cashOnDelivery = db.collection("cashOnDelivery");
  
      // Check if the product already exists for the user
      const existingPayment = await cashOnDelivery.findOne({
        email: data.email,
        paymentItemsID: data.paymentItemsID,
      });
  
      if (existingPayment) {
        // Update quantity and price if the product already exists
        const updatedQuantity = existingPayment.quantity + data.quantity;
        const updatedPrice = existingPayment.price + data.price;
  
        const result = await cashOnDelivery.updateOne(
          { _id: existingPayment._id },
          {
            $set: {
              quantity: updatedQuantity,
              price: updatedPrice,
            },
          }
        );
  
        if (result.modifiedCount > 0) {
          return res.status(200).json({ success: true, updated: true });
        } else {
          return res.status(400).json({ success: false, message: "Failed to update payment data" });
        }
      } else {
        // Insert new payment data if the product doesn't exist
        const result = await cashOnDelivery.insertOne(data);
        return res.status(201).json({ success: true, insertedId: result.insertedId });
      }
    } catch (error) {
      console.error("Error inserting order:", error);
      return res.status(500).json({ success: false, message: "Failed to process order" });
    }
  };
  
//get data
const getCashOnDelivery = async (req, res) => {
  try {
    const cashOnDeliveryCollection = db.collection("cashOnDelivery");
    const cashOnDeliveryData = await cashOnDeliveryCollection.find().toArray();
    res.status(200).json({ success: true, data: cashOnDeliveryData });
  } catch (error) {
    console.error("Error fetching cash on delivery data:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
const getOrderPaymentUser = async (req, res) => {
    try {
        const { email } = req.params; // Extract email from params
        const cashOnDeliveryCollection = db.collection("cashOnDelivery");

        // Query database using the extracted email
        const cashOnDeliveryData = await cashOnDeliveryCollection.find({ created_Email: email }).toArray();

        res.status(200).json({ success: true, cashOnDeliveryData });
    } catch (error) {
        console.error("Error fetching cash on delivery data:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
// Update order status to Confirmed
const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  try {
    const cashOnDeliveryCollection = db.collection("cashOnDelivery");
    const result = await cashOnDeliveryCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: "Confirmed" } }
    );
    if (result.modifiedCount > 0) {
      res
        .status(200)
        .json({ success: true, message: "Order confirmed successfully" });
    } else {
      res.status(404).json({ success: false, message: "Order not found" });
    }
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ success: false, message: "Failed to update order" });
  }
};

module.exports = { cashOnDelivery, getCashOnDelivery, updateOrderStatus,getOrderPaymentUser };
