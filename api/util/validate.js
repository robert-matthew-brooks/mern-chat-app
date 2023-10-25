const { User } = require('../db/connection');

async function rejectIfBlank(values) {
  for (const key in values) {
    if (!values[key]) {
      return Promise.reject({ status: 400, msg: `${key} cannot be blank` });
    }
  }
}

async function rejectIfNoTokenCookie(req) {
  const cookies = req.headers?.cookie;
  if (!cookies) {
    return Promise.reject({ status: 403, msg: 'no cookie provided' });
  }

  tokenCookieStr = cookies.split(';').find((str) => str.startsWith('token='));
  token = tokenCookieStr.split('=')[1];
  if (!token) {
    return Promise.reject({ status: 403, msg: 'no token provided in cookies' });
  }
}

async function rejectIfUserIdNotFound(userId) {
  try {
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return Promise.reject({ status: 404, msg: `${userId} not found` });
    }
  } catch {
    return Promise.reject({ status: 404, msg: `${userId} not found` });
  }
}

module.exports = {
  rejectIfBlank,
  rejectIfNoTokenCookie,
  rejectIfUserIdNotFound,
};
