import mongoose from 'mongoose';
import { asyncHandler } from '../utils/asyncHandler.js';
import { Comment } from '../models/comment.models.js';
import { Dump } from '../models/dump.models.js';

// import { moderateText } from '../utils/geminiModeration.js';
import { moderateText } from '../utils/moderation.ollama.js';

const publishComment = asyncHandler(async (req, res) => {
  const comment = req.comment;
  if (!comment) {
    return res.status(500).json({ message: 'Comment not loaded' });
  }

  const moderationResult = await moderateText(
    comment.text,
    'COMMENT',
    comment._id
  );

  if (moderationResult.decision === 'reject') {
    comment.status = 'Hidden';
    await comment.save();
    return res
      .status(400)
      .json({ message: 'Comment rejected due to policy violations' });
  } else {
    comment.status = 'Visible';
    await comment.save();
    return res
      .status(200)
      .json({ message: 'Comment published successfully', comment });
  }
});

const createComment = asyncHandler(async (req, res) => {
  const { dumpId } = req.params;
  const { text, action } = req.body;
  const normalizeAction = action?.trim() || 'Draft';
  const allowedActions = ['Draft', 'Publish'];

  if (!mongoose.Types.ObjectId.isValid(dumpId)) {
    return res.status(400).json({ message: 'Invalid dump id' });
  }

  if (!text?.trim()) {
    return res.status(400).json({ message: 'Text is required' });
  }

  if (!allowedActions.includes(normalizeAction)) {
    return res.status(400).json({ message: 'Invalid action' });
  }

  const session = req.session;

  const dump = await Dump.findById(dumpId);
  if (!dump) {
    return res.status(404).json({ message: 'Dump not found' });
  }

  if (dump.status === 'Draft' || dump.status === 'Hidden') {
    return res.status(404).json({ message: 'Dump not Visible' });
  }

  const comment = await Comment.create({
    text: text.trim(),
    dumpId: dump._id,
    status: 'Draft',
    sessionId: session._id,
  });
  req.comment = comment;
  if (normalizeAction === 'Publish') {
    return await publishComment(req, res);
  } else {
    return res.status(201).json({ message: 'comment Saved as draft', comment });
  }
});

const listComments = asyncHandler(async (req, res) => {
  const { dumpId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(dumpId)) {
    return res.status(400).json({ message: 'Invalid dump id' });
  }

  const dump = await Dump.findById(dumpId);
  if (!dump) {
    return res.status(404).json({ message: 'Dump not found' });
  }

  const comments = await Comment.find({ dumpId })
    .select('-dumpId -sessionId')
    .sort({
      createdAt: -1,
    });

  return res.status(200).json({ count: comments.length, comments });
});

const listPublicComments = asyncHandler(async (req, res) => {
  const { dumpId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(dumpId)) {
    return res.status(400).json({ message: 'Invalid dump id' });
  }

  const dump = await Dump.findById(dumpId);
  if (!dump) {
    return res.status(404).json({ message: 'Dump not found' });
  }

  if (dump.status !== 'Visible') {
    return res.status(404).json({ message: 'Dump not visible' });
  }

  const comments = await Comment.find({ dumpId, status: 'Visible' })
    .select('-dumpId -sessionId')
    .sort({ createdAt: -1 });

  return res.status(200).json({ count: comments.length, comments });
});

const getCommentById = asyncHandler(async (req, res) => {
  return res.status(501).json({ message: 'Not implemented' });
});

const updateComment = asyncHandler(async (req, res) => {
  const { text, status } = req.body;
  const allowedStatuses = ['Draft', 'Visible', 'Hidden'];

  const comment = req.comment;
  if (!comment) {
    return res.status(500).json({ message: 'Comment not loaded' });
  }

  if (text === undefined && status === undefined) {
    return res.status(400).json({ message: 'Nothing to update' });
  }

  if (text !== undefined) comment.text = text.trim();
  if (status !== undefined) {
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    comment.status = status;
  }

  await comment.save();

  return res.status(200).json({ message: 'Comment updated', comment });
});

const deleteComment = asyncHandler(async (req, res) => {
  const comment = req.comment;
  if (!comment) {
    return res.status(500).json({ message: 'Comment not loaded' });
  }

  await Comment.findByIdAndDelete(comment._id);

  return res.status(200).json({ message: 'Comment deleted' });
});

export {
  createComment,
  listComments,
  listPublicComments,
  getCommentById,
  updateComment,
  deleteComment,
};
