import mongoose from 'mongoose';
import { Comment } from '../models/comment.models.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { getSessionFromCookie } from '../utils/getsessionId.js';
import { Dump } from '../models/dump.models.js';

const requireCommentOwner = asyncHandler(async (req, res, next) => {
  const { dumpId, commentId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(dumpId)) {
    return res.status(400).json({ message: 'Invalid dump id' });
  }

  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    return res.status(400).json({ message: 'Invalid comment id' });
  }

  const dump = await Dump.findById(dumpId);
  if (!dump) {
    return res.status(404).json({ message: 'Dump not found' });
  }

  const comment = await Comment.findOne({ dumpId });
  if (!comment) {
    return res.status(404).json({ message: 'Comment not found' });
  }

  if (comment.dumpId.toString() !== dumpId) {
    return res.status(400).json({ message: 'Comment not in this dump' });
  }

  if (
    comment.sessionId &&
    comment.sessionId.toString() !== session._id.toString()
  ) {
    return res.status(403).json({ message: 'Not allowed to modify comment' });
  }

  req.comment = comment;
  req.session = session;
  return next();
});

export { requireCommentOwner };
