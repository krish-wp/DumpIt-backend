import { Session } from '../models/anonymous-session.models.js';
import { hashSessionId } from './hash.js';

const getSessionFromCookie = async (req) => {
  const sessionId = req?.cookies?.sessionId;
  if (!sessionId) return null;

  const hashedSessionId = hashSessionId(sessionId);

  const session = await Session.findOne({
    sessionTokenHash: hashedSessionId,
    expiresAt: { $gt: new Date() },
  });

  return session;
};

export { getSessionFromCookie };
