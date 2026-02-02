import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema(
  {
    sessionTokenHash: {
      type: String,
      required: true,
      unique: true,
    },
    reputation: {
      type: Number,
      default: 0,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true, collection: 'sessions' }
);

export const Session = mongoose.model('Session', sessionSchema);
