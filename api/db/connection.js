const db = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
const mongoUrl = process.env.MONGO_URL;

async function dbConnect() {
  await db.connect(mongoUrl);
}

const UserSchema = new db.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    contactIds: { type: [{ type: String }], default: [] },
  },
  { timestamps: true }
);

const User = db.model('User', UserSchema);

module.exports = { db, dbConnect, User };
