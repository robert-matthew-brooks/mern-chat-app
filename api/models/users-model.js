const { User } = require('../db/connection');

async function filterUsers(term, limit) {
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

module.exports = { filterUsers };
