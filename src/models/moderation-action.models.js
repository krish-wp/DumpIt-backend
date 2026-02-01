import mongoose from 'mongoose';

const moderationActionSchema = new mongoose.Schema(
  {
    targetType: {
      type: String,
      enum: ['COMMENT', 'DUMP'],
      required: true,
    },
    targetId: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      enum: ['ALLOW', 'HIDE'],
      required: true,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
    },
    decidedBy: {
      type: String,
      default: 'rule-engine',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const ModerationAction = mongoose.model(
  'ModerationAction',
  moderationActionSchema
);
