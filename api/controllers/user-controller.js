const userModel = require('../models/user-model');

async function getProfile(req, res, next) {
  const token = req.cookies?.token;

  try {
    if (token) {
      const { userData } = await userModel.getProfile(token);
      res.status(200).send({ user_data: userData });
    } else {
      res.status(401).send({ msg: 'no cookie provided' });
    }
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
      .cookie('token', registeredUser.token, {
        sameSite: 'none',
        secure: true,
      })

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
      .cookie('token', foundUser.token, {
        sameSite: 'none',
        secure: true,
      })
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

async function addContact(req, res, next) {
  const { user_id: userId, contact_id: contactId } = req.body;

  try {
    const { response } = await userModel.addContact(userId, contactId);
    res.status(200).send({ response });
  } catch (err) {
    next(err);
  }
}

async function removeContact(req, res, next) {
  const { user_id: userId, contact_id: contactId } = req.body;
  console.log(req.body);

  try {
    const { response } = await userModel.removeContact(userId, contactId);
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
  addContact,
  removeContact,
};
