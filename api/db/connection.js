const db = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
const mongoUrl = process.env.TEST_URL;

const UserSchema = new db.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    contactIds: {
      type: [{ type: db.Schema.Types.ObjectId, ref: 'User' }],
      default: [],
    },
    isTest: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

// cascade delete
UserSchema.pre('deleteMany', async (next) => {
  const deletedUsers = await User.find({ isTest: true });
  const deletedIds = deletedUsers.map((user) => user._id);

  for (const id of deletedIds) {
    await Promise.all([
      Message.deleteMany({
        $or: [{ senderId: id }, { recipientId: id }],
      }),
      User.updateMany(
        { isTest: false },
        {
          $pull: { contactIds: id },
        }
      ),
    ]);
  }
});

const MessageSchema = new db.Schema(
  {
    senderId: { type: db.Schema.Types.ObjectId, ref: 'User', required: true },
    recipientId: {
      type: db.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    body: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

const User = db.model('User', UserSchema);
const Message = db.model('Message', MessageSchema);

module.exports = { db, mongoUrl, User, Message };
