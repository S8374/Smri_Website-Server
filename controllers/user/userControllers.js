const { db } = require("../../connection/dbConnect");
const { ObjectId } = require("mongodb");
// Save or update user information
const saveUserInfo = async (req, res) => {
  try {
    const user = req.body;

    const userCollection = db.collection("users");
    const userEmail = user.email;

    if (!userEmail) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }

    // Check if the user already exists
    const existingUser = await userCollection.findOne({ email: userEmail });

    if (existingUser) {
      // If user exists, update details
      const updatedFields = {
        firstName: user.firstName || existingUser.firstName,
        lastName: user.lastName || existingUser.lastName,
        address: user.address || existingUser.address,
        profileImage: user.profileImage || existingUser.profileImage,
        apartment: user.apartment || existingUser.apartment,
        city: user.city || existingUser.city,
        phone: user.phone || existingUser.phone,
        state: user.state || existingUser.state,
        zipCode: user.zipCode || existingUser.zipCode,
        country: user.country || existingUser.country,
      };

      // Update statusRequest only if provided
      if (user.statusRequest) {
        updatedFields.statusRequest = user.statusRequest;
      }

      // Update email only if newEmail is provided and different
      if (user.newEmail && user.newEmail !== existingUser.email) {
        const emailExists = await userCollection.findOne({
          email: user.newEmail,
        });
        if (emailExists) {
          return res
            .status(400)
            .json({ success: false, message: "New email already exists." });
        }
        updatedFields.email = user.newEmail;
      }

      // Update password only if newPassword is provided and confirmed
      if (
        user.newPassword &&
        user.confirmNewPassword &&
        user.newPassword === user.confirmNewPassword
      ) {
        updatedFields.password = user.newPassword;
      }

      // Update user details in the database
      const result = await userCollection.updateOne(
        { email: userEmail },
        { $set: updatedFields }
      );


      return res
        .status(200)
        .json({ success: true, message: "User details updated successfully" });
    } else {
      // Save new user details in the database
      const result = await userCollection.insertOne(user);

     
      return res.status(201).json({
        success: true,
        message: "User information saved successfully",
      });
    }
  } catch (error) {
    console.error("Database Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to save user information in database.",
    });
  }
};
// Endpoint to get top sellers
const getSellerRank = async (req, res) => {
  try {
    const usersCollection = db.collection("users");
    const productsCollection = db.collection("products");

    // Step 1: Aggregate to count products for each seller
    const sellerProductCounts = await usersCollection
      .aggregate([
        {
          $unwind: "$email",
        },
        {
          $lookup: {
            from: "products",
            localField: "email",
            foreignField: "created_Email",
            as: "userProducts",
          },
        },
        {
          $addFields: {
            totalProducts: { $size: "$userProducts" }, // Count products per seller
          },
        },
        { $sort: { totalProducts: -1 } }, // Sort sellers by product count (descending)
      ])
      .toArray();

    if (sellerProductCounts.length === 0) {
      return res.status(404).json({ message: "No sellers found" });
    }
    res.status(200).json({ success: true, sellerProductCounts });
  } catch (error) {
    console.error("Error fetching top sellers:", error);
    res.status(500).json({ message: "Error fetching top sellers", error });
  }
};
//get users details
const getUsers = async (req, res) => {
  try {
    const userCollection = db.collection("users");
    const userEmail = req.params.email;

    if (!userEmail) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const userDetails = await userCollection.findOne({ email: userEmail });

    if (!userDetails) {
      return res.status(400).json({ success: false, message: "User not found" });
    }
    // ✅ If user is an admin or seller, return user details
    res.status(200).json({ success: true, data: userDetails });

  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
//get user role 
const getUserRole = async (req, res) => {
  try {
    const userCollection = db.collection("users");
    const userEmail = req.params.email;
    if (!userEmail) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }
    const userDetails = await userCollection.findOne({ email: userEmail });
    if (!userDetails) {
      return res.status(400).json({ success: false, message: "User not found" });
    }
    
    const isAdmin = userDetails.role === "admin" && userDetails.isAdmin === true;
    const isSeller = userDetails.role === "seller";
    if (!isAdmin && !isSeller) {
      return res.status(403).json({ success: false, message: "Forbidden: Not an admin or seller" });
    }
      // ✅ If user is an admin or seller, return user details
      res.status(200).json({ success: true,admin: isAdmin, seller: isSeller });
    } catch (error) {
      console.error("Error fetching user details:", error);
      res.status(500).json({ success: false, message: "Server Error" });
    }

}


const getAllUsers = async (req, res) => {
  try {
    const userCollection = db.collection("users");
    const users = await userCollection.find().toArray(); // Corrected variable name

    res.status(200).json({ success: true, users }); // Use 'users' instead of 'data'
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
//delete user with id
const deleteUser = async (req, res) => {
  try {
    const userCollection = db.collection("users");
    const userId = req.params.id;

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }

    const result = await userCollection.deleteOne({
      _id: new ObjectId(userId),
    });

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
// Update user role by email
const updateUserRole = async (req, res) => {
  try {
    const userCollection = db.collection("users");
    const userEmail = req.params.email;
    const { role } = req.body;

    if (!userEmail || !role) {
      return res
        .status(400)
        .json({ success: false, message: "Email and role are required" });
    }

    const result = await userCollection.updateOne(
      { email: userEmail },
      { $set: { role, statusRequest: "confirmed" } } // Update role and set statusRequest to "confirmed"
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found or role not updated",
      });
    }

    res
      .status(200)
      .json({ success: true, message: "User role updated successfully" });
  } catch (error) {
    console.error("Error updating user role:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
module.exports = {
  saveUserInfo,
  getUsers,
  getAllUsers,
  deleteUser,
  updateUserRole,
  getSellerRank,
  getUserRole
};
