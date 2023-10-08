const { db } = require('../db/connection');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

dotenv.config();
const jwtSecret = process.env.JWT_SECRET;
const bcryptSalt = bcrypt.genSaltSync(10);

const UserSchema = new db.Schema(
  {
    username: { type: String, unique: true },
    password: String,
  },
  { timestamps: true }
);

const User = db.model('User', UserSchema);

const makeToken = (user) => {
  return jwt.sign({ id: user._id, username: user.username }, jwtSecret, {});
};

async function getProfile(token) {
  const userData = jwt.verify(token, jwtSecret, {});
  return { userData };
}

async function register(username, password) {
  const hashedPassword = bcrypt.hashSync(password, bcryptSalt);
  const createdUser = await User.create({ username, password: hashedPassword });
  return {
    registeredUser: {
      id: createdUser._id,
      username: createdUser.username,
      token: makeToken(createdUser),
    },
  };
}

async function login(username, password) {
  const foundUser = await User.findOne({ username });

  if (foundUser) {
    const isPassOk = bcrypt.compareSync(password, foundUser.password);
    if (isPassOk) {
      return {
        foundUser: {
          id: foundUser._id,
          username: foundUser.username,
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

module.exports = { getProfile, register, login };
