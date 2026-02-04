import { asyncHandler } from '../utils/asyncHandler.js';
import { getSessionFromCookie } from '../utils/getsessionId.js';

const requireSession = asyncHandler(async (req, res, next) => {
  const session = await getSessionFromCookie(req);
  if (!session) {
    return res
      .status(401)
      .json({ message: 'Session is invalid. Please start a session.' });
  }

  req.session = session;
  return next();
});

export { requireSession };
