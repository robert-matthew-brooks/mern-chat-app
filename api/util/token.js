const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

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

async function getUserDataFromReq(req) {
  return new Promise((resolve, reject) => {
    const cookies = req.headers?.cookie;
    tokenCookieStr = cookies.split(';').find((str) => str.startsWith('token='));

    if (tokenCookieStr) {
      token = tokenCookieStr.split('=')[1];
      if (token) {
        const userData = jwt.verify(token, jwtSecret, {});
        resolve(userData);
      } else {
        reject({ msg: 'no cookie provided' });
      }
    }
  });
}

module.exports = { makeToken, getUserDataFromReq };
