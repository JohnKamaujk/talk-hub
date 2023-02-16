const chatModel = require("../Models/chatModel");

// creating a chat
const createChat = async (req, res) => {
  const { firstId, secondId } = req.body;
  try {
    const existingChat = await chatModel.findOne({
      members: { $all: [firstId, secondId] },
    });

    if (existingChat) return res.status(200).json(existingChat);

    const newChat = new chatModel({ members: [firstId, secondId] });

    const savedChat = await newChat.save();

    res.status(200).json(savedChat);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

// find a user chats
const findUserChats = async (req, res) => {
  const userId = req.params.userId;

  try {
    const chats = await chatModel.find({
      members: { $in: [userId] },
    });

    res.status(200).json(chats);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

// find a chat
const findChat = async (req, res) => {
  const { firstId, secondId } = req.params;

  try {
    const chat = await chatModel.findOne({
      members: { $all: [firstId, secondId] },
    });

    res.status(200).json(chat);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

module.exports = { createChat, findUserChats, findChat };
