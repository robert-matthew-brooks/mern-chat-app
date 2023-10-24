const messagesModel = require('../models/messages-model');
const { getUserDataFromReq } = require('../util/token');

async function getMessages(req, res, next) {
  const { contact_id: contactId } = req.params;

  try {
    const { id } = await getUserDataFromReq(req);
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
    const { id } = await getUserDataFromReq(req);
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
