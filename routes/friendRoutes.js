import express from 'express';
const router = express.Router();

import { searchUsers, unFriendUsers, getFriendsByUserId } from '../controllers/friendController.js';

router.route('/search').get(searchUsers)
router.route('/unfriend').post(unFriendUsers)
router.route('/:userId').get(getFriendsByUserId)

export default router;