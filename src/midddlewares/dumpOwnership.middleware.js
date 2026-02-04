import mongoose from 'mongoose';
import { Dump } from '../models/dump.models.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { getSessionFromCookie } from '../utils/getsessionId.js';

const requireDumpOwner = asyncHandler(async (req, res, next) => {
  const { dumpId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(dumpId)) {
    return res.status(400).json({ message: 'Invalid dump id' });
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

  if (dump.sessionId && dump.sessionId.toString() !== session._id.toString()) {
    return res.status(403).json({ message: 'Not allowed to modify this dump' });
  }

  req.dump = dump;
  req.session = session;
  return next();
});

export { requireDumpOwner };
