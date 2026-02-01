import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema(
  {
    sessionTokenHash: {
      type: string,
      required: true,
    },
    reputation: {
      type: int,
      default: 0,
    },
    coolDownUntil: {
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
