const { db } = require('../../connection/dbConnect');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { ObjectId } = require("mongodb");
// Create Payment Intent
const CreatePaymentIntent = async (req, res) => {
    const { price } = req.body;
    const amount = parseInt(price * 100); // Convert to cents

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: "usd",
            payment_method_types: ["card"],
        });

        res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (err) {
        console.error("Error creating payment intent:", err);
        res.status(500).json({ error: "Failed to create payment intent" });
    }
};

// Save Payment Data
const SavePaymentData = async (req, res) => {
    const paymentData = req.body;

    try {
        const paymentCollection = db.collection("payments");

        // Check if the product already exists for the user
        const existingPayment = await paymentCollection.findOne({
            email: paymentData.email,
            paymentItemsID: paymentData.paymentItemsID,
        });

        if (existingPayment) {
            // Update quantity and price if the product already exists
            const updatedQuantity = existingPayment.quantity + paymentData.quantity;
            const updatedPrice = existingPayment.price + paymentData.price;

            const result = await paymentCollection.updateOne(
                { _id: existingPayment._id },
                {
                    $set: {
                        quantity: updatedQuantity,
                        price: updatedPrice,
                    },
                }
            );

            if (result.modifiedCount > 0) {
                res.status(200).json({ updated: true });
            } else {
                res.status(400).json({ error: "Failed to update payment data" });
            }
        } else {
            // Insert new payment data if the product doesn't exist
            const result = await paymentCollection.insertOne(paymentData);
            res.status(200).json({ insertedId: result.insertedId });
        }
    } catch (err) {
        console.error("Error saving payment data:", err);
        res.status(500).json({ error: "Failed to save payment data" });
    }
};
//get
const getPaymentData=async(req,res)=>{
    try{
        const paymentCollection=db.collection("payments");
        const paymentData=await paymentCollection.find().toArray();
        res.status(200).json({success:true,data:paymentData});
    }catch(error){
        console.error("Error fetching payment data:", error);
        res.status(500).json({success:false,message:"Server error"});
    }
}
//get spasic seller payment user
const getSellerPaymentUser=async(req,res)=>{
    try {
        const { email } = req.params; // Extract email from params
        const paymentCollection = db.collection("payments");
        const paymentData = await paymentCollection.find({ created_Email: email }).toArray();
      
        res.status(200).json({ success: true, data: paymentData });
    } catch (error) {
        console.error("Error fetching payment data:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
}
// Confirm Order
const confirmOrder = async (req, res) => {
    const { paymentId } = req.params;

    try {
        const paymentCollection = db.collection("payments");

        // Find the payment by ID and update its status to "confirmed"
        const result = await paymentCollection.updateOne(
            { _id: new ObjectId(paymentId) },
            { $set: { status: "confirmed" } }
        );

        if (result.modifiedCount > 0) {
            res.status(200).json({ success: true, message: "Order confirmed successfully" });
        } else {
            res.status(404).json({ success: false, message: "Order not found or already confirmed" });
        }
    } catch (error) {
        console.error("Error confirming order:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

module.exports = { CreatePaymentIntent, SavePaymentData,getPaymentData,getSellerPaymentUser,confirmOrder};