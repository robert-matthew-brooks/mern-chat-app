const fs = require('fs');
const { db, dbConnect, User, Message } = require('./connection');
const { hash } = require('./encrypt');

const totalFriends = 3;
const seedPassword = 'testpass1';

const seedUsernames = [
  'Bob',
  ...fs
    .readFileSync(`${__dirname}/seed-names`, 'utf-8')
    .split('\n')
    .filter((name) => name.length > 0)
    .sort(() => Math.random() - 0.5)
    .slice(0, 50),
];

const seedMessages = [
  ...fs
    .readFileSync(`${__dirname}/seed-messages`, 'utf-8')
    .split('\n')
    .filter((name) => name.length > 0)
    .map((rawMsg) => {
      const rawMsgArr = rawMsg.split('_');
      return {
        senderIndex: +rawMsgArr[0],
        recipientIndex: +rawMsgArr[1],
        body: rawMsgArr[2],
      };
    }),
];

async function seed() {
  // clear old db

  await dbConnect();
  await User.collection.drop();
  await Message.collection.drop();

  // make all test users

  const hashedUsers = [];
  const hashedSeedPassword = hash(seedPassword);

  for (const username of seedUsernames) {
    hashedUsers.push({
      username: `${username}_test`,
      password: hashedSeedPassword,
    });
  }

  // put all test users in db

  await User.insertMany(hashedUsers);

  const testUser = await User.findOne(
    { username: hashedUsers[0].username },
    { _id: 1 }
  );

  // get some ids (created by db) to add as friends

  const friendPromises = [];

  for (let i = 1; i <= totalFriends; i++) {
    const friendPromise = User.findOne(
      { username: hashedUsers[i].username },
      { _id: 1 }
    );

    friendPromises.push(friendPromise);
  }

  const friends = await Promise.all(friendPromises);

  // push user ids into Bob_test friend list

  await User.updateOne(
    { _id: testUser._id },
    {
      $push: {
        contactIds: friends.map((friend) => friend._id),
      },
    }
  );

  // push conversations into db

  const testUsers = [testUser, ...friends];

  for (const message of seedMessages) {
    // nb don't use Promise.all, run awaits sequentially to maintain message order
    await Message.create({
      senderId: testUsers[message.senderIndex]._id,
      recipientId: testUsers[message.recipientIndex]._id,
      body: message.body,
    });
  }

  await db.disconnect();
}

seed();
