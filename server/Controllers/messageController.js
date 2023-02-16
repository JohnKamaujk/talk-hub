const messageModel = require("../Models/messageModel");

// creating a message
const createMessage = async (req, res) => {
  const { chatId, senderId, text } = req.body;

  const message = new messageModel({ chatId, senderId, text });

  try {
    const savedMessage = await message.save();
    res.status(200).json(savedMessage);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

//get messages of a specific chat
const getMessages = async (req, res) => {
  const { chatId } = req.params;

  try {
    const messages = await messageModel.find({ chatId });
    res.status(200).json(messages);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

module.exports = { createMessage, getMessages };
