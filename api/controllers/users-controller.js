const usersModel = require('../models/users-model');

async function filterUsers(req, res, next) {
  const { term } = req.params;

  try {
    const { foundUsers } = await usersModel.filterUsers(term);
    res.status(200).send({ found_users: foundUsers });
  } catch (err) {
    next(err);
  }
}

module.exports = { filterUsers };
