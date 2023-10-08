const db = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
const mongoUrl = process.env.MONGO_URL;

function dbConnect() {
  db.connect(mongoUrl);
}

module.exports = { db, dbConnect };
