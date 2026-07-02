import mongoose from 'mongoose';
import { asyncHandler } from '../utils/asyncHandler.js';
import { Dump } from '../models/dump.models.js';
import { moderateText } from '../utils/geminiModeration.js';

const publishDump = asyncHandler(async (req, res) => {
  const dumpId = req.params.dumpId;

  if (!mongoose.Types.ObjectId.isValid(dumpId)) {
    return res.status(400).json({ message: 'Invalid dump id' });
  }

  const session = req.session;

  const dump = await Dump.findById(dumpId);

  if (!dump) {
    return res.status(404).json({ message: 'Dump not found' });
  }
  dump.status = 'Processing';
  await dump.save();

  const moderationResult = await moderateText(dump.text, 'DUMP', dumpId);

  if (moderationResult.decision === 'reject') {
    dump.status = 'Hidden';
    await dump.save();
    return res
      .status(400)
      .json({ message: 'Dump rejected due to policy violations' });
  } else if (moderationResult.decision === 'review') {
    dump.status = 'Processing';
    await dump.save();
    return res
      .status(200)
      .json({ message: 'Dump sent for review due to policy concerns', dump });
  } else {
    dump.status = 'Visible';
    await dump.save();
    return res
      .status(200)
      .json({ message: 'Dump published successfully', dump });
  }
});

const createDump = asyncHandler(async (req, res) => {
  const { text, topic, action } = req.body;

  const normalizedAction = action?.trim() || 'Draft';
  const allowedActions = ['Draft', 'Publish'];

  if (!text?.trim()) {
    return res.status(400).json({ message: 'Text is required' });
  }

  const session = req.session;

  const dump = await Dump.create({
    text: text.trim(),
    topic: topic?.trim(),
    status: 'Draft',
    sessionId: session._id,
  });

  const dumpId = dump._id;
  req.params.dumpId = dumpId;
  if (normalizedAction === 'Publish') {
    return await publishDump(req, res);
  } else {
    return res.status(201).json({ message: 'Dump Saved as draft', dump });
  }
});

const listDumps = asyncHandler(async (req, res) => {
  const { status, topic } = req.query;
  const filter = {};

  const session = req.session;
  filter.sessionId = session._id;

  if (status) filter.status = status;
  if (topic) filter.topic = topic;

  const dumps = await Dump.find(filter).sort({ createdAt: -1 });

  return res.status(200).json({ count: dumps.length, dumps });
});

const listPublicDumps = asyncHandler(async (req, res) => {
  const { topic } = req.query;
  const filter = { status: 'Visible' };

  if (topic) filter.topic = topic;

  const dumps = await Dump.find(filter)
    .select('-sessionId')
    .sort({ createdAt: -1 });
  return res.status(200).json({ count: dumps.length, dumps });
});

const getDumpById = asyncHandler(async (req, res) => {
  const { dumpId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(dumpId)) {
    return res.status(400).json({ message: 'Invalid dump id' });
  }

  const session = req.session;

  const dump = await Dump.findById(dumpId);

  if (!dump) {
    return res.status(404).json({ message: 'Dump not found' });
  }

  if (dump.sessionId && dump.sessionId.toString() !== session._id.toString()) {
    return res.status(403).json({ message: 'Not allowed to view this dump' });
  }

  return res.status(200).json({ dump });
});

const updateDump = asyncHandler(async (req, res) => {
  const { text, topic, status } = req.body;
  const allowedStatuses = [
    'Draft',
    'Processing',
    'Visible',
    'Review',
    'Hidden',
  ];

  const dump = req.dump;
  if (!dump) {
    return res.status(500).json({ message: 'Dump not loaded' });
  }

  if (text !== undefined) dump.text = text.trim();
  if (topic !== undefined) dump.topic = topic?.trim();
  if (status !== undefined) {
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    dump.status = status;
  }

  await dump.save();

  return res.status(200).json({ message: 'Dump updated', dump });
});

const deleteDump = asyncHandler(async (req, res) => {
  const dump = req.dump;
  if (!dump) {
    return res.status(500).json({ message: 'Dump not loaded' });
  }

  await Dump.findByIdAndDelete(dump._id);

  return res.status(200).json({ message: 'Dump deleted' });
});

export {
  createDump,
  listDumps,
  listPublicDumps,
  getDumpById,
  updateDump,
  deleteDump,
};
