const usersModel = require('../models/users-model');

async function filterUsers(req, res, next) {
  const { term, limit } = req.query;

  try {
    const { foundUsers } = await usersModel.filterUsers(term, limit);
    res.status(200).send({ found_users: foundUsers });
  } catch (err) {
    next(err);
  }
}

module.exports = { filterUsers };
