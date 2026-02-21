import mongoose from 'mongoose';

const moderationAnalysisSchema = new mongoose.Schema(
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
    toxicity: {
      type: Number,
      required: true,
    },
    selfHarmRisk: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const ModerationAnalysis = mongoose.model(
  'ModerationAnalysis',
  moderationAnalysisSchema
);
