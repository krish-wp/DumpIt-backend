import { Router } from 'express';
import {
  createComment,
  deleteComment,
  getCommentById,
  listComments,
  updateComment,
} from '../contollers/comment.controllers.js';
import { requireCommentOwner } from '../midddlewares/commentOwnership.middleware.js';
import { requireSession } from '../midddlewares/requireSession.middleware.js';

const router = Router({ mergeParams: true });

router.route('/').get(listComments).post(createComment);
router
  .route('/:commentId')
  .get(getCommentById)
  .patch(requireCommentOwner, updateComment)
  .delete(requireCommentOwner, deleteComment);

export default router;
