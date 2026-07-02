import { Router } from 'express';
import {
  openSession,
  deleteSession,
} from '../controllers/anonymous-session.controllers.js';

const router = Router();

router.route('/start-session').post(openSession);
router.route('/delete-session').delete(deleteSession);

export default router;
