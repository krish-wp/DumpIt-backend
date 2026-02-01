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
      type: float,
      required: true,
    },
    intent: {
      type: String,
      required: true,
      trim: true,
    },
    selfHarmRisk: {
      type: float,
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
