const { User } = require('../db/connection');
const { hash, isEncryptedMatch } = require('../util/encrypt');
const { makeToken } = require('../util/token');

async function register(username, password) {
  const hashedPassword = hash(password);
  const createdUser = await User.create({
    username: username.toLowerCase(),
    password: hashedPassword,
  });
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
    {
      $match: {
        username: username.toLowerCase(),
      },
    },
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
    if (isEncryptedMatch(password, foundUser.password)) {
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

async function deleteUser(userId) {
  const deletedInfo = await User.deleteOne({
    _id: userId,
  });

  return { deletedInfo };
}

async function findUsers(term, limit = 10) {
  const foundUsers = await User.aggregate([
    {
      $match: {
        username: { $regex: term, $options: 'i' },
      },
    },
    { $limit: +limit },
    {
      $project: {
        _id: '$_id',
        username: '$username',
      },
    },
  ]);

  return { foundUsers };
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

module.exports = {
  register,
  login,
  deleteUser,
  findUsers,
  addContact,
  removeContact,
};
