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
      .cookie('token', registeredUser.token, {
        sameSite: 'none',
        secure: true,
      })
      .status(201)
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
      .cookie('token', foundUser.token, {
        sameSite: 'none',
        secure: true,
      })
      .status(201)
      .send({ found_user: foundUser });
  } catch (err) {
    next(err);
  }
}

module.exports = { getProfile, register, login };
