import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    dumpId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Dump',
      required: true,
    },
    status: {
      type: String,
      enum: ['Draft', 'Visible', 'Review', 'Hidden'],
      default: 'Draft',
    },
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Session',
    },
  },
  { timestamps: true }
);

export const Comment = mongoose.model('Comment', commentSchema);
