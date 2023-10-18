const { User } = require('../db/connection');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { hash } = require('../db/encrypt');

dotenv.config();
const jwtSecret = process.env.JWT_SECRET;

const makeToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      username: user.username,
      contacts: user.contacts,
    },
    jwtSecret,
    {}
  );
};

async function getProfile(token) {
  const userData = jwt.verify(token, jwtSecret, {});
  return { userData };
}

async function register(username, password) {
  const hashedPassword = hash(password);
  const createdUser = await User.create({ username, password: hashedPassword });
  createdUser.contacts = [];

  return {
    registeredUser: {
      id: createdUser._id,
      username: createdUser.username,
      contacts: createdUser.contacts,
      token: makeToken(createdUser),
    },
  };
}

async function login(username, password) {
  const response = await User.aggregate([
    { $match: { username } },
    {
      $lookup: {
        from: 'users',
        localField: 'contactIds',
        foreignField: '_id',
        pipeline: [{ $project: { _id: 1, username: 1 } }],
        as: 'contacts',
      },
    },
    { $project: { contactIds: 0 } },
  ]);

  const foundUser = response[0];

  if (foundUser) {
    const isPassOk = bcrypt.compareSync(password, foundUser.password);
    if (isPassOk) {
      return {
        foundUser: {
          id: foundUser._id,
          username: foundUser.username,
          contacts: foundUser.contacts,
          token: makeToken(foundUser),
        },
      };
    } else {
      return Promise.reject({ status: 401, msg: 'incorrect password' });
    }
  } else {
    return Promise.reject({ status: 403, msg: 'username not found' });
  }
}

async function addContact(userId, contactId) {
  const response = await User.updateOne(
    { _id: userId },
    { $addToSet: { contactIds: contactId } }
  );
  return { response };
}

async function removeContact(userId, contactId) {
  console.log('be', userId, contactId);
  const response = await User.updateOne(
    { _id: userId },
    { $pull: { contactIds: contactId } }
  );
  return { response };
}

module.exports = { getProfile, register, login, addContact, removeContact };
