const { Message } = require('../db/connection');

async function getMessages(userId, contactId) {
  const messages = await Message.find({
    senderId: { $in: [userId, contactId] },
    recipientId: { $in: [userId, contactId] },
  })
    .sort({ createdAt: -1 })
    .limit(50);

  return { messages };
}

async function addMessage(userId, contactId, body) {
  const postedMessage = await Message.create({
    senderId: userId,
    recipientId: contactId,
    body,
  });

  return { postedMessage };
}

module.exports = { getMessages, addMessage };
