const { db, dbConnect, User } = require('./connection');

const usersToInsert = [
  { username: 'testBob', password: 'testpass1' },
  { username: 'John', password: 'testpass1' },
  { username: 'James', password: 'testpass1' },
  { username: 'Frank', password: 'testpass1' },
  { username: 'Fred', password: 'testpass1' },
  { username: 'Joel', password: 'testpass1' },
  { username: 'Martha', password: 'testpass1' },
];

async function seed() {
  await dbConnect();
  await User.deleteMany({});
  await User.insertMany(usersToInsert);
  await db.disconnect();
}

seed();
