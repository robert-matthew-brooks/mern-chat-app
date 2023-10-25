const { Message } = require('../db/connection');

async function getMessages(userId, contactId, limit = 50) {
  const messages = await Message.find({
    senderId: { $in: [userId, contactId] },
    recipientId: { $in: [userId, contactId] },
  })
    .sort({ createdAt: -1 })
    .limit(limit);

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
