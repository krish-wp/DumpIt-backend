import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
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
    reporterSessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Session',
    },
    reason: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Report = mongoose.model('Report', reportSchema);
