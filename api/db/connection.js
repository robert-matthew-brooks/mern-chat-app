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
    contactIds: {
      type: [{ type: db.Schema.Types.ObjectId, ref: 'User' }],
      default: [],
    },
  },
  { timestamps: true }
);

const MessageSchema = new db.Schema(
  {
    senderId: { type: db.Schema.Types.ObjectId, ref: 'User', required: true },
    recipientId: {
      type: db.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    body: { type: String, required: true },
  },
  { timestamps: true }
);

const User = db.model('User', UserSchema);
const Message = db.model('Message', MessageSchema);

module.exports = { db, dbConnect, User, Message };
