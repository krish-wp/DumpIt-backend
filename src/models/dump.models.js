import mongoose from 'mongoose';

const dumpSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    topic: {
      type: String,
    },
    status: {
      type: String,
      enum: ['Draft', 'Visible', 'Hidden', 'Processing'],
      default: 'Draft',
    },
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Session',
    },
  },
  { timestamps: true }
);

export const Dump = mongoose.model('Dump', dumpSchema);
