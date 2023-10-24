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
    if (!cookies) reject({ msg: 'no cookie provided' });

    tokenCookieStr = cookies.split(';').find((str) => str.startsWith('token='));
    token = tokenCookieStr.split('=')[1];
    console.log('check token');
    if (!token) reject({ msg: 'no cookie provided' });

    console.log('verify token');
    const userData = jwt.verify(token, jwtSecret, {});
    resolve({ userData });
  });
}

module.exports = { makeToken, getUserDataFromReq };
