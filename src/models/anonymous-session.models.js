import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema(
  {
    sessionTokenHash: {
      type: String,
      required: true,
    },
    reputation: {
      type: Number,
      default: 0,
    },
    cooldownuntil: {
      type: Date,
      required: true,
    },
    lastActiveAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

export const Session = mongoose.model('Session', sessionSchema);
