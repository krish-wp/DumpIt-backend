import crypto from 'crypto';

const hashSessionId = (sessionId) => {
  return crypto.createHash('sha256').update(sessionId).digest('hex');
};

export { hashSessionId };
