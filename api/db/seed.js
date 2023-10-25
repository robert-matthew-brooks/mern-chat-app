const fs = require('fs');
const { User, Message } = require('./connection');
const { hash } = require('../util/encrypt');

const seedUsername = 'bob_test';
const seedPassword = 'testpass1';
const totalUsers = 50;
const totalFriends = 3;
const timestamp = new Date();
timestamp.setHours(timestamp.getHours() - 5);

async function insertTestData() {
  // get test data

  const seedUsernames = [
    seedUsername,
    ...fs
      .readFileSync(`${__dirname}/seed-names`, 'utf-8')
      .split('\n')
      .filter((name) => name.length > 0)
      .sort(() => Math.random() - 0.5)
      .slice(0, totalUsers)
      .map((name) => `${name.toLowerCase()}_test`),
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

  // make all test users

  const hashedUsers = [];
  const hashedSeedPassword = hash(seedPassword);

  for (const username of seedUsernames) {
    hashedUsers.push({
      username,
      password: hashedSeedPassword,
      isTest: true,
    });
  }

  // put all test users in db

  await User.insertMany(hashedUsers);

  const bobUser = await User.findOne(
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

  // push user ids into bob_test friend list

  await User.updateOne(
    { _id: bobUser._id },
    {
      $push: {
        contactIds: friends.map((friend) => friend._id),
      },
    }
  );

  // push user bob_test into friends' friend list

  for (const friend of friends) {
    await User.updateOne(
      { _id: friend._id },
      {
        $push: {
          contactIds: bobUser._id,
        },
      }
    );
  }

  // push conversations into db

  const testUsers = [bobUser, ...friends];
  const messagePromises = [];

  for (const message of seedMessages) {
    messagePromises.push(
      Message.create({
        senderId: testUsers[message.senderIndex]._id,
        recipientId: testUsers[message.recipientIndex]._id,
        body: message.body,
        createdAt: timestamp.setMinutes(timestamp.getMinutes() + 3),
      })
    );
  }

  await Promise.all(messagePromises);
}

async function seed() {
  // cascade delete all data
  await User.deleteMany({});
  await insertTestData();
}

async function seedTestAccounts() {
  // cascade delete all test message/contact data
  await User.deleteMany({ isTest: true });
  await insertTestData();
}

module.exports = { seed, seedTestAccounts };
