import { Router } from 'express';
import {
  createComment,
  deleteComment,
  getCommentById,
  listComments,
  updateComment,
} from '../controllers/comment.controllers.js';
import { requireCommentOwner } from '../middlewares/commentOwnership.middleware.js';
import { requireSession } from '../middlewares/requireSession.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { createCommentSchema, updateCommentSchema } from '../utils/validators.js';

const router = Router({ mergeParams: true });

router.route('/').get(listComments).post(upload.none(), validate(createCommentSchema), createComment);
router
  .route('/:commentId')
  .get(getCommentById)
  .patch(upload.none(), requireCommentOwner, validate(updateCommentSchema), updateComment)
  .delete(requireCommentOwner, deleteComment);

export default router;
