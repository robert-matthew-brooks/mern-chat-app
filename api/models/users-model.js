const { User } = require('../db/connection');

async function filterUsers(term) {
  const foundUsers = await User.aggregate([
    {
      $match: {
        username: { $regex: term, $options: 'i' },
      },
    },
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

module.exports = { filterUsers };
