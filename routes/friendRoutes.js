import express from 'express';
const router = express.Router();

import { searchUsers, unFriendUsers, getFriendsByUserId, getSingleUser } from '../controllers/friendController.js';

router.route('/search').get(searchUsers)
router.route('/unfriend').post(unFriendUsers)
router.route('/:userId').get(getFriendsByUserId)
router.route('/user/:userId').get(getSingleUser)

export default router;