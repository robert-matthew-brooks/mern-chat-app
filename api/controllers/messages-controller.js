const messagesModel = require('../models/messages-model');
const { getUserDataFromCookie } = require('../util/token');
const { rejectIfNoTokenCookie } = require('../util/validate');

async function getMessages(req, res, next) {
  const { contact_id: contactId } = req.params;
  const { limit } = req.query;

  try {
    await rejectIfNoTokenCookie(req);
    const { id } = await getUserDataFromCookie(req);
    const { messages } = await messagesModel.getMessages(id, contactId);

    res.status(200).send({ messages });
  } catch (err) {
    next(err);
  }
}

async function addMessage(req, res, next) {
  const { contact_id: contactId } = req.params;
  const { body } = req.body;

  try {
    await rejectIfNoTokenCookie(req);
    const { id } = await getUserDataFromCookie(req);
    const { postedMessage } = await messagesModel.addMessage(
      id,
      contactId,
      body
    );

    res.status(201).send({ postedMessage });
  } catch (err) {
    next(err);
  }
}

module.exports = { getMessages, addMessage };
