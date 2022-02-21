import express from 'express';
const router = express.Router();

import { searchUsers, unFriendUsers } from '../controllers/friendController.js';

router.route('/search').get(searchUsers)
router.route('/unfriend').post(unFriendUsers)

export default router;