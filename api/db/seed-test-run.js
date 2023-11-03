const { mongoose, mongoUrl } = require('./connection');
const { seedTestAccounts } = require('./seed');

const runSeedTest = async () => {
  await mongoose.connect(mongoUrl);
  await seedTestAccounts();
  await mongoose.disconnect();
};

runSeedTest();
