const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
const mongoUrl = process.env.DB_URL;

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    contactIds: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      default: [],
    },
    isTest: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

// cascade delete
UserSchema.pre('deleteMany', async (_next) => {
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

const MessageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    body: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

const User = mongoose.model('User', UserSchema);
const Message = mongoose.model('Message', MessageSchema);

module.exports = { mongoose, mongoUrl, User, Message };
