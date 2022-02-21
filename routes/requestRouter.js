import express from 'express';
const router = express.Router();

import { createRequest, getRequestByUserId, updateRequest } from '../controllers/requestController.js';

router.route('/:id').get(getRequestByUserId)
router.route('/create').post(createRequest)
router.route('/delete').delete(createRequest)
router.route('/acceptFriend').post(updateRequest)

export default router;