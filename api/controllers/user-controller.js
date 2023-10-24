const jwt = require('jsonwebtoken');
const userModel = require('../models/user-model');
const { getUserDataFromReq } = require('../util/token');

async function getProfile(req, res, next) {
  try {
    const { userData } = await getUserDataFromReq(req);
    res.status(200).send({ user_data: userData });
  } catch (err) {
    next(err);
  }
}

async function register(req, res, next) {
  const { username, password } = req.body;

  try {
    const { registeredUser } = await userModel.register(username, password);

    res
      .status(201)
      .cookie('token', registeredUser.token)

      .send({ registered_user: registeredUser });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  const { username, password } = req.body;

  try {
    const { foundUser } = await userModel.login(username, password);

    res
      .status(201)
      .cookie('token', foundUser.token)
      .send({ found_user: foundUser });
  } catch (err) {
    next(err);
  }
}

async function logout(_req, res, next) {
  try {
    res.status(204).cookie('token', {}).send();
  } catch (err) {
    next(err);
  }
}

async function deleteUser(req, res, next) {
  try {
    const { id } = await getUserDataFromReq(req);
    const { deletedInfo } = await userModel.deleteUser(id);
    res.status(204).cookie('token', {}).send({ deletedInfo });
  } catch (err) {
    next(err);
  }
}

async function findUsers(req, res, next) {
  const { term } = req.params;
  const { limit } = req.query;

  try {
    const { foundUsers } = await userModel.findUsers(term, limit);
    res.status(200).send({ found_users: foundUsers });
  } catch (err) {
    next(err);
  }
}

async function addContact(req, res, next) {
  const { contact_id: contactId } = req.params;

  try {
    const { id } = await getUserDataFromReq(req);
    const { response } = await userModel.addContact(id, contactId);
    res.status(200).send({ response });
  } catch (err) {
    next(err);
  }
}

async function removeContact(req, res, next) {
  const { contact_id: contactId } = req.params;

  try {
    const { id } = await getUserDataFromReq(req);
    const { response } = await userModel.removeContact(id, contactId);
    res.status(200).send({ response });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getProfile,
  register,
  login,
  logout,
  deleteUser,
  findUsers,
  addContact,
  removeContact,
};
