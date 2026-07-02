import { asyncHandler } from '../utils/asyncHandler.js';
import { v4 as uuidv4 } from 'uuid';
import { hashSessionId } from '../utils/hash.js';
import { Session } from '../models/anonymous-session.models.js';

const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000;

const createSession = asyncHandler(async (req, res) => {
  const newSessionId = uuidv4();
  const hashedSessionId = hashSessionId(newSessionId);

  await Session.create({
    sessionTokenHash: hashedSessionId,
    expiresAt: new Date(Date.now() + SESSION_DURATION),
  });

  res.cookie('sessionId', newSessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    maxAge: SESSION_DURATION,
  });

  return res.json({
    message: 'Session created successfully',
  });
});

const openSession = asyncHandler(async (req, res) => {
  const sessionId = req?.cookies?.sessionId;

  if (!sessionId) {
    return createSession(req, res);
  } else {
    const hashedSessionId = hashSessionId(sessionId);
    const session = await Session.findOne({
      sessionTokenHash: hashedSessionId,
    });

    if (!session) {
      return res.status(401).send('Session Is not valid');
    } else if (session.expiresAt < new Date()) {
      return createSession(req, res);
    } else {
      return res.json({ message: 'Session is valid' });
    }
  }
});

const deleteSession = asyncHandler(async (req, res) => {
  const sessionId = req?.cookies?.sessionId;

  if (!sessionId) {
    return res.send('please start session first');
  }

  const hashedSessionId = hashSessionId(sessionId);

  await Session.findOneAndDelete({ sessionTokenHash: hashedSessionId });

  res.clearCookie('sessionId');

  return res.status(200).json({
    message: 'session deleted successfully',
    status: '200',
  });
});

export { openSession, deleteSession };
