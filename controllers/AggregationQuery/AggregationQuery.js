const { db, ObjectId } = require("../../connection/dbConnect");

const getMostProducts = async (req, res) => {
    try {
       
        const productsCollection = db.collection("products");
        const paymentCollection = db.collection("payments");
        const cashOnDeliveryCollection = db.collection("cashOnDelivery");

        // 🔹 Log total products count
        const totalProducts = await productsCollection.countDocuments();
  
        const pipeline = [
            {
                $lookup: {
                    from: "payments",
                    let: { productId: { $toString: "$_id" } }, // Convert _id to string
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ["$paymentItemsID", "$$productId"] } // Match paymentItemsID with product _id
                            }
                        }
                    ],
                    as: "paymentOrders"
                }
            },
            {
                $lookup: {
                    from: "cashOnDelivery",
                    let: { productId: { $toString: "$_id" } }, // Convert _id to string
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ["$paymentItemsID", "$$productId"] } // Match paymentItemsID with product _id
                            }
                        }
                    ],
                    as: "cashOrders"
                }
            },
            {
                $addFields: {
                    totalOrders: {
                        $add: [
                            { $sum: "$paymentOrders.quantity" },
                            { $sum: "$cashOrders.quantity" }
                        ]
                    },
                    totalSell: {
                        $add: [
                            { $sum: { $map: { input: "$paymentOrders", as: "order", in: { $multiply: ["$$order.quantity", "$$order.price"] } } } },
                            { $sum: { $map: { input: "$cashOrders", as: "order", in: { $multiply: ["$$order.quantity", "$$order.price"] } } } }
                        ]
                    }
                }
            },
            {
                $project: {
                    productId: "$_id",
                    ownerEmail: "$created_Email",
                    title: "$title",
                    totalOrders: 1,
                    totalSell: 1
                }
            }
        ];

    
        const result = await productsCollection.aggregate(pipeline).toArray();

        res.status(200).json({ success: true, data: result });

    } catch (error) {
        console.error("❌ Error fetching most products:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = { getMostProducts };