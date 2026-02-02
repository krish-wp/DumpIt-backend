import { Router } from 'express';
import {
  createSession,
  deleteSession,
} from '../contollers/anonymous-session.controllers.js';

const router = Router();

router.route('/start-session').post(createSession);
router.route('/delete-session').delete(deleteSession);

export default router;
