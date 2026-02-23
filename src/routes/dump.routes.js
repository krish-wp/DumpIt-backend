import { Router } from 'express';
import {
  createDump,
  deleteDump,
  getDumpById,
  listDumps,
  listPublicDumps,
  updateDump,
} from '../contollers/dump.controllers.js';
import { listPublicComments } from '../contollers/comment.controllers.js';
import commentRouter from './comment.routes.js';

import { requireSession } from '../midddlewares/requireSession.middleware.js';
import { requireDumpOwner } from '../midddlewares/dumpOwnership.middleware.js';
import { upload } from '../midddlewares/multer.middleware.js';

const router = Router();

router.route('/public').get(listPublicDumps);
router.route('/public/:dumpId/comments').get(listPublicComments);

router.use(requireSession);
router.route('/').get(listDumps).post(upload.none(), createDump);
router
  .route('/:dumpId')
  .get(getDumpById)
  .patch(requireDumpOwner, updateDump)
  .delete(requireDumpOwner, deleteDump);

router.use('/:dumpId/comments', commentRouter);

export default router;
