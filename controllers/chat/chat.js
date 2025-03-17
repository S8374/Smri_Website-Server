const { db } = require("../../connection/dbConnect");

const saveUserChat = async (req, res) => {
    try {
        const { chatId, sender, userId, text,photoURL } = req.body;
        const userChatCollection = db.collection("userChats");

        if (!chatId || !text) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Check if the chatId already exists
        const existingChat = await userChatCollection.findOne({ chatId });

        if (existingChat) {
            // If the chatId exists, update the existing chat with the new message
            await userChatCollection.updateOne(
                { chatId },
                { $push: { messages: { sender: sender || "Guest", userId, photoURL , text, date: new Date() } } }
            );
        } else {
            // If the chatId does not exist, create a new chat entry
            await userChatCollection.insertOne({
                chatId,
                messages: [{ sender: sender || "Guest", userId,photoURL, text, date: new Date() }]
            });
        }

        res.status(201).json({ success: true, message: "Chat saved successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to save chat", details: error.message });
    }
};
const getUserChats = async (req, res) => {
    try {
        const userChatCollection = db.collection("userChats");
        const chats = await userChatCollection.find().toArray();
        res.json({ success: true, chats });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch chats", details: error.message });
    }
};

module.exports = { saveUserChat, getUserChats };