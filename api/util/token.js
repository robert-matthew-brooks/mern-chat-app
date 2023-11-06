const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config();
const jwtSecret = process.env.JWT_SECRET;

function makeToken(user) {
  return jwt.sign(
    {
      id: user._id,
      username: user.username,
      contacts: user.contacts,
    },
    jwtSecret,
    {}
  );
}

function getUserDataFromToken(req) {
  let token = req.query?.token;
  console.log(token);

  if (!token) {
    const cookies = req.headers?.cookie;
    tokenCookieStr = cookies.split(';').find((str) => str.startsWith('token='));
    token = tokenCookieStr.split('=')[1];
  }

  const userData = jwt.verify(token, jwtSecret, {});
  return userData;
}

module.exports = { makeToken, getUserDataFromToken };
