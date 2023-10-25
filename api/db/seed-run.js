const { mongoose, mongoUrl } = require('./connection');
const { seed } = require('./seed');

const runSeed = async () => {
  await mongoose.connect(mongoUrl);
  await seed();
  await mongoose.disconnect();
};

runSeed();
