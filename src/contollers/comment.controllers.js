import mongoose from 'mongoose';
import { asyncHandler } from '../utils/asyncHandler.js';
import { Comment } from '../models/comment.models.js';
import { Dump } from '../models/dump.models.js';
import { getSessionFromCookie } from '../utils/getsessionId.js';

const createComment = asyncHandler(async (req, res) => {
  const { dumpId } = req.params;
  const { text, action } = req.body;
  const normalizedStatus = action?.trim() || 'Draft';
  const allowedStatuses = ['Draft', 'Visible', 'Review', 'Hidden'];

  if (!mongoose.Types.ObjectId.isValid(dumpId)) {
    return res.status(400).json({ message: 'Invalid dump id' });
  }

  if (!text?.trim()) {
    return res.status(400).json({ message: 'Text is required' });
  }

  if (!allowedStatuses.includes(normalizedStatus)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  const session = await getSessionFromCookie(req);

  if (!session) {
    return res
      .status(401)
      .json({ message: 'Session is invalid. Please start a session.' });
  }

  const dump = await Dump.findById(dumpId);
  if (!dump) {
    return res.status(404).json({ message: 'Dump not found' });
  }

  const comment = await Comment.create({
    text: text.trim(),
    dumpId: dump._id,
    status: normalizedStatus,
    sessionId: session._id,
  });

  return res.status(201).json({ message: 'Comment created', comment });
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

  const comments = await Comment.find({ dumpId }).sort({ createdAt: -1 });

  return res.status(200).json({ count: comments.length, comments });
});

const getCommentById = asyncHandler(async (req, res) => {
  return res.status(501).json({ message: 'Not implemented' });
});

const updateComment = asyncHandler(async (req, res) => {
  const { text, status } = req.body;
  const allowedStatuses = ['Draft', 'Visible', 'Review', 'Hidden'];

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
  getCommentById,
  updateComment,
  deleteComment,
};
