const { User } = require('../db/connection');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

dotenv.config();
const jwtSecret = process.env.JWT_SECRET;
const bcryptSalt = bcrypt.genSaltSync(10);

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
  const hashedPassword = bcrypt.hashSync(password, bcryptSalt);
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
  const foundUser = await User.aggregate([
    {
      $unwind: '$contactIds',
    },
    {
      $match: { username },
    },
    { $group: { contacts: { _id: 1, $push: '$contactIds' } } },
  ]);
  // foundUser.contacts = [{ id: '1', username: '11' }];
  console.log(foundUser);

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

module.exports = { getProfile, register, login, addContact };
