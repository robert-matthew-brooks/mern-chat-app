const messagesModel = require('../models/messages-model');

async function getMessages(req, res, next) {
  const { user_id: userId, contact_id: contactId } = req.query;

  try {
    const { messages } = await messagesModel.getMessages(userId, contactId);

    res.status(200).send({ messages });
  } catch (err) {
    next(err);
  }
}

async function addMessage(req, res, next) {
  const { user_id: userId, contact_id: contactId, body } = req.body;

  try {
    const { postedMessage } = await messagesModel.addMessage(
      userId,
      contactId,
      body
    );

    res.status(201).send({ postedMessage });
  } catch (err) {
    next(err);
  }
}

module.exports = { getMessages, addMessage };
