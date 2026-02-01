import crypto from 'crypto';

const hashSessionId = (sessionId) => {
  return crypto.createHash('sha256').update(id).digest('hex');
};

export { hashSessionId };
