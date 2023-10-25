const { User } = require('../db/connection');
const { hash, isEncryptedMatch } = require('../util/encrypt');
const { makeToken } = require('../util/token');
const { rejectIfBlank, rejectIfUserIdNotFound } = require('../util/validate');

const getUserDataWithContacts = async (username) => {
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
        pipeline: [{ $project: { _id: 0, id: '$_id', username: 1 } }],
        as: 'contacts',
      },
    },
    { $project: { contactIds: 0 } },
  ]);

  return response[0];
};

async function register(username, password) {
  await rejectIfBlank({ username, password });

  const hashedPassword = hash(password);
  const createdUser = await User.create({
    username: username.toLowerCase(),
    password: hashedPassword,
  });

  return {
    registeredUser: {
      id: createdUser._id,
      username: createdUser.username,
      token: makeToken(createdUser),
    },
  };
}

async function deleteUser(userId) {
  await rejectIfUserIdNotFound(userId);

  const deletedInfo = await User.deleteOne({
    _id: userId,
  });

  return { deletedInfo };
}

async function login(username, password) {
  await rejectIfBlank({ username, password });
  const foundUser = await getUserDataWithContacts(username);

  if (!foundUser) {
    return Promise.reject({ status: 401, msg: 'username not found' });
  }

  if (!isEncryptedMatch(password, foundUser.password)) {
    return Promise.reject({ status: 403, msg: 'incorrect password' });
  }

  return {
    foundUser: {
      id: foundUser._id,
      username: foundUser.username,
      contacts: foundUser.contacts,
      token: makeToken(foundUser),
    },
  };
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
        _id: 0,
        id: '$_id',
        username: '$username',
      },
    },
  ]);

  return { foundUsers };
}

async function addContact(userId, contactId) {
  await rejectIfUserIdNotFound(contactId);

  const response = await User.updateOne(
    { _id: userId },
    { $addToSet: { contactIds: contactId } }
  );
  return { response };
}

async function removeContact(userId, contactId) {
  await rejectIfUserIdNotFound(contactId);

  const response = await User.updateOne(
    { _id: userId },
    { $pull: { contactIds: contactId } }
  );
  return { response };
}

module.exports = {
  getUserDataWithContacts,
  register,
  login,
  deleteUser,
  findUsers,
  addContact,
  removeContact,
};
