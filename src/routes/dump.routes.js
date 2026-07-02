import { Router } from 'express';
import {
  createDump,
  deleteDump,
  getDumpById,
  listDumps,
  listPublicDumps,
  updateDump,
} from '../controllers/dump.controllers.js';
import { listPublicComments } from '../controllers/comment.controllers.js';
import commentRouter from './comment.routes.js';

import { requireSession } from '../middlewares/requireSession.middleware.js';
import { requireDumpOwner } from '../middlewares/dumpOwnership.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { createDumpSchema, updateDumpSchema } from '../utils/validators.js';

const router = Router();

router.route('/public').get(listPublicDumps);
router.route('/public/:dumpId/comments').get(listPublicComments);

router.use(requireSession);
router.route('/').get(listDumps).post(upload.none(), validate(createDumpSchema), createDump);
router
  .route('/:dumpId')
  .get(getDumpById)
  .patch(requireDumpOwner, validate(updateDumpSchema), updateDump)
  .delete(requireDumpOwner, deleteDump);

router.use('/:dumpId/comments', commentRouter);

export default router;
